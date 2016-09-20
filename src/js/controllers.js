'use strict';

var MYAPP = window.MYAPP || {};

MYAPP.controllers = {
    Game: function Game() {
        var width = MYAPP.common.boundaries.rightBound - MYAPP.common.boundaries.leftBound,
            height = MYAPP.common.boundaries.lowerBound - MYAPP.common.boundaries.upperBound,
            options = {
                player: {
                    constructor: {
                        width: MYAPP.constants.player.width,
                        height: MYAPP.constants.player.height
                    },
                    image: {
                        sprite: MYAPP.constants.player.sprite,
                        width: MYAPP.constants.player.width,
                        height: MYAPP.constants.player.height,
                        startColumn: MYAPP.constants.player.startColumn,
                        columns: MYAPP.constants.player.columns
                    },
                    init: {
                        x: MYAPP.constants.player.startXPos,
                        y: MYAPP.constants.player.startYPos
                    }
                },

                background: {
                    constructor: {
                        x: MYAPP.constants.background.x,
                        y: MYAPP.constants.background.y,
                        height: MYAPP.constants.background.height,
                        offset: MYAPP.constants.background.offset,
                        scrollSpeed: MYAPP.constants.background.scrollSpeed,
                        image: MYAPP.constants.background.image
                    },
                    init: {
                        x: MYAPP.constants.background.x,
                        y: MYAPP.constants.background.y
                    }
                },

                foreground: {
                    constructor: {
                        x: MYAPP.constants.foreground.x,
                        y: MYAPP.constants.foreground.y,
                        height: MYAPP.constants.foreground.height,
                        offset: MYAPP.constants.foreground.offset,
                        scrollSpeed: MYAPP.constants.foreground.scrollSpeed,
                        image: MYAPP.constants.foreground.image
                    },
                    init: {
                        x: MYAPP.constants.foreground.x,
                        y: MYAPP.constants.foreground.y
                    }
                }
            };

        this.init = function () {
            var gamefieldCanvas = document.getElementById('gamefield'),
                canvasOptions = {
                    gamefield: {
                        canvas: gamefieldCanvas,
                        context: gamefieldCanvas.getContext('2d'),
                        canvasWidth: width,
                        canvasHeight: height
                    },
                },
                explosionConstructorOptions = {
                    sprite: MYAPP.constants.explosion.sprite,
                    width: MYAPP.constants.explosion.width,
                    height: MYAPP.constants.explosion.height,
                    startColumn: MYAPP.constants.explosion.startColumn,
                    columns: MYAPP.constants.explosion.columns
                };

            MYAPP.abstract.Interactable.prototype = new MYAPP.abstract.Drawable(canvasOptions.gamefield);
            MYAPP.entities.Projectile.prototype = new MYAPP.abstract.Drawable(canvasOptions.gamefield);
            MYAPP.entities.Background.prototype = new MYAPP.abstract.Drawable(canvasOptions.gamefield);
            MYAPP.entities.Interface.prototype = new MYAPP.abstract.Drawable(canvasOptions.gamefield);
            MYAPP.entities.Explosion.prototype = new MYAPP.abstract.Drawable(canvasOptions.gamefield);
            MYAPP.entities.Item.prototype = new MYAPP.abstract.Drawable(canvasOptions.gamefield);
            MYAPP.entities.Player.prototype = new MYAPP.abstract.Interactable();
            MYAPP.entities.Enemy.prototype = new MYAPP.abstract.Interactable();

            this.gamefieldCanvas = document.getElementById('gamefield');
            this.gamefieldContext = this.gamefieldCanvas.getContext('2d');
            this.gamefieldCanvas.width = width;
            this.gamefieldCanvas.height = height;

            this.score = 0;
            this.play = true;
            this.gameOver = false;
            this.difficulty = MYAPP.constants.game.difficulty;

            this.background = new MYAPP.entities.Background(options.background.constructor);
            this.foreground = new MYAPP.entities.Background(options.foreground.constructor);

            this.interface = new MYAPP.entities.Interface({ lifeX: 0, lifeY: 15, scoreX: 0, scoreY: 45 });

            this.player = new MYAPP.entities.Player(options.player.constructor, options.player.image);
            this.playerExplosion = new MYAPP.entities.Explosion(explosionConstructorOptions);
            this.enemies = new MYAPP.controllers.Enemies({ poolSize: this.difficulty });

            this.background.init(options.background.init);
            this.foreground.init(options.foreground.init);

            this.player.init(options.player.init);
            this.playerExplosion.init();
        };

        this.start = function (gameloop) {
            gameloop();
        };
    },

    Enemies: function Enemies(enemiesControllerOptions) {
        var poolSize = enemiesControllerOptions.poolSize,
            factoriesPool = [],
            factory = {},
            factoryConstructor = {},
            enemyConstructorOptions = {},
            enemyInitOptions = {},
            enemySpawnOptions = {},
            poolCounter = 0,
            killedCounter = 0;

        enemyConstructorOptions = {
            width: MYAPP.constants.enemy.width,
            height: MYAPP.constants.enemy.height,
        };

        this.getPoolSize = function () {
            return poolSize;
        };

        this.getFactoriesPool = function () {
            return factoriesPool;
        };

        function getRandom(min, max) {
            return Math.floor(Math.random() * (max - min) + min);
        }

        function populate(startCounter, depth) {
            var populateCounter = startCounter;

            for (populateCounter; populateCounter < depth; populateCounter++) {
                factoryConstructor = {
                    enemiesAppFrequency: getRandom(20, 100),
                    spawnRate: getRandom(15, 45),
                    startYPos: getRandom(100, 300),
                    yAxisSpeed: getRandom(10, 15),
                    enemiesNum: getRandom(3, 5),
                    movePatternAmplitude: getRandom(50, 70),
                    movePatternFrequency: getRandom(165, 185),
                    startXPos: getRandom(600, 1900)
                };

                enemyInitOptions = {
                    moveAmplitude: getRandom(50, 50),
                    moveFrequency: getRandom(185, 185),
                };

                enemySpawnOptions = { speed: getRandom(-1, -5) };

                factory = new MYAPP.entities.EnemyFactory(factoryConstructor, enemyConstructorOptions, enemyInitOptions, enemySpawnOptions);
                factoriesPool[populateCounter] = factory;
            }
        }

        populate(0, poolSize);

        this.setDifficulty = function (difficulty) {
            if (difficulty > 0) {
                populate(poolSize, poolSize + difficulty);
                poolSize += difficulty;
            }
        };

        this.spawn = function (level) {
            for (poolCounter = 0; poolCounter < poolSize; poolCounter++) {
                factoriesPool[poolCounter].spawn();
            }
        };

        this.move = function () {
            killedCounter = 0;
            for (poolCounter = 0; poolCounter < poolSize; poolCounter++) {
                killedCounter += factoriesPool[poolCounter].move();
            }
            return killedCounter;
        };

        this.draw = function () {
            for (poolCounter = 0; poolCounter < poolSize; poolCounter++) {
                factoriesPool[poolCounter].draw();
            }
        };
    }
};
