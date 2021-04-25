namespace asteroids {
    export class Body {
        enabled: boolean;
        v: Vec2;
        mass_: Fx8;
        private friction_: Fx8;
        private vf: Vec2;

        //% blockCombine block="xfrm" callInDebugger
        get xfrm() { return this.sprite.xfrm; }

        //% blockCombine block="radius" callInDebugger
        get radius() { return this.sprite.radius; }

        //% blockCombine block="mass" callInDebugger
        get mass() { return this.mass_; }
        set mass(v) { this.mass_ = v; }

        //% blockCombine block="friction" callInDebugger
        get friction() { return this.friction_; }
        set friction(v) {
            this.friction_ = v;
            this.vf = new Vec2(Fx.sub(Fx.oneFx8, v), Fx.sub(Fx.oneFx8, v));
        }

        constructor(public sprite: Sprite, public onCollision: (other: Sprite) => void) {
            this.v = new Vec2();
            this.mass = Fx.oneFx8;
            this.friction = Fx.zeroFx8;
        }

        applyFriction() {
            if (this.friction_ === Fx.zeroFx8) { return; }
            Vec2.MulToRef(this.v, this.vf, this.v);
        }

        applyVelocity() {
            this.xfrm.pos.x = Fx.add(this.xfrm.pos.x, this.v.x);
            this.xfrm.pos.y = Fx.sub(this.xfrm.pos.y, this.v.y);
            Vec2.ScreenWrapToRef(this.xfrm.pos, this.xfrm.pos);
        }

        // Pass negative maxSpeed for no maximum.
        public applyImpulse(v: Vec2, maxSpeed: Fx8) {
            Vec2.AddToRef(this.v, v, this.v);
            if (maxSpeed >= Fx.zeroFx8 && this.v.magSq() > Fx.mul(maxSpeed, maxSpeed)) {
                Vec2.SetLengthToRef(this.v, maxSpeed, this.v);
            }
        }

        public stopMoving() {
            this.v.x = Fx.zeroFx8;
            this.v.y = Fx.zeroFx8;
        }
    };

    export class Physics {
        bodies: Body[];
        deadBodies: Body[];

        constructor() {
            this.bodies = [];
            this.deadBodies = [];
        }
        
        public addBody(body: Body) {
            this.bodies.push(body);
            body.enabled = true;
        }

        public removeBody(body: Body) {
            body.enabled = false;
            this.deadBodies.push(body);
        }

        public simulate() {
            if (this.deadBodies.length) {
                this.bodies = this.bodies.filter(elem => !this.deadBodies.find(dead => elem === dead));
                this.deadBodies = [];
            }

            for (let i = 0; i < this.bodies.length; ++i) {
                const body1 = this.bodies[i];
                if (!body1.enabled) { continue; }
                for (let j = i + 1; j < this.bodies.length; ++j) {
                    const body2 = this.bodies[j];
                    if (!body2.enabled) { continue; }
                    this.checkCollision(body1, body2);
                }
            }

            for (const body of this.bodies) {
                if (!body.enabled) { continue; }
                body.applyFriction();
                body.applyVelocity();
            }
        }

        private checkCollision(body1: Body, body2: Body) {
            const minDist = Fx.add(body1.radius, body2.radius);
            const minDistSq = Fx.mul(minDist, minDist);
            const vDiff = Vec2.SubToRef(body2.xfrm.pos, body1.xfrm.pos, new Vec2());
            const distSq = vDiff.magSq();
            // Not colliding?
            if (distSq > minDistSq) { return; }

            //
            // Following code is for bodies bouncing off one another.
            // May be useful in a future game!
            //

            //const dist = Fx8(Math.sqrt(Fx.toFloat(distSq)));
            //const vNormCollision = Vec2.ScaleToRef(vDiff, dist, new Vec2());
            //const vRelVelocity = Vec2.SubToRef(body1.v, body2.v, new Vec2());
            //let speed = Fx.abs(Vec2.MulToRef(vRelVelocity, vNormCollision, new Vec2()).magSq());
            // speed *= Math.min(body1.restitution, body2.restitution);
            //const impulse = Fx.div(Fx.mul(Fx8(2), speed), Fx.add(body1.mass, body2.mass));
            //if (body1.bumpCanMove) {
            //    body1.vx -= (impulse * body2.mass * vNormCollisionX);
            //    body1.vy -= (impulse * body2.mass * vNormCollisionY);
            //}
            //if (body2.bumpCanMove) {
            //    body2.vx += (impulse * body1.mass * vNormCollisionX);
            //    body2.vy += (impulse * body1.mass * vNormCollisionY);
            //}

            body1.onCollision(body2.sprite);
            body2.onCollision(body1.sprite);
        }

        public debugDraw(ofs: Vec2) {
            const img = scene.backgroundImage();
            for (let i = 0; i < this.bodies.length; ++i) {
                const body = this.bodies[i];
                if (!body.enabled) { continue; }
                img.drawCircle(
                    Fx.toInt(Fx.sub(body.xfrm.pos.x, ofs.x)),
                    Fx.toInt(Fx.sub(body.xfrm.pos.y, ofs.y)),
                    Fx.toFloat(body.radius),
                    constants.DBG_DRAW_PHYSICS_COLOR);
            }
        }
    }
}