namespace asteroids {
    let seq = 0;

    export class Sprite {
        private id_: number;
        private xfrm_: Transform;
        protected radius_: Fx8;
        public visible = true;
        // gross workaround for objects rendering before 1st update.
        // better fix is for the game to have an object list.
        protected updateCount = 0;

        //% blockCombine block="id" callInDebugger
        public get id() { return this.id_; }

        //% blockCombine block="xfrm" callInDebugger
        public get xfrm() { return this.xfrm_; }

        //% blockCombine block="radius" callInDebugger
        public get radius() { return Fx.mul(this.radius_, this.xfrm.scl); }

        constructor(public kind = ObjKind.None, opts?: {
            xfrm?: Transform
        }) {
            this.id_ = ++seq;
            this.xfrm_ = (opts && opts.xfrm) || new Transform();
            this.radius_ = Fx.zeroFx8;
        }

        update(force = false) {
            this.xfrm_.recalc(force);
            this.xfrm_.dirty = false;
            this.updateCount += 1;
        }

        draw(offset: Vec2) {
        }
    }

    export class PolygonSprite extends Sprite {
        private polygon_: Polygon;
        private dirty: boolean;
        public color: number;
        public imprecise = false;  // If false: Math.floor translation before applying transform.
                                   // Otherwise the polygon vertex positions will have different
                                   // initial errors, and not all vertices will move to the next
                                   // pixel together (non-synced stepping). The resulting visual
                                   // looks "blobby".

        public get polygon() { return this.polygon_; }

        constructor(private src: Polygon, opts?: {
                color?: number,
                kind?: ObjKind,
                xfrm?: Transform
            }
        ) {
            super(opts && opts.kind, opts);
            this.color = (opts && opts.color !== undefined) ? opts.color : 1;
            this.src = this.src || new Polygon([]);
            this.buildPolygon();
        }

        private buildPolygon() {
            // Clone source polygon
            this.polygon_ = this.src.clone();
            const min = Polygon.MinToRef(this.polygon_, new Vec2());
            const max = Polygon.MaxToRef(this.polygon_, new Vec2());
            const dif = Vec2.SubToRef(max, min, new Vec2());
            this.radius_ = Fx.div(dif.mag(), Fx8(2));
            this.dirty = true;
        }

        update(force = false) {
            const dirty = this.dirty || this.xfrm.dirty;
            super.update(force);
            let xfrm = this.xfrm;
            if (!this.imprecise) {
                xfrm = xfrm.clone();
                Vec2.FloorToRef(xfrm.pos, xfrm.pos);
            }
            if (dirty || force) {
                this.dirty = false;
                for (let i = 0; i < this.src.polylines.length; ++i) {
                    const srcline = this.src.polylines[i];
                    const dstline = this.polygon_.polylines[i];
                    for (let j = 0; j < srcline.points.length; ++j) {
                        const srcpt = srcline.points[j];
                        const dstpt = dstline.points[j];
                        Vec2.TransformToRef(srcpt, xfrm, dstpt);
                    }
                }
            }
        }

        draw(offset: Vec2) {
            if (!this.visible) return;
            if (!this.updateCount) return; // not updated yet, don't draw.
            const img = scene.backgroundImage();
            const p0 = new Vec2();
            const p1 = new Vec2();
            for (let i = 0; i < this.polygon_.polylines.length; ++i) {
                const line = this.polygon_.polylines[i];
                for (let j = 1; j < line.points.length; ++j) {
                    const a = line.points[j - 1];
                    const b = line.points[j];
                    gfx.drawLine(
                        img,
                        Vec2.SubToRef(a, offset, p0),
                        Vec2.SubToRef(b, offset, p1),
                        this.color);
                }
            }
        }
    }

    export enum HorizontalJustification {
        Left,
        Center,
        Right
    }

    export enum VerticalJustification {
        Top,
        Center,
        Bottom
    }

    export class TextSprite extends Sprite {
        private horzJust_: HorizontalJustification;
        private vertJust_: VerticalJustification;
        private text_: string;
        private polygon_: Polygon;
        private dirty: boolean;

        public get horzJust() { return this.horzJust_; }
        public set horzJust(v) {
            this.horzJust_ = v;
            this.dirty = true;
        }
        public get vertJust() { return this.vertJust_; }
        public set vertJust(v) {
            this.vertJust_ = v;
            this.dirty = true;
        }
        public get text() { return this.text_; }
        public set text(s: string) {
            this.text_ = s;
            this.dirty = true;
        }

        constructor(text: string, public color = 1) {
            super();
            this.horzJust = HorizontalJustification.Left;
            this.vertJust = VerticalJustification.Bottom;    
            this.text = text || "";
        }

        private justificationOffset(): Vec2 {
            const ofs = new Vec2();
            switch (this.horzJust) {
                case HorizontalJustification.Left: {
                    break;
                }
                case HorizontalJustification.Center: {
                    ofs.x = Fx.sub(ofs.x, Fx8(this.text.length * ((font.width + 1) >> 1)));
                    break;
                }
                case HorizontalJustification.Right: {
                    ofs.x = Fx.sub(ofs.x, Fx8(this.text.length * (font.width + 1)));
                    break;
                }
            }
            switch (this.vertJust) {
                case VerticalJustification.Top: {
                    break;
                }
                case VerticalJustification.Center: {
                    ofs.y = Fx.sub(ofs.y, Fx8(font.height >> 1));
                    break;
                }
                case VerticalJustification.Bottom: {
                    ofs.y = Fx.sub(ofs.y, Fx8(font.height));
                    break;
                }
            }
            return ofs;
        }

        private buildPolygon() {
            const w0 = new Vec2();
            const w1 = new Vec2();
            const ofs = this.justificationOffset();
            this.polygon_ = new Polygon([]);
            for (let iCh = 0; iCh < this.text.length; ++iCh) {
                const ch = this.text.charAt(iCh);
                const glyph = font.glyphs[ch];
                if (glyph) {
                    for (let iSeg = 0; iSeg < glyph.polylines.length; ++iSeg) {
                        const polyline = new Polyline([]);
                        const seg = glyph.polylines[iSeg];
                        for (let iPt = 0; iPt < seg.points.length - 1; ++iPt) {
                            const pt0 = seg.points[iPt];
                            const pt1 = seg.points[iPt + 1];
                            w0.set(
                                Fx.add(ofs.x, pt0.x),
                                Fx.add(ofs.y, pt0.y));
                            w1.set(
                                Fx.add(ofs.x, pt1.x),
                                Fx.add(ofs.y, pt1.y));
                            const p0 = Vec2.TransformToRef(w0, this.xfrm, new Vec2());
                            const p1 = Vec2.TransformToRef(w1, this.xfrm, new Vec2());
                            polyline.points.push(p0);
                            polyline.points.push(p1);
                        }
                        this.polygon_.polylines.push(polyline);
                    }
                }
                ofs.x = Fx.add(ofs.x, Fx8(font.width + 1));
            }
        }

        update(force = false) {
            const dirty = this.dirty || this.xfrm.dirty;
            super.update(force);
            if (dirty) {
                this.dirty = false;
                this.buildPolygon();
            }
        }

        draw(offset: Vec2) {
            if (!this.visible) return;
            if (!this.updateCount) return; // not updated yet, don't draw.
           const img = scene.backgroundImage();
            for (let i = 0; i < this.polygon_.polylines.length; ++i) {
                const line = this.polygon_.polylines[i];
                for (let j = 1; j < line.points.length; ++j) {
                    const a = line.points[j - 1];
                    const b = line.points[j];
                    img.drawLine(
                        Fx.toFloat(Fx.sub(a.x, offset.x)),
                        Fx.toFloat(Fx.sub(a.y, offset.y)),
                        Fx.toFloat(Fx.sub(b.x, offset.x)),
                        Fx.toFloat(Fx.sub(b.y, offset.y)),
                        this.color);
                }
            }
        }
    }
}