namespace asteroids {

    enum GameMode {
        NONE,
        SPLASH,
        START_PLAY,
        PLAYING,
        GAME_OVER
    }

    export enum ObjKind {
        None,
        Ship,
        Blip,
        Rock,
        Saucer
    }

    export class Game extends sprites.BaseSprite {
        public static Instance: Game;
        public static LEFT_EDGE = Fx8(-80);
        public static RIGHT_EDGE = Fx8(80);
        public static TOP_EDGE = Fx8(-60);
        public static BOTTOM_EDGE = Fx8(60);
    
        private notice: TextSprite;
        private scorelbl: TextSprite;
        private mode = GameMode.NONE;
        private input: Input;
        private offset: Vec2;
        private physics_: Physics;
        private ship_: Ship;
        private explodingShip: ExplodingShip;
        private life: Sprite;
        private rocks: Rock[];
        private score: number;
        private lives: number;
        private currWave: number;
        private handlers: GameModeHandler[];
        private rocksEnabled_ = false;
        private shipEnabled_ = false;

        public get physics() { return this.physics_; }
        public get ship() { return this.ship_; }
        public get rocksEnabled() { return this.rocksEnabled_; }
        public set rocksEnabled(b) {
            this.rocksEnabled_ = b;
            if (!b) this.clearRocks();
        }
        public get shipEnabled() { return this.shipEnabled_; }
        public set shipEnabled(b) {
            this.shipEnabled_ = b;
            this.ship.enabled = b;
        }

        constructor() {
            super(0);
            Game.Instance = this;
            image.setPalette(constants.palette);
            this.input = new Input();
            this.physics_ = new Physics();
            this.offset = new Vec2(Game.LEFT_EDGE, Game.TOP_EDGE);
            this.ship_ = new Ship();
            this.explodingShip = new ExplodingShip();
            this.life = new PolygonSprite(shapes.Ship, {
                color: constants.SHIP_HULL_COLOR
            });
            this.life.xfrm.scl = constants.SHIP_SCALE;
            this.rocks = [];
            this.scorelbl = new TextSprite("");
            this.scorelbl.horzJust = HorizontalJustification.Right;
            this.scorelbl.vertJust = VerticalJustification.Top;
            this.scorelbl.xfrm.pos.y = Fx.add(Game.TOP_EDGE, Fx8(6));
            this.scorelbl.xfrm.pos.x = Fx.add(Game.LEFT_EDGE, Fx8(40));
            this.notice = new TextSprite("1979 ARCADE INC");
            this.notice.color = constants.ROCK_COLOR_LARGE;
            this.notice.horzJust = HorizontalJustification.Center;
            this.notice.vertJust = VerticalJustification.Bottom;
            this.notice.xfrm.pos.y = Fx.sub(Game.BOTTOM_EDGE, Fx8(2));
            this.notice.xfrm.scl = Fx8(0.7);
            this.handlers = [];
            this.handlers[GameMode.SPLASH] = new SplashMode();
            this.handlers[GameMode.START_PLAY] = new StartPlayMode();
            this.handlers[GameMode.PLAYING] = new GameplayMode();
            this.handlers[GameMode.GAME_OVER] = new GameOverMode();
            this.setScore(0);
            this.currWave = 0;
            this.nextWave();
            this.setGameMode(GameMode.SPLASH);
        }

        public setInputHandler(handler: InputHandler) {
            this.input.setHandler(handler);
        }

        nextWave() {
            this.currWave += 1;
            this.spawnRocks(constants.GAME_INITIAL_ROCKS + this.currWave * constants.GAME_ROCK_INCREMENT);
        }

        spawnRocks(count: number) {
            for (let i = 0; i < count; ++i) {
                const rock = new Rock(RockSize.Large);
                this.rocks.push(rock);
                const d = Fx.toInt(rock.radius) + 2;
                let angle: number;
                // Spawn somewhere around the screen edges
                if (Math.random() > 0.5) {
                    // along x axis
                    rock.xfrm.pos.x = Fx8(randint(d, scene.screenWidth() - d));
                    rock.xfrm.pos.y = Fx.sub(Game.TOP_EDGE, rock.radius);
                    angle = -50;
                    if (Math.random() > 0.5) {
                        rock.xfrm.pos.y = Fx.sub(Game.BOTTOM_EDGE, rock.xfrm.pos.y);
                        angle = 0;
                    }
                } else {
                    // along y axis
                    rock.xfrm.pos.y = Fx8(randint(d, scene.screenHeight() - d));
                    rock.xfrm.pos.x = Fx.sub(Game.LEFT_EDGE, rock.radius);
                    angle = -25;
                    if (Math.random() > 0.5) {
                        rock.xfrm.pos.x = Fx.sub(Game.RIGHT_EDGE, rock.xfrm.pos.x);
                        angle = 25;
                    }
                }
                angle += randint(-10, 10);
                rock.go(angle);
            }
        }

        endWave() {
            setTimeout(() => {
                this.nextWave();
            }, 3 * 1000);
        }

        rockHit(rock: Rock, impactor: Sprite) {
            let split = false;
            let shipHit = false;
            if (impactor.kind === ObjKind.Blip) {
                split = true;
                switch (rock.size) {
                    case RockSize.Large: {
                        this.setScore(this.score + constants.GAME_LARGE_ROCK_SCORE);
                        break;
                    }
                    case RockSize.Medium: {
                        this.setScore(this.score + constants.GAME_MEDIUM_ROCK_SCORE);
                        break;
                    }
                    case RockSize.Small: {
                        this.setScore(this.score + constants.GAME_SMALL_ROCK_SCORE);
                        break;
                    }

                }
            }
            else if (impactor.kind === ObjKind.Ship) {
                split = true;
                shipHit = true;
            }
            else if (impactor.kind === ObjKind.Saucer) {
                split = true;
            }

            if (split) {
                this.rocks = this.rocks.filter(item => item.id !== rock.id);
                if (rock.size !== RockSize.Small) {
                    const rockA = new Rock(rock.size - 1, {
                        xfrm: rock.xfrm.clone()
                    });
                    const rockB = new Rock(rock.size - 1, {
                        xfrm: rock.xfrm.clone()
                    });
                    this.rocks.push(rockA);
                    this.rocks.push(rockB);
                    rockA.go(rock.angle + randint(-constants.ROCK_SPLIT_MAX_ANGLE, -constants.ROCK_SPLIT_MIN_ANGLE));
                    rockB.go(rock.angle + randint(constants.ROCK_SPLIT_MIN_ANGLE, constants.ROCK_SPLIT_MAX_ANGLE));
                }
                rock.deinit();
            }
            let endWave = !this.rocks.length;
            if (shipHit) {
                this.explodingShip.enableAt(this.ship.xfrm);
                this.shipEnabled = false;
                this.ship.reset();
                this.lives -= 1;
                if (this.lives === 0) {
                    this.setGameMode(GameMode.GAME_OVER);
                    setTimeout(() => {
                        this.explodingShip.disable();
                        this.clearRocks();
                        this.spawnRocks(constants.GAME_INITIAL_ROCKS);
                        this.setGameMode(GameMode.SPLASH);
                    }, 4000);
                } else {
                    const margin = Fx8(10);
                    setTimeout(() => {
                        this.explodingShip.disable();
                        this.shipEnabled = true;
                        if (endWave) {
                            this.nextWave();
                        }
                    }, 4000);
                }
            } else if (endWave) {
                this.endWave();
            }
        }

        clearRocks() {
            this.rocks.forEach(rock => rock.deinit());
            this.rocks = [];
        }

        clearSaucer() {
        }

        startGame() {
            this.currWave = 0;
            this.lives = constants.GAME_INITIAL_LIVES;
            this.setScore(0);
            this.clearRocks();
            this.clearSaucer();
            this.setGameMode(GameMode.START_PLAY);
            setTimeout(() => {
                this.setGameMode(GameMode.PLAYING);
                this.nextWave();
            }, 2 * 1000);
        }

        setGameMode(mode: GameMode) {
            if (mode !== this.mode) {
                this.handlers[this.mode] && this.handlers[this.mode].deactivated();
                this.mode = mode;
                this.handlers[this.mode] && this.handlers[this.mode].activated();
            }
        }

        setScore(v: number) {
            this.score = v;
            if (!this.score) {
                this.scorelbl.text = "00";
            } else {
                this.scorelbl.text = this.score.toString();
            }
        }

        drawLives(ofs: Vec2) {
            this.life.xfrm.pos.y = Fx.add(Game.TOP_EDGE, Fx8(20));
            this.life.xfrm.pos.x = Fx.add(Game.LEFT_EDGE, Fx8(33));
            for (let i = 0; i < this.lives; ++i) {
                this.life.update();
                this.life.draw(ofs);
                this.life.xfrm.pos.x = Fx.sub(this.life.xfrm.pos.x, Fx.add(this.life.radius, Fx8(1.5)));
            }
        }

        __update(camera: scene.Camera, dt: number) {
            this.physics_.simulate();
            this.notice.update();
            this.scorelbl.update();
            this.handlers[this.mode] && this.handlers[this.mode].update();
            this.shipEnabled && this.ship_.update();
            this.explodingShip.update();
            this.rocksEnabled && this.rocks.slice().forEach(rock => rock.update());
        }

        __drawCore(camera: scene.Camera) {
            scene.backgroundImage().fill(15);
            this.notice.draw(this.offset);
            this.scorelbl.draw(this.offset);
            this.handlers[this.mode] && this.handlers[this.mode].draw(this.offset);
            this.shipEnabled && this.ship_.draw(this.offset);
            this.explodingShip.draw(this.offset);
            this.mode === GameMode.PLAYING && this.drawLives(this.offset);
            this.rocksEnabled && this.rocks.slice().forEach(rock => rock.draw(this.offset));
            constants.DBG_DRAW_PHYSICS && this.physics.debugDraw(this.offset);
        }
    }
}