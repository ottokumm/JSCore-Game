'use strict';

var MYAPP = window.MYAPP || {};

MYAPP.entities = {
    Player: function Player(playerConstructorOptions, spriteConstructorOptions) {
        var sprite = new MYAPP.abstract.Sprite(spriteConstructorOptions),
            projectileConstructorOptions = {},
            projectileInitOptions = {},
            width = playerConstructorOptions.width || 0,
            height = playerConstructorOptions.height || 0,
            fireRate = MYAPP.constants.player.fireRate,
            fireCounter = fireRate,
            collisionDamage = MYAPP.constants.player.collisionDamage,
            lifebar = 300,
            moment = { up: 1, down: 1, left: 1, right: 1 },
            momentCalc = function () { };

        projectileConstructorOptions = {
            sprite: MYAPP.constants.projectile.player.sprite,
            type: MYAPP.constants.projectile.player.type,
            direction: MYAPP.constants.projectile.player.direction,
            damage: MYAPP.constants.projectile.player.collisionDamage
        };

        projectileInitOptions = {
            x: 0,
            y: 0,
            height: MYAPP.constants.projectile.player.height,
            width: MYAPP.constants.projectile.player.width
        };

        momentCalc = function (increase, capacity, value) {
            var inc = increase || false,
                cap = capacity || 30;

            if (inc) {
                value = value < cap ? value + 1 : value;
            }
            else {
                value = value > 0 ? value - 1 : 0;
            }
            return value;
        };

        this.getCollisionDamage = function () {
            return collisionDamage;
        };

        this.getLife = function () {
            return lifebar;
        };

        this.lifeCheck = function (damage) {
            if (!(lifebar > 300 && damage < 0)) {
                lifebar -= damage;
            }

            this.alive = lifebar < 0 ? false : this.alive;
        };

        this.alive = true;

        this.getHeight = function () {
            return height;
        };

        this.getWidth = function () {
            return width;
        };

        this.projectiles = new MYAPP.abstract.EntityStack(15, MYAPP.entities.Projectile, projectileConstructorOptions);

        this.projectiles.init(projectileInitOptions);

        this.move = function (action, isInBounds, modifier) {
            var inBounds = isInBounds(this.x, this.y, height, width);

            moment.up = inBounds.topEdge ? momentCalc(action.moveUp, 50, moment.up) : 0;
            moment.down = inBounds.bottomEdge ? momentCalc(action.moveDown, 50, moment.down) : 0;
            moment.left = inBounds.leftEdge ? momentCalc(action.moveLeft, 50, moment.left) : 0;
            moment.right = inBounds.rightEdge ? momentCalc(action.moveRight, 50, moment.right) : 0;

            if (action.moveLeft) {
                this.x = inBounds.leftEdge ? this.x - 1 : MYAPP.common.boundaries.leftBound;
            }

            if (action.moveRight) {
                this.x = inBounds.rightEdge ? this.x + 1 : MYAPP.common.boundaries.rightBound - width;
            }

            if (action.moveDown) {
                this.y = inBounds.bottomEdge ? this.y + 1 : MYAPP.common.boundaries.lowerBound - height;
            }

            if (action.moveUp) {
                this.y = inBounds.topEdge ? this.y - 1 : MYAPP.common.boundaries.upperBound;
            }

            if (action.shoot) {
                this.fire(MYAPP.constants.player.shootYOffset);
            }

            this.x += (-moment.left + moment.right) * modifier;
            this.y += (-moment.up + moment.down) * modifier;
        };

        this.fire = function (yOffset) {
            var projectileSpawnOptions = {};

            if (fireCounter === fireRate) {
                projectileSpawnOptions = {
                    x: this.x + width,
                    y: this.y + yOffset,
                    speed: 5,
                    duration: 300
                };

                this.projectiles.spawn(projectileSpawnOptions);
            }

            fireCounter = fireCounter === 0 ? fireRate : fireCounter - 1;
        };

        this.draw = function (action) {
            var spriteDrawOptions = {
                x: this.x,
                y: this.y,
                context: this.context,
                increase: action.moveDown,
                decrease: action.moveUp,
                timeQ: MYAPP.constants.player.animationDelay
            };

            sprite.draw(spriteDrawOptions);
        };

        this.drop = function () {
            var dropXY = { x: this.x, y: this.y };

            this.x = 0;
            this.y = 0;
            this.alive = false;

            return dropXY;
        };
    },

    Enemy: function Enemy(enemyConstructorOptions) {
        var fireRate = MYAPP.constants.enemy.fireRate,
            fireCounter = fireRate,
            lifebar = 15,
            projectileConstructorOptions = {},
            projectileInitOptions = {},
            spriteConstructorOptions = {
                sprite: MYAPP.constants.enemy.sprite,
                width: MYAPP.constants.enemy.width,
                height: MYAPP.constants.enemy.height,
                startColumn: MYAPP.constants.enemy.startColumn,
                columns: MYAPP.constants.enemy.columns
            },
            sprite = new MYAPP.abstract.Sprite(spriteConstructorOptions),
            lastY = 0,
            startYPos = 0,
            amplitude = 0,
            frequency = 0,
            collisionDamage = MYAPP.constants.enemy.collisionDamage,
            width = enemyConstructorOptions.width,
            height = enemyConstructorOptions.height;

        projectileConstructorOptions = {
            sprite: MYAPP.constants.projectile.enemy.sprite,
            type: MYAPP.constants.projectile.enemy.type,
            direction: MYAPP.constants.projectile.enemy.direction,
            damage: MYAPP.constants.projectile.player.collisionDamage
        };

        projectileInitOptions = {
            x: 0,
            y: 0,
            height: MYAPP.constants.projectile.enemy.height,
            width: MYAPP.constants.projectile.enemy.width
        };

        this.lifeCheck = function (damage) {
            lifebar -= damage;
        };

        this.getLife = function () {
            return lifebar;
        };

        this.getCollisionDamage = function () {
            return collisionDamage;
        };

        this.getHeight = function () {
            return height;
        };

        this.getWidth = function () {
            return width;
        };

        this.projectiles = new MYAPP.abstract.EntityStack(15, MYAPP.entities.Projectile, projectileConstructorOptions);
        this.projectiles.init(projectileInitOptions);


        this.init = function (enemyInitOptions) {
            this.alive = false;
            amplitude = enemyInitOptions.moveAmplitude || 0;
            frequency = enemyInitOptions.moveFrequency || 0;
        };

        this.move = function () {
            this.x += this.speed;
            this.y = amplitude * Math.sin(this.x * 0.5 * Math.PI / frequency) + startYPos;
            if (this.x <= MYAPP.common.boundaries.leftBound - width) {
                this.drop();
            }

            if (this.x < 500 && this.y > 0) {
                this.fire(MYAPP.constants.enemy.shootYOffset);
            }
        };

        this.draw = function () {
            var spriteDrawOptions = {
                x: this.x,
                y: this.y,
                context: this.context,
                increase: this.y - lastY < 0,
                decrease: this.y - lastY > 0,
                timeQ: MYAPP.constants.enemy.animationDelay
            };

            sprite.draw(spriteDrawOptions);
        };

        this.spawn = function (enemySpawnOptions) {
            this.x = enemySpawnOptions.x || 0;
            this.y = enemySpawnOptions.y || 0;
            this.speed = enemySpawnOptions.speed || 0;
            startYPos = enemySpawnOptions.y || 0;
            this.alive = true;
            lifebar = 15;
            lastY = this.y;
        };

        this.fire = function (yOffset) {
            var projectileSpawnOptions = {};

            if (fireCounter === fireRate) {
                projectileSpawnOptions = {
                    x: this.x,
                    y: this.y + yOffset,
                    speed: 5,
                    duration: 600
                };

                this.projectiles.spawn(projectileSpawnOptions);
            }

            fireCounter = fireCounter === 0 ? fireRate : fireCounter - 1;
        };

        this.drop = function () {
            var dropXY = { x: this.x, y: this.y };

            this.speed = 0;
            this.x = 0;
            this.y = 0;
            this.alive = false;

            return dropXY;
        };
    },

    Projectile: function Projectile(projectileConstructorOptions) {
        var sprite = projectileConstructorOptions.sprite,
            bulletDirection = projectileConstructorOptions.direction || false,
            bulletType = projectileConstructorOptions.type || 0,
            lifetimeCur = 0,
            collisionDamage = projectileConstructorOptions.damage,
            lifetime,
            sourceX,
            sourceY,
            sourceHeight,
            sourceWidth;

        this.init = function (projectileInitOptions) {
            sourceX = projectileInitOptions.x || 0;
            sourceY = projectileInitOptions.y || 0;
            this.alive = false;
            sourceHeight = projectileInitOptions.height || 0;
            sourceWidth = projectileInitOptions.width || 0;
            lifetime = 0;
        };

        this.getHeight = function () {
            return sourceHeight;
        };

        this.getWidth = function () {
            return sourceWidth;
        };

        this.getCollisionDamage = function () {
            this.drop();
            return collisionDamage;
        };

        this.move = function (direction) {
            if (direction) {
                this.x -= this.speed;
            }
            else {
                this.x += this.speed;
            }

            lifetimeCur += this.speed;
            if (lifetimeCur > lifetime) {
                this.drop();
            }
        };

        this.draw = function () {
            this.context.drawImage(sprite, sourceX + sourceWidth * bulletDirection, sourceY + sourceHeight * bulletType, sourceWidth, sourceHeight, this.x, this.y, sourceWidth, sourceHeight);
            this.move(bulletDirection);
        };

        this.spawn = function (projectileSpawnOptions) {
            this.x = projectileSpawnOptions.x || 0;
            this.y = projectileSpawnOptions.y || 0;
            this.speed = projectileSpawnOptions.speed || 0;
            this.alive = true;
            lifetime = projectileSpawnOptions.duration || 0;
        };

        this.drop = function () {
            this.speed = 0;
            lifetimeCur = 0;
            this.x = 0;
            this.y = 0;
            this.alive = false;
        };
    },

    Background: function Background(backgroundConstructorOptions) {
        var width,
            offsetVal = backgroundConstructorOptions.offset || 0,
            image = MYAPP.imageRepository.background,
            sX = backgroundConstructorOptions.x || 0,
            sY = backgroundConstructorOptions.y || 0,
            sHeight = backgroundConstructorOptions.height || 0;


        width = this.canvasWidth + offsetVal;
        this.speed = backgroundConstructorOptions.scrollSpeed || 1;
        this.draw = function () {
            this.x -= this.speed;
            this.context.drawImage(image, sX, sY, width, sHeight, this.x, this.y, width, sHeight);
            this.context.drawImage(image, sX, sY, width, sHeight, this.x + width, this.y, width, sHeight);
            if (this.x <= -width) {
                this.x = 0;
            }
        };
    },

    Interface: function Interface(interfaceConstructorOptions) {
        var lifeBarPosX = interfaceConstructorOptions.lifeX || 0,
            lifeBarPosY = interfaceConstructorOptions.lifeY || 0,
            scorePosX = interfaceConstructorOptions.scoreX || 0,
            scorePosY = interfaceConstructorOptions.scoreY || 0;

        this.draw = function (drawOptions) {
            var lifeBar = drawOptions.life,
                score = drawOptions.score;

            this.context.fillStyle = MYAPP.constants.menu.lifeColor;
            this.context.fillRect(lifeBarPosX, lifeBarPosY, lifeBar, 5);
            this.context.font = MYAPP.constants.menu.font;
            this.context.fillText('Life:', 0, 15);
            this.context.fillStyle = MYAPP.constants.menu.scoreColor;
            this.context.fillText('Score:', 0, 35);
            this.context.fillText(score, scorePosX, scorePosY);
        };
    },

    Explosion: function Explosion(explosionConstructorOptions) {
        var explosion = new MYAPP.abstract.Sprite(explosionConstructorOptions);

        this.init = function () {
            this.alive = false;
        };

        this.spawn = function (explosionSpawnOptions) {
            this.alive = true;
            this.x = explosionSpawnOptions.x;
            this.y = explosionSpawnOptions.y;
        };

        this.draw = function () {
            var spriteDrawOptions = {
                x: this.x,
                y: this.y,
                increase: true,
                decrease: false,
                timeQ: MYAPP.constants.explosion.animationDelay,
                context: this.context
            };

            if (explosion.draw(spriteDrawOptions)) {
                explosion.drop();
                this.alive = false;
            };
        };
    },

    Item: function Item(spriteCnstructorOptions) {
        var item = new MYAPP.abstract.Sprite(spriteCnstructorOptions),
            collisionDamage = -MYAPP.constants.item.power,
            width = spriteCnstructorOptions.width,
            height = spriteCnstructorOptions.height,
            speed = MYAPP.constants.item.speed,
            startYPos = 0;

        this.getHeight = function () {
            return height;
        };

        this.getWidth = function () {
            return width;
        };

        this.getCollisionDamage = function () {
            this.drop();
            return collisionDamage;
        };

        this.init = function () {
            this.alive = false;
        };

        this.move = function () {
            this.x += speed;
            this.y = MYAPP.constants.item.amplitude * Math.sin(this.x * 0.5 * Math.PI / MYAPP.constants.item.frequency) + startYPos;
            if (this.x <= MYAPP.common.boundaries.leftBound - width) {
                this.drop();
            }
        };

        this.spawn = function (itemSpawnOptions) {
            this.alive = true;
            this.x = itemSpawnOptions.x;
            this.y = itemSpawnOptions.y;
            startYPos = itemSpawnOptions.y;
        };

        this.draw = function () {
            var spriteDrawOptions = {
                x: this.x,
                y: this.y,
                increase: false,
                decrease: false,
                timeQ: 0,
                context: this.context
            };

            item.draw(spriteDrawOptions);
        };

        this.drop = function () {
            this.alive = false;
        };
    },

    EnemyFactory: function EnemyFactory(factoryConstructorOptions, enemyConstructorOptions, enemyInitOptions, enemySpawnOptions) {
        var spawnRate = factoryConstructorOptions.enemiesAppFrequency || 0,
            spawnCounter = spawnRate || 0,
            yAxisPos = factoryConstructorOptions.startYPos || 0,
            yAxisSpeed = factoryConstructorOptions.yAxisSpeed || 0,
            enemiesNum = factoryConstructorOptions.enemiesNum || 0,
            startXPos = factoryConstructorOptions.startXPos || 0,
            startYPos = factoryConstructorOptions.startYPos || 0,
            explosionConstructorOptions = {
                sprite: MYAPP.constants.explosion.sprite,
                width: MYAPP.constants.explosion.width,
                height: MYAPP.constants.explosion.height,
                startColumn: MYAPP.constants.explosion.startColumn,
                columns: MYAPP.constants.explosion.columns
            },
            itemConstructorOptions = {
                sprite: MYAPP.constants.item.sprite,
                width: MYAPP.constants.item.width,
                height: MYAPP.constants.item.height,
                startColumn: MYAPP.constants.item.startColumn,
                columns: MYAPP.constants.item.columns
            };

        function getRandom(min, max) {
            return Math.floor(Math.random() * (max - min) + min);
        }

        this.x = startXPos;
        this.y = startYPos;

        this.enemies = new MYAPP.abstract.EntityStack(enemiesNum, MYAPP.entities.Enemy, enemyConstructorOptions);
        this.explosions = new MYAPP.abstract.EntityStack(enemiesNum, MYAPP.entities.Explosion, explosionConstructorOptions);
        this.items = new MYAPP.abstract.EntityStack(enemiesNum, MYAPP.entities.Item, itemConstructorOptions);
        this.enemies.init(enemyInitOptions);
        this.explosions.init();
        this.items.init();

        this.spawn = function () {
            enemySpawnOptions = { x: this.x, y: this.y, speed: enemySpawnOptions.speed };
            if (spawnCounter >= spawnRate) {
                this.enemies.spawn(enemySpawnOptions);
            }

            spawnCounter = spawnCounter <= 0 ? spawnRate : spawnCounter - 1;
        };


        this.move = function () {
            var enemiesCount = 0,
                itemCount = 0,
                enemies = this.enemies.getStack(),
                items = this.items.getStack(),
                coord,
                killedCount = 0;

            yAxisSpeed = yAxisPos < MYAPP.common.boundaries.upperBound || yAxisPos > MYAPP.common.boundaries.lowerBound ? yAxisSpeed * -1 : yAxisSpeed;
            yAxisPos += yAxisSpeed;
            this.y += yAxisSpeed;

            for (enemiesCount = 0; enemiesCount < enemiesNum; enemiesCount++) {
                if (enemies[enemiesCount].alive) {
                    enemies[enemiesCount].move();

                    for (itemCount = 0; itemCount < enemiesNum; itemCount++) {
                        if (items[enemiesCount].alive) {
                            items[enemiesCount].move();
                        }
                    }

                    if (enemies[enemiesCount].getLife() < 0) {
                        coord = enemies[enemiesCount].drop();
                        this.explosions.spawn(coord);

                        if (getRandom(MYAPP.constants.item.minSpawn, MYAPP.constants.item.maxSpawn) < MYAPP.constants.item.spawnChance) {
                            this.items.spawn(coord);
                        }

                        killedCount += 1;
                    }
                }
            }

            return killedCount || 0;
        };

        this.draw = function () {
            this.items.draw();
            this.enemies.draw();
            this.explosions.draw();

            var enemiesCount = 0,
                enemies = this.enemies.getStack();

            for (enemiesCount = 0; enemiesCount < enemiesNum; enemiesCount++) {
                enemies[enemiesCount].projectiles.draw();
            }
        };
    }
};
