'use strict';

var MYAPP = window.MYAPP || {};

MYAPP.abstract = {
    EntityStack: function EntityStack(sizeOfStack, Entity, entityConstructorArgs) {
        var poolSize = sizeOfStack,
            entityPool = [],
            poolCounter = 0,
            entity = {};

        this.init = function (entityInitArgs) {
            for (poolCounter = 0; poolCounter < poolSize; poolCounter++) {
                entity = new Entity(entityConstructorArgs);
                entity.init(entityInitArgs);
                entityPool[poolCounter] = entity;
            }
        };

        this.spawn = function (entitySpawnArgs) {
            if (!entityPool[poolSize - 1].alive) {
                entityPool[poolSize - 1].spawn(entitySpawnArgs);
                entityPool.unshift(entityPool.pop());
            }
        };

        this.draw = function () {
            for (poolCounter = 0; poolCounter < poolSize; poolCounter++) {
                if (entityPool[poolCounter].alive) {
                    entityPool[poolCounter].draw();
                }
            }
        };

        this.getStack = function () {
            return entityPool;
        };
    },

    Sprite: function Sprite(spriteConstructorOptions) {
        var sprite = spriteConstructorOptions.sprite,
            spriteColumnWidth = spriteConstructorOptions.width || 0,
            spriteColumnHeight = spriteConstructorOptions.height || 0,
            collumnCurrentPos = spriteConstructorOptions.startColumn || 0,
            columns = spriteConstructorOptions.columns || 0,
            startColumn = spriteConstructorOptions.startColumn || 0,
            lastDrawDate = Date.now();

        this.drop = function () {
            collumnCurrentPos = 0;
        };

        this.draw = function (spriteDrawOptions) {
            var columnUpperPos = columns - 1,
                columnLowerPos = 0,
                x = spriteDrawOptions.x || 0,
                y = spriteDrawOptions.y || 0,
                context = spriteDrawOptions.context,
                timeQ = spriteDrawOptions.timeQ,
                increase = spriteDrawOptions.increase,
                decrease = spriteDrawOptions.decrease,
                spriteChange = function () {
                    var dt;

                    dt = (Date.now() - lastDrawDate) / 1000 * 60;

                    if (dt > timeQ) {
                        if (increase && collumnCurrentPos < columnUpperPos) {
                            collumnCurrentPos += 1;
                        }

                        if (decrease && collumnCurrentPos > columnLowerPos) {
                            collumnCurrentPos -= 1;
                        }

                        if (!(decrease || increase) && collumnCurrentPos > startColumn) {
                            collumnCurrentPos -= 1;
                        }

                        if (!(decrease || increase) && collumnCurrentPos < startColumn) {
                            collumnCurrentPos += 1;
                        }

                        lastDrawDate = Date.now();
                    }
                };

            spriteChange();
            context.drawImage(sprite, collumnCurrentPos * spriteColumnWidth, 0, spriteColumnWidth - 1, spriteColumnHeight, x, y, spriteColumnWidth, spriteColumnHeight);
            return collumnCurrentPos === columnUpperPos || collumnCurrentPos === columnLowerPos;
        };
    },

    Drawable: function Drawable(canvasOptions) {
        this.init = function (drawableInitOptions) {
            this.x = drawableInitOptions.x;
            this.y = drawableInitOptions.y;
        };
        this.context = canvasOptions.context;
        this.canvasWidth = canvasOptions.canvasWidth || 0;
        this.canvasHeight = canvasOptions.canvasHeight || 0;
        this.speed = 0;
        this.draw = function () {
        };
    },

    Interactable: function Interactable() {
        this.move = function () {
        };
        this.collide = function (objectStack, offsetOptions) {
            var length = objectStack.length,
                counter = 0,
                xToCheck = this.x + offsetOptions.x1 || 0,
                yToCheck = this.y + offsetOptions.y1 || 0,
                widthToCheck = this.getWidth() - 2 * offsetOptions.x1 || 0,
                heightToCheck = this.getHeight() - 2 * offsetOptions.y1 || 0,
                collidableX = 0,
                collidableY = 0,
                collidableWidth = 0,
                collidableHeight = 0;

            for (counter = 0; counter < length; counter++) {
                if (objectStack[counter].alive) {
                    collidableX = objectStack[counter].x;
                    collidableY = objectStack[counter].y;
                    collidableWidth = objectStack[counter].getWidth();
                    collidableHeight = objectStack[counter].getHeight();

                    if (xToCheck < collidableX + collidableWidth &&
                        xToCheck + widthToCheck > collidableX &&
                        yToCheck < collidableY + collidableHeight &&
                        heightToCheck + yToCheck > collidableY) {
                        this.lifeCheck(objectStack[counter].getCollisionDamage());
                    }
                }

                if (objectStack[counter].projectiles) {
                    this.collide(objectStack[counter].projectiles.getStack(), offsetOptions);
                }

                if (objectStack[counter].items) {
                    this.collide(objectStack[counter].items.getStack(), offsetOptions);
                }
            }
        };

        this.fire = function () {
        };

        this.lifeCheck = function (damage) {
        };
    },
};