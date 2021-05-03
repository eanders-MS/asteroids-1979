namespace asteroids {
    let cachedSin: Fx8[];
    let cachedCos: Fx8[];

    // The number of angle steps in a full circle.
    const NUM_SLICES = 100;

    export class fx {
        public static negOneFx8 = Fx8(-1);

        public static sign(v: Fx8): Fx8 {
            return v >= Fx.zeroFx8 ? Fx.oneFx8 : Fx8(-1);
        }
        public static clamp(v: Fx8, min: Fx8, max: Fx8): Fx8 {
            return Fx.max(min, Fx.min(v, max));
        }
        public static xor(a: Fx8, b: Fx8): Fx8 {
            return ((a as any as number) ^ (b as any as number)) as any as Fx8;
        }
        public static floor(v: Fx8): Fx8 {
            return Fx.leftShift(Fx.rightShift(v, 8), 8);
        }
        public static round(v: Fx8): Fx8 {
            return fx.floor(Fx.add(Fx.mul(fx.sign(v), Fx8(0.5)), v));
        }
        public static random(): Fx8 {
            return Fx8(Math.random());
        }
        public static randomRange(min: Fx8, max: Fx8): Fx8 {
            return fx.irandomRange(Fx.toFloat(min), Fx.toFloat(max));
        }
        public static irandomRange(min: number, max: number): Fx8 {
            return Fx8(Math.randomRange(min, max));
        }
    }
    
    export class trig {
        public static init() {
            if (!cachedSin) {
                cachedSin = trig.cacheSin(NUM_SLICES);
                cachedCos = trig.cacheCos(NUM_SLICES);
            }
        }

        /**
         * angle in NUM_SLICES
         */
        public static sin(angle: number): Fx8 {
            angle %= NUM_SLICES;
            if (angle < 0) angle += NUM_SLICES;
            angle = Math.floor(angle);
            return cachedSin[angle];
        }

        /**
         * angle in NUM_SLICES
         */
        public static cos(angle: number): Fx8 {
            angle %= NUM_SLICES;
            if (angle < 0) angle += NUM_SLICES;
            angle = Math.floor(angle);
            return cachedCos[angle];
        }

        private static cacheSin(slices: number): Fx8[] {
            let sin: Fx8[] = [];
            let anglePerSlice = 2 * Math.PI / slices;
            for (let i = 0; i < slices; i++) {
                sin.push(Fx8(Math.sin(i * anglePerSlice)));
            }
            return sin;
        }

        private static cacheCos(slices: number): Fx8[] {
            let cos: Fx8[] = [];
            let anglePerSlice = 2 * Math.PI / slices;
            for (let i = 0; i < slices; i++) {
                cos.push(Fx8(Math.cos(i * anglePerSlice)));
            }
            return cos;
        }
    }
    trig.init();

    export class Vec2 {
        public dirty: boolean;

        //% blockCombine block="x" callInDebugger
        public get x() { return this.x_; }
        public set x(v: Fx8) {
            this.x_ = v;
            this.dirty = true;
        }

        //% blockCombine block="y" callInDebugger
        public get y() { return this.y_; }
        public set y(v: Fx8) {
            this.y_ = v;
            this.dirty = true;
        }

        constructor(public x_ = Fx.zeroFx8, public y_ = Fx.zeroFx8) {
        }

        public clone(): Vec2 {
            return new Vec2(this.x, this.y);
        }

        public copyFrom(v: Vec2): this {
            this.x = v.x;
            this.y = v.y;
            return this;
        }

        public set(x: Fx8, y: Fx8): this {
            this.x = x;
            this.y = y;
            return this;
        }

        public setF(x: number, y: number): this {
            this.x = Fx8(x);
            this.y = Fx8(y);
            return this;
        }

        public magSq(): Fx8 {
            return Fx.add(Fx.mul(this.x, this.x), Fx.mul(this.y, this.y));
        }

        public magSqF(): number {
            return Fx.toFloat(this.magSq());
        }

        public mag(): Fx8 {
            return Fx8(Math.sqrt(this.magSqF()));
        }

        public static Zero(): Vec2 {
            return new Vec2(Fx.zeroFx8, Fx.zeroFx8);
        }

        public static N(x: number, y: number): Vec2 {
            return new Vec2(Fx8(x), Fx8(y));
        }

        public static RotateToRef(v: Vec2, angle: number, ref: Vec2): Vec2 {
            const s = trig.sin(angle);
            const c = trig.cos(angle);
            const xp = Fx.sub(Fx.mul(v.x, c), Fx.mul(v.y, s));
            const yp = Fx.add(Fx.mul(v.x, s), Fx.mul(v.y, c));
            ref.x = xp;
            ref.y = yp;
            return ref;
        }

        public static TranslateToRef(v: Vec2, p: Vec2, ref: Vec2): Vec2 {
            ref.x = Fx.add(v.x, p.x);
            ref.y = Fx.add(v.y, p.y);
            return ref;
        }

        public static ScaleToRef(v: Vec2, scale: Fx8, ref: Vec2): Vec2 {
            ref.x = Fx.mul(v.x, scale);
            ref.y = Fx.mul(v.y, scale);
            return ref;
        }

        public static FloorToRef(v: Vec2, ref: Vec2): Vec2 {
            ref.x = fx.floor(v.x);
            ref.y = fx.floor(v.y);
            return ref;
        }

        public static TransformToRef(v: Vec2, xfrm: Transform, ref: Vec2): Vec2 {
            // Note: order of operations are reversed from what a 3D engine would do.
            // Scale first so that pos isn't scaled.
            xfrm.scl !== Fx.oneFx8 && (v = Vec2.ScaleToRef(v, xfrm.scl, ref));
            // Rotate in local coords.
            xfrm.rot !== 0 && (v = Vec2.RotateToRef(v, xfrm.rot, ref));
            // Translate in global coords.
            return Vec2.TranslateToRef(v, xfrm.pos, ref);
        }

        public static ScreenWrapToRef(v: Vec2, ref: Vec2): Vec2 {
            const left = Game.LEFT_EDGE;
            const right = Game.RIGHT_EDGE;
            const top = Game.TOP_EDGE;
            const bottom = Game.BOTTOM_EDGE;
            ref.x = v.x;
            ref.y = v.y;
            if (ref.x < left) {
                ref.x = right;
            } else if (ref.x > right) {
                ref.x = left;
            }
            if (ref.y < top) {
                ref.y = bottom;
            } else if (ref.y > bottom) {
                ref.y = top;
            }
            return ref;
        }

        public static SetLengthToRef(v: Vec2, len: Fx8, ref: Vec2): Vec2 {
            Vec2.NormalizeToRef(v, ref);
            Vec2.ScaleToRef(ref, len, ref);
            return ref;
        }

        public static NormalizeToRef(v: Vec2, ref: Vec2): Vec2 {
            const lenSq = v.magSqF();
            if (lenSq !== 0) {
                const len = Fx8(Math.sqrt(lenSq));
                ref.x = Fx.div(v.x, len);
                ref.y = Fx.div(v.y, len);
            }
            return ref;
        }

        public static MaxToRef(a: Vec2, b: Vec2, ref: Vec2): Vec2 {
            ref.x = Fx.max(a.x, b.x);
            ref.y = Fx.max(a.y, b.y);
            return ref;
        }

        public static MinToRef(a: Vec2, b: Vec2, ref: Vec2): Vec2 {
            ref.x = Fx.min(a.x, b.x);
            ref.y = Fx.min(a.y, b.y);
            return ref;
        }

        public static SubToRef(a: Vec2, b: Vec2, ref: Vec2): Vec2 {
            ref.x = Fx.sub(a.x, b.x);
            ref.y = Fx.sub(a.y, b.y);
            return ref;
        }

        public static AddToRef(a: Vec2, b: Vec2, ref: Vec2): Vec2 {
            ref.x = Fx.add(a.x, b.x);
            ref.y = Fx.add(a.y, b.y);
            return ref;
        }

        public static MulToRef(a: Vec2, b: Vec2, ref: Vec2): Vec2 {
            ref.x = Fx.mul(a.x, b.x);
            ref.y = Fx.mul(a.y, b.y);
            return ref;
        }

        public static DivToRef(a: Vec2, b: Vec2, ref: Vec2): Vec2 {
            ref.x = Fx.div(a.x, b.x);
            ref.y = Fx.div(a.y, b.y);
            return ref;
        }

        public static RandomRangeToRef(xmin: Fx8, xmax: Fx8, ymin: Fx8, ymax: Fx8, ref: Vec2): Vec2 {
            ref.x = fx.randomRange(xmin, xmax);
            ref.y = fx.randomRange(ymin, ymax);
            return ref;
        }
    }

    export class Transform {
        private pos_: Vec2;
        private rot_: number;
        private scl_: Fx8;
        private dirty_: boolean;

        //% blockCombine block="dirty" callInDebugger
        public get dirty() { return this.dirty_ || this.pos_.dirty; }
        public set dirty(v: boolean) {
            this.dirty_ = v;
            this.pos_.dirty = v;
        }

        //% blockCombine block="pos" callInDebugger
        public get pos(): Vec2 { return this.pos_; }
        public set pos(v: Vec2) {
            this.pos_.copyFrom(v);
            this.dirty = true;
        }

        //% blockCombine block="rot" callInDebugger
        public get rot() { return this.rot_; }
        public set rot(v: number) {
            this.rot_ = v;
            this.dirty = true;
        }

        //% blockCombine block="scl" callInDebugger
        public get scl() { return this.scl_; }
        public set scl(v: Fx8) {
            this.scl_ = v;
            this.dirty = true;
        }

        constructor() {
            this.pos_ = new Vec2();
            this.rot_ = 0;
            this.scl_ = Fx.oneFx8;
        }

        public copyFrom(src: Transform): this {
            this.pos.copyFrom(src.pos);
            this.rot = src.rot;
            this.scl = src.scl;
            this.dirty = true;
            return this;
        }

        public clone(): Transform {
            const xfrm = new Transform();
            xfrm.pos.copyFrom(this.pos);
            xfrm.rot = this.rot;
            xfrm.scl = this.scl;
            return xfrm;
        }

        public recalc(force = false) {
            if (this.dirty_ || force) {
                this.dirty = false;
                // TODO: calculate transform matrix

            }
        }
    }
}