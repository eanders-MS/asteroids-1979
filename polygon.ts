namespace asteroids {
    export class Polyline {
        private points_: Vec2[];
        public get points() { return this.points_; }
        constructor(points: Vec2[] = null) {
            this.points_ = points || [];
        }
        public clone(): Polyline {
            return new Polyline(this.points_.map(pt => pt.clone()));
        }
        public static MaxToRef(pl: Polyline, ref: Vec2): Vec2 {
            pl.points.forEach(pt => {
                ref.x = Fx.max(ref.x, pt.x);
                ref.y = Fx.max(ref.y, pt.y);
            });
            return ref;
        }
        public static MinToRef(pl: Polyline, ref: Vec2): Vec2 {
            pl.points.forEach(pt => {
                ref.x = Fx.min(ref.x, pt.x);
                ref.y = Fx.min(ref.y, pt.y);
            });
            return ref;
        }
    }

    export class Polygon {
        private polylines_: Polyline[];
        public get polylines() { return this.polylines_; }
        constructor(polylines: Polyline[] = null) {
            this.polylines_ = polylines || [];
        }
        public clone(): Polygon {
            return new Polygon(this.polylines_.map(line => line.clone()));
        }
        public static MaxToRef(pg: Polygon, ref: Vec2): Vec2 {
            pg.polylines_.forEach(pl => Polyline.MaxToRef(pl, ref));
            return ref;
        }
        public static MinToRef(pg: Polygon, ref: Vec2): Vec2 {
            pg.polylines_.forEach(pl => Polyline.MinToRef(pl, ref));
            return ref;
        }
    }
}