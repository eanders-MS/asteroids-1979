namespace asteroids {
    export class Blip extends PolygonSprite {
        public body: Body;
        public startTime: number;
        public onBlipCollision: (blip: Blip, other: Sprite) => void;

        constructor() {
            super(shapes.Blip, {
                kind: ObjKind.Blip
            });
            this.body = new Body(this, (other) => this.onCollision(other));
            this.imprecise = true; // imprecise blip shape looks better at more angles.
        }

        onCollision(other: Sprite) {
            this.onBlipCollision && this.onBlipCollision(this, other);
            if (other.kind === ObjKind.Rock || other.kind === ObjKind.Saucer) {
                this.body.enabled = false;
                this.visible = false;
            }
        }
    }
}