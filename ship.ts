namespace asteroids {
    export class Ship extends Sprite {
        private hull: PolygonSprite;
        private thruster: PolygonSprite;
        private thrustActive: boolean;
        private body: Body;
        private activeBlips: Blip[];
        private freeBlips: Blip[];

        public get enabled() { return this.body.enabled; }
        public set enabled(v) {
            this.visible = v;
            this.body.enabled = v;
        }

        constructor() {
            super(ObjKind.Ship);
            this.xfrm.scl = constants.SHIP_SCALE;
            this.activeBlips = [];
            this.freeBlips = [];
            for (let i = 0; i < constants.SHIP_MAX_BLIPS; ++i) {
                const blip = new Blip();
                blip.onBlipCollision = (blip, other) => this.onBlipCollision(blip, other);
                this.freeBlips.push(blip);
            }
            // Share ship transform with hull and thruster sprites (we don't support sprite hierarchies)
            this.hull = new PolygonSprite(shapes.Ship, {
                xfrm: this.xfrm,
                color: constants.SHIP_HULL_COLOR
            });
            this.thruster = new PolygonSprite(shapes.Thruster, {
                xfrm: this.xfrm,
                color: constants.SHIP_THRUSTER_COLOR
            });
            this.thruster.imprecise = true; // minor variations in thruster fire looks nice.
            // Be forgiving on ship collision radius.
            this.radius_ = Fx.mul(this.hull.radius, Fx8(0.25));
            this.body = new Body(this, (other) => this.onCollision(other));
            this.body.friction = constants.SHIP_FRICTION;
            Game.Instance.physics.addBody(this.body);
        }

        public rotateLeft() {
            if (!this.enabled) return;
            this.xfrm.rot -= constants.SHIP_ROTATION_SPEED;
        }

        public rotateRight() {
            if (!this.enabled) return;
            this.xfrm.rot += constants.SHIP_ROTATION_SPEED;
        }

        public thrust() {
            if (!this.enabled) return;
            this.thrustActive = true;
            // Thruse in the ship's facing direction.
            const s = trig.sin(this.xfrm.rot);
            const c = trig.cos(this.xfrm.rot);
            const impulse = new Vec2(Fx.mul(s, constants.SHIP_THRUST_INCR), Fx.mul(c, constants.SHIP_THRUST_INCR));
            this.body.applyImpulse(impulse, constants.SHIP_MAX_SPEED);
        }

        public fire() {
            if (!this.enabled) return;
            const blip = this.freeBlips.pop();
            if (blip) {
                this.activeBlips.push(blip);
                blip.body.enabled = true;
                blip.visible = true;
                Game.Instance.physics.addBody(blip.body);
                blip.startTime = control.millis();
                blip.xfrm.rot = this.xfrm.rot;
                // Place the blip at the ship front.
                blip.xfrm.pos.x = this.hull.polygon.polylines[0].points[1].x;
                blip.xfrm.pos.y = this.hull.polygon.polylines[0].points[1].y;
                // Shoot blip in the ship's facing direction and inherit the ship's speed.
                const s = trig.sin(this.xfrm.rot);
                const c = trig.cos(this.xfrm.rot);
                const vel = constants.BLIP_INHERIT_SHIP_SPEED ? this.body.v : Vec2.Zero();
                const impulse = new Vec2(
                    Fx.add(vel.x, Fx.mul(s, constants.BLIP_SPEED)),
                    Fx.add(vel.y, Fx.mul(c, constants.BLIP_SPEED)));
                blip.body.applyImpulse(impulse, fx.negOneFx8);
            }
        }

        public hyperspace() {
            if (!this.enabled) return;
            const margin = Fx8(10);
            let spawnLoc = Vec2.RandomRangeToRef(
                Fx.add(Game.LEFT_EDGE, margin), Fx.sub(Game.RIGHT_EDGE, margin),
                Fx.add(Game.TOP_EDGE, margin), Fx.sub(Game.BOTTOM_EDGE, margin),
                new Vec2());
            Game.Instance.shipEnabled = false;
            setTimeout(() => {
                this.reset();
                this.xfrm.pos.copyFrom(spawnLoc);
                Game.Instance.shipEnabled = true;
            }, 500);
        }

        public reset() {
            this.xfrm.pos.copyFrom(Vec2.Zero());
            this.xfrm.rot = 0;
            this.body.v.copyFrom(Vec2.Zero());
        }

        onCollision(other: Sprite) {
        }

        onBlipCollision(blip: Blip, other: Sprite) {
        }

        update(force = false) {
            if (!this.enabled) return;
            const now = control.millis();
            const dirty = this.xfrm.dirty || force;
            super.update(force);
            this.hull.update(dirty);
            this.thruster.update(dirty);
            if (this.activeBlips.length) {
                const deadBlips: Blip[] = [];
                this.activeBlips.forEach(blip => {
                    if (now - blip.startTime >= constants.BLIP_LIFETIME) {
                        deadBlips.push(blip);
                        Game.Instance.physics.removeBody(blip.body);
                        blip.body.stopMoving();
                    } else {
                        blip.update();
                    }
                });
                if (deadBlips.length) {
                    this.activeBlips = this.activeBlips.filter(blip => deadBlips.indexOf(blip) < 0);
                    deadBlips.forEach(blip => this.freeBlips.push(blip));
                }
            }
        }

        draw(offset: Vec2) {
            if (!this.enabled) return;
            this.hull.draw(offset);
            if (this.thrustActive) {
                // Flicker the thruster fire.
                if ((control.millis() % 100) > 50) {
                    this.thruster.draw(offset);
                }
                this.thrustActive = false;
            }
            this.activeBlips.forEach(blip => blip.draw(offset));
        }
    }

    class ExplosionSegment {
        sprite: Sprite;
        v: Vec2;

        constructor(a: Vec2, b: Vec2, v: Vec2, xfrm: Transform) {
            this.sprite = new PolygonSprite(new Polygon([new Polyline([a, b])]));
            this.v = v;
            this.sprite.xfrm.copyFrom(xfrm);
        }

        update(force = false) {
            Vec2.TranslateToRef(this.sprite.xfrm.pos, this.v, this.sprite.xfrm.pos);
            this.sprite.update(force);
        }

        draw(ofs: Vec2) {
            this.sprite.draw(ofs);
        }
    }

    export class ExplodingShip extends Sprite {
        private segments: ExplosionSegment[];
        private enabled: boolean;

        constructor() {
            super();
            this.enabled = false;
        }

        public enableAt(xfrm: Transform) {
            this.xfrm.copyFrom(xfrm);
            this.segments = [
                new ExplosionSegment(Vec2.N(-3, 3), Vec2.N(0, -6), Vec2.N(-0.09, -0.075), this.xfrm),
                new ExplosionSegment(Vec2.N(0, -6), Vec2.N(3, 3), Vec2.N(0.05, -0.076), this.xfrm),
                new ExplosionSegment(Vec2.N(2.5, 2), Vec2.N(-2.5, 2), Vec2.N(0.01, 0.098), this.xfrm),
            ];
            this.enabled = true;
        }

        public disable() {
            this.enabled = false;
        }

        update(force = false) {
            if (!this.enabled) return;
            super.update(force);
            for (let i = 0; i < this.segments.length; ++i) {
                this.segments[i].update(force);
            }
        }

        draw(offset: Vec2) {
            if (!this.enabled) return;
            for (let i = 0; i < this.segments.length; ++i) {
                const segment = this.segments[i];
                segment.draw(offset);
            }
        }
    }
}