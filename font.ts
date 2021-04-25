namespace asteroids {
    export class font {
        public static get width() { return 5; }
        public static get height() { return 7; }
        public static get glyphs() { return font.glyphs_; }

        private static glyphs_: { [id: string]: Polygon } = {
            A: new Polygon([
                new Polyline([Vec2.N(0, 6), Vec2.N(0, 2), Vec2.N(2, 0), Vec2.N(4, 2), Vec2.N(4, 6)]),
                new Polyline([Vec2.N(0, 4), Vec2.N(4, 4)])
            ]),
            B: new Polygon([
                new Polyline([Vec2.N(0, 6), Vec2.N(0, 0), Vec2.N(3, 0), Vec2.N(4, 1), Vec2.N(4, 2), Vec2.N(3, 3), Vec2.N(4, 4), Vec2.N(4, 5), Vec2.N(3, 6), Vec2.N(0, 6)]),
                new Polyline([Vec2.N(0, 3), Vec2.N(3, 3)]),
            ]),
            C: new Polygon([
                new Polyline([Vec2.N(4, 6), Vec2.N(0, 6), Vec2.N(0, 0), Vec2.N(4, 0)]),
            ]),
            D: new Polygon([
                new Polyline([Vec2.N(0, 0), Vec2.N(2, 0), Vec2.N(4, 2), Vec2.N(4, 4), Vec2.N(2, 6), Vec2.N(0, 6), Vec2.N(0, 0)]),
            ]),
            E: new Polygon([
                new Polyline([Vec2.N(4, 6), Vec2.N(0, 6), Vec2.N(0, 0), Vec2.N(4, 0)]),
                new Polyline([Vec2.N(0, 3), Vec2.N(3, 3)]),
            ]),
            F: new Polygon([
                new Polyline([Vec2.N(0, 6), Vec2.N(0, 0), Vec2.N(4, 0)]),
                new Polyline([Vec2.N(0, 3), Vec2.N(3, 3)]),
            ]),
            G: new Polygon([
                new Polyline([Vec2.N(2, 4), Vec2.N(4, 4), Vec2.N(4, 6), Vec2.N(0, 6), Vec2.N(0, 0), Vec2.N(4, 0)]),
            ]),
            H: new Polygon([
                new Polyline([Vec2.N(0, 0), Vec2.N(0, 6)]),
                new Polyline([Vec2.N(4, 0), Vec2.N(4, 6)]),
                new Polyline([Vec2.N(0, 3), Vec2.N(4, 3)]),
            ]),
            I: new Polygon([
                new Polyline([Vec2.N(0, 6), Vec2.N(4, 6)]),
                new Polyline([Vec2.N(0, 0), Vec2.N(4, 0)]),
                new Polyline([Vec2.N(2, 0), Vec2.N(2, 6)]),
            ]),
            J: new Polygon([
                new Polyline([Vec2.N(4, 0), Vec2.N(4, 6), Vec2.N(2, 6), Vec2.N(0, 4)]),
            ]),
            K: new Polygon([
                new Polyline([Vec2.N(0, 0), Vec2.N(0, 6)]),
                new Polyline([Vec2.N(0, 4), Vec2.N(4, 0)]),
                new Polyline([Vec2.N(0, 2), Vec2.N(4, 6)]),
            ]),
            L: new Polygon([
                new Polyline([Vec2.N(0, 0), Vec2.N(0, 6), Vec2.N(4, 6)]),
            ]),
            M: new Polygon([
                new Polyline([Vec2.N(0, 6), Vec2.N(0, 0), Vec2.N(2, 2), Vec2.N(4, 0), Vec2.N(4, 6)]),
            ]),
            N: new Polygon([
                new Polyline([Vec2.N(0, 6), Vec2.N(0, 0), Vec2.N(4, 6), Vec2.N(4, 0)]),
            ]),
            O: new Polygon([
                new Polyline([Vec2.N(0, 0), Vec2.N(4, 0), Vec2.N(4, 6), Vec2.N(0, 6), Vec2.N(0, 0)]),
            ]),
            P: new Polygon([
                new Polyline([Vec2.N(0, 6), Vec2.N(0, 0), Vec2.N(4, 0), Vec2.N(4, 3), Vec2.N(0, 3)]),
            ]),
            Q: new Polygon([
                new Polyline([Vec2.N(0, 6), Vec2.N(0, 0), Vec2.N(4, 0), Vec2.N(4, 4), Vec2.N(2, 6), Vec2.N(0, 6)]),
                new Polyline([Vec2.N(2, 4), Vec2.N(4, 6)]),
            ]),
            R: new Polygon([
                new Polyline([Vec2.N(0, 6), Vec2.N(0, 0), Vec2.N(4, 0), Vec2.N(4, 3), Vec2.N(0, 3)]),
                new Polyline([Vec2.N(0, 2), Vec2.N(4, 6)]),
            ]),
            S: new Polygon([
                new Polyline([Vec2.N(4, 0), Vec2.N(0, 0), Vec2.N(0, 3), Vec2.N(4, 3), Vec2.N(4, 6), Vec2.N(0, 6)]),
            ]),
            T: new Polygon([
                new Polyline([Vec2.N(0, 0), Vec2.N(4, 0)]),
                new Polyline([Vec2.N(2, 0), Vec2.N(2, 6)]),
            ]),
            U: new Polygon([
                new Polyline([Vec2.N(4, 0), Vec2.N(4, 6), Vec2.N(0, 6), Vec2.N(0, 0)]),
            ]),
            V: new Polygon([
                new Polyline([Vec2.N(0, 0), Vec2.N(2, 6), Vec2.N(4, 0)]),
            ]),
            W: new Polygon([
                new Polyline([Vec2.N(0, 0), Vec2.N(0, 6), Vec2.N(2, 4), Vec2.N(4, 6), Vec2.N(4, 0)]),
            ]),
            X: new Polygon([
                new Polyline([Vec2.N(0, 0), Vec2.N(4, 6)]),
                new Polyline([Vec2.N(0, 6), Vec2.N(4, 0)]),
            ]),
            Y: new Polygon([
                new Polyline([Vec2.N(0, 0), Vec2.N(2, 2), Vec2.N(4, 0)]),
                new Polyline([Vec2.N(2, 2), Vec2.N(2, 6)]),
            ]),
            Z: new Polygon([
                new Polyline([Vec2.N(0, 0), Vec2.N(4, 0), Vec2.N(0, 6), Vec2.N(4, 6)]),
            ]),
            0: new Polygon([
                new Polyline([Vec2.N(0, 0), Vec2.N(4, 0), Vec2.N(4, 6), Vec2.N(0, 6), Vec2.N(0, 0)]),
            ]),
            1: new Polygon([
                new Polyline([Vec2.N(2, 0), Vec2.N(2, 6)]),
            ]),
            2: new Polygon([
                new Polyline([Vec2.N(0, 0), Vec2.N(4, 0), Vec2.N(4, 3), Vec2.N(0, 3), Vec2.N(0, 6), Vec2.N(4, 6)]),
            ]),
            3: new Polygon([
                new Polyline([Vec2.N(0, 0), Vec2.N(4, 0), Vec2.N(4, 6), Vec2.N(0, 6)]),
                new Polyline([Vec2.N(4, 3), Vec2.N(0, 3)]),
            ]),
            4: new Polygon([
                new Polyline([Vec2.N(4, 0), Vec2.N(4, 6)]),
                new Polyline([Vec2.N(0, 0), Vec2.N(0, 3), Vec2.N(4, 3)]),
            ]),
            5: new Polygon([
                new Polyline([Vec2.N(4, 0), Vec2.N(0, 0), Vec2.N(0, 3), Vec2.N(4, 3), Vec2.N(4, 6), Vec2.N(0, 6)]),
            ]),
            6: new Polygon([
                new Polyline([Vec2.N(0, 0), Vec2.N(0, 6), Vec2.N(4, 6), Vec2.N(4, 3), Vec2.N(0, 3)]),
            ]),
            7: new Polygon([
                new Polyline([Vec2.N(0, 0), Vec2.N(4, 0), Vec2.N(4, 6)]),
            ]),
            8: new Polygon([
                new Polyline([Vec2.N(0, 0), Vec2.N(4, 0), Vec2.N(4, 6), Vec2.N(0, 6), Vec2.N(0, 0)]),
                new Polyline([Vec2.N(0, 3), Vec2.N(4, 3)]),
            ]),
            9: new Polygon([
                new Polyline([Vec2.N(4, 6), Vec2.N(4, 0), Vec2.N(0, 0), Vec2.N(0, 3), Vec2.N(4, 3)]),
            ]),
            '©': new Polygon([
                // TODO update this glyph. Currently just copied from 'O'.
                new Polyline([Vec2.N(0, 0), Vec2.N(4, 0), Vec2.N(4, 6), Vec2.N(0, 6), Vec2.N(0, 0)]),
            ])
        }

    }
}
