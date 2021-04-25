namespace asteroids {

    export class GameModeHandler extends Sprite {
        protected input: InputHandler;

        constructor() {
            super();
        }
        
        activated() {
            Game.Instance.setInputHandler(this.input);
        }

        deactivated() {

        }
        
        update(force = false) {
            this.input && this.input.update();
        }
    }

    export class SplashMode extends GameModeHandler {
        private lblPressStart: TextSprite;
        private lblCoinPlay: TextSprite;

        constructor() {
            super();
            this.lblPressStart = new TextSprite("PUSH START");
            this.lblPressStart.xfrm.pos.y = Fx.add(Game.TOP_EDGE, Fx8(20));
            this.lblPressStart.horzJust = HorizontalJustification.Center;
            this.lblPressStart.vertJust = VerticalJustification.Top;
            this.lblCoinPlay = new TextSprite("1 COIN 1 PLAY");
            this.lblCoinPlay.xfrm.pos.y = Fx.sub(Game.BOTTOM_EDGE, Fx8(20));
            this.lblCoinPlay.horzJust = HorizontalJustification.Center;
            this.input = new InputHandler();
            this.input.onReleased(Button.A, () => Game.Instance.startGame());
        }

        activated() {
            super.activated();
            Game.Instance.shipEnabled = false;
            Game.Instance.rocksEnabled = true;
        }

        update(force = false) {
            super.update(force);
            this.lblPressStart.visible = (control.millis() % 900) > 450;
            this.lblPressStart.update();
            this.lblCoinPlay.update();
        }

        draw(offset: Vec2) {
            this.lblPressStart.draw(offset);
            this.lblCoinPlay.draw(offset);
        }
    }

    export class StartPlayMode extends GameModeHandler {
        private lblPlayer1: TextSprite;

        constructor() {
            super();
            this.lblPlayer1 = new TextSprite("PLAYER 1");
            this.lblPlayer1.xfrm.pos.y = Fx.add(Game.TOP_EDGE, Fx8(20));
            this.lblPlayer1.horzJust = HorizontalJustification.Center;
            this.lblPlayer1.vertJust = VerticalJustification.Top;
        }

        activated() {
            super.activated();
            Game.Instance.shipEnabled = false;
            Game.Instance.rocksEnabled = false;
        }

        update(force = false) {
            super.update(force);
            this.lblPlayer1.update();
        }

        draw(offset: Vec2) {
            this.lblPlayer1.draw(offset);
        }
    }

    export class GameplayMode extends GameModeHandler {

        constructor() {
            super();
            this.input = new InputHandler();
            this.input.onDown(Button.Left, () => this.rotateLeft());
            this.input.onDown(Button.Right, () => this.rotateRight());
            this.input.onDown(Button.Up, () => this.thrust());
            this.input.onPressed(Button.A, () => this.fire());
            this.input.onPressed(Button.B, () => this.hyperspace());
        }

        rotateLeft() {
            Game.Instance.ship.rotateLeft();
        }

        rotateRight() {
            Game.Instance.ship.rotateRight();
        }

        thrust() {
            Game.Instance.ship.thrust();
        }

        fire() {
            Game.Instance.ship.fire();
        }

        hyperspace() {
            Game.Instance.ship.hyperspace();
        }

        activated() {
            super.activated();
            Game.Instance.shipEnabled = true;
            Game.Instance.rocksEnabled = true;
        }

        update(force = false) {
            super.update(force);
        }

        draw(offset: Vec2) {
        }
    }

    export class GameOverMode extends GameModeHandler {
        private lblGameOver: TextSprite;

        constructor() {
            super();
            this.lblGameOver = new TextSprite("GAME OVER");
            this.lblGameOver.xfrm.pos.y = Fx.add(Game.TOP_EDGE, Fx8(20));
            this.lblGameOver.horzJust = HorizontalJustification.Center;
            this.lblGameOver.vertJust = VerticalJustification.Top;
        }

        activated() {
            super.activated();
            Game.Instance.shipEnabled = false;
            Game.Instance.rocksEnabled = true;
        }

        update(force = false) {
            super.update(force);
            this.lblGameOver.update();
        }

        draw(offset: Vec2) {
            this.lblGameOver.draw(offset);
        }
    }

}