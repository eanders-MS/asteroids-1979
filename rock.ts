namespace asteroids {
    export enum RockSize {
        Small = 1,
        Medium = 2,
        Large = 3
    }

    export class Rock extends Sprite {
        private r: PolygonSprite;
        private sz_: RockSize;
        private body: Body;
        public angle: number;


        public get radius() { return this.r.radius; }
        public get size() { return this.sz_; }
        public get xfrm() { return this.r.xfrm; }

        constructor(size: RockSize, opts?: {
            xfrm?: Transform
        }) {
            super(ObjKind.Rock);
            this.r = new PolygonSprite(Math.pickRandom(shapes.Rocks), {
                kind: ObjKind.Rock,
                xfrm: opts && opts.xfrm,
                color: Rock.ColorForSize(size)
            });
            this.initSize(size);
            this.body = new Body(this, (other) => this.onCollision(other));
            Game.Instance.physics.addBody(this.body);
        }

        deinit() {
            Game.Instance.physics.removeBody(this.body);
        }

        private static ColorForSize(sz: RockSize): number {
            switch (sz) {
                case RockSize.Large: return constants.ROCK_COLOR_LARGE;
                case RockSize.Medium: return constants.ROCK_COLOR_MEDIUM;
                case RockSize.Small: return constants.ROCK_COLOR_SMALL;
            }
        }

        private initSize(v: RockSize) {
            this.sz_ = v;
            switch (v) {
                case RockSize.Small: {
                    this.r.xfrm.scl = constants.ROCK_SCALE_SMALL;
                    break;
                }
                case RockSize.Medium: {
                    this.r.xfrm.scl = constants.ROCK_SCALE_MEDIUM;
                    break;
                }
                case RockSize.Large: {
                    this.r.xfrm.scl = constants.ROCK_SCALE_LARGE;
                    break;
                }
            }
        }

        go(angle: number) {
            this.angle = angle;
            const s = trig.sin(angle);
            const c = trig.cos(angle);
            let speed: Fx8;

            switch (this.size) {
                case RockSize.Large: {
                    speed = constants.ROCK_SPEED_LARGE;
                    break;
                }
                case RockSize.Medium: {
                    speed = Fx.add(Fx.mul(constants.ROCK_SPEED_LARGE, Fx8(1.5)), (Fx.mul(fx.random(), Fx.sub(constants.ROCK_SPEED_MEDIUM, constants.ROCK_SPEED_LARGE))));
                    break;
                }
                case RockSize.Small: {
                    speed = Fx.add(Fx.mul(constants.ROCK_SPEED_MEDIUM, Fx8(1.5)), (Fx.mul(fx.random(), Fx.sub(constants.ROCK_SPEED_SMALL, constants.ROCK_SPEED_MEDIUM))));
                    break;
                }
            }

            const impulse = new Vec2(Fx.mul(s, speed), Fx.mul(c, speed));
            this.body.applyImpulse(impulse, fx.negOneFx8);
        }

        onCollision(other: Sprite) {
            Game.Instance.rockHit(this, other);
        }

        update(force = false) {
            const dirty = this.xfrm.dirty;
            super.update(force);
            this.r.update(dirty || force);
        }

        draw(ofs: Vec2) {
            this.r.draw(ofs);
        }
    }
}