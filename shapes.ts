namespace asteroids {
    export class shapes {
        public static Ship = new Polygon([
            new Polyline([
                Vec2.N(-3, 3),
                Vec2.N(0, -6),
                Vec2.N(3, 3),
            ]),
            new Polyline([
                Vec2.N(2.5, 2),
                Vec2.N(-2.5, 2)
            ])
        ]);
        public static Thruster = new Polygon([
            new Polyline([
                Vec2.N(-1.2, 3.5),
                Vec2.N(1.2, 3.5),
                Vec2.N(0, 5),
                Vec2.N(-1.2, 3.5)
            ])
        ]);
        public static Blip = new Polygon([
            new Polyline([
                Vec2.N(0, -0.1),
                Vec2.N(0, 0.1)
            ])
        ]);
        // NOTE: This isn't going to work. We don't want the lines themselves to scale.
        // TODO: Break lines into an array of polygons.
        // MAYBE: Make another type of transform that scales translation, allowing this to be a multi-polygon scale animation.
        public static ShipExplosion = new Polygon([
            new Polyline([Vec2.N(-4, -1), Vec2.N(-2.5, -3)]),
            new Polyline([Vec2.N(-1, -4.5), Vec2.N(1, -3.9)]),
            new Polyline([Vec2.N(2, -3), Vec2.N(4, -1)]),
            new Polyline([Vec2.N(3, 1), Vec2.N(4, 3)]),
            new Polyline([Vec2.N(-0.5, 4), Vec2.N(1, 3.5)]),
            new Polyline([Vec2.N(-3, 3.5), Vec2.N(-1.5, 3.75)]),
        ]);
        public static Rocks: Polygon[] = [
            new Polygon([
                new Polyline([
                    Vec2.N(-2.5, -1.25),
                    Vec2.N(-1.25, -2.5),
                    Vec2.N(0, -1.25),
                    Vec2.N(1.25, -2.5),
                    Vec2.N(2.5, -1.25),
                    Vec2.N(2, 0),
                    Vec2.N(2.5, 1.25),
                    Vec2.N(1, 2.5),
                    Vec2.N(-0.9, 2.5),
                    Vec2.N(-2.5, 1.25),
                    Vec2.N(-2.5, -1.25)
                ])
            ]),
            new Polygon([
                new Polyline([
                    Vec2.N(-2.5, -1.25),
                    Vec2.N(-1.25, -2.5),
                    Vec2.N(0, -2),
                    Vec2.N(1.25, -2.5),
                    Vec2.N(2.5, -1.25),
                    Vec2.N(1.3, -0.5),
                    Vec2.N(2.5, 1),
                    Vec2.N(1.75, 2.5),
                    Vec2.N(-0.3, 1.9),
                    Vec2.N(-2, 2.5),
                    Vec2.N(-2.5, 1),
                    Vec2.N(-2, 0),
                    Vec2.N(-2.5, -1.25)
                ])
            ]),
            new Polygon([
                new Polyline([
                    Vec2.N(-1, -2.5),
                    Vec2.N(1.25, -2.5),
                    Vec2.N(2.5, -0.625),
                    Vec2.N(2.5, 0.625),
                    Vec2.N(1.1, 2.5),
                    Vec2.N(0, 2.5),
                    Vec2.N(0, 0.625),
                    Vec2.N(-1.25, 2.5),
                    Vec2.N(-2.5, 0.625),
                    Vec2.N(-1.25, 0),
                    Vec2.N(-2.5, -0.625),
                    Vec2.N(-1, -2.5)
                ])
            ])
        ];
    }
}
