'use strict';

var MYAPP = window.MYAPP || {};

MYAPP.game = function () {
    var game = new MYAPP.controllers.Game(),
        message = document.getElementById('modalId'),
        messageContent = document.getElementById('modalContentId'),
        requestId;

    MYAPP.handlers.keyUpListener();
    MYAPP.handlers.keyDownListener();
    MYAPP.handlers.onRetry(stop);
    MYAPP.handlers.retryButtonListener();

    function init() {
        if (game.gameOver) {
            message.classList.toggle('toggle-modal');
        }

        game.init();
        game.start(animate);
    };

    function gamePlay(scorePoints) {
        var isInBounds = function () { },
            movementEvaluation = function () { },
            scoreEvaluation = function () { },
            collisionEvaluation = function () { };

        isInBounds = function (x, y, height, width) {
            var inBounds = {},
                upperBound = MYAPP.common.boundaries.upperBound,
                lowerBound = MYAPP.common.boundaries.lowerBound,
                leftBound = MYAPP.common.boundaries.leftBound,
                rightBound = MYAPP.common.boundaries.rightBound;

            inBounds = {
                leftEdge: x > leftBound,
                topEdge: y > upperBound,
                rightEdge: x + width < rightBound,
                bottomEdge: y + height < lowerBound
            };

            return inBounds;
        };

        movementEvaluation = function () {
            if (game.player.alive) {
                game.player.move(MYAPP.common.action, isInBounds, 0.05);
                game.enemies.spawn();
            }
            else if (game.play) {
                game.playerExplosion.spawn(game.player.drop());
                game.play = false;
            }
        };

        scoreEvaluation = function (killed) {
            game.score += killed;

            if (game.score % 40 === 0 && game.score !== 0) {
                game.foreground.speed = game.foreground.speed < 20 ? game.foreground.speed + 0.5 : game.foreground.speed;
                game.background.speed = game.background.speed < 10 ? game.background.speed + 0.25 : game.background.speed;
                game.enemies.setDifficulty(1);
                game.score += 1;
            }
        };

        collisionEvaluation = function () {
            var collidable = [],
                pickable = [],
                players = [],
                counter = 0,
                enemyCounter = 0,
                length = 0,
                enemyLength = 0;

            players[0] = game.player;
            length = game.enemies.getPoolSize();

            for (counter = 0; counter < length; counter++) {
                collidable = game.enemies.getFactoriesPool()[counter].enemies.getStack();
                pickable = game.enemies.getFactoriesPool()[counter].items.getStack();
                game.player.collide(collidable, { x1: 5, y1: 25, x2: 0, y2: 0 });
                game.player.collide(pickable, { x1: 5, y1: 25, x2: 0, y2: 0 });

                enemyLength = collidable.length;

                for (enemyCounter = 0; enemyCounter < enemyLength; enemyCounter++) {
                    collidable[enemyCounter].collide(players, { x1: 0, y1: 0, x2: 0, y2: 0 });
                }
            }
        };

        movementEvaluation();
        scoreEvaluation(game.enemies.move(), 1);
        collisionEvaluation();
    }

    function animate() {
        game.gamefieldContext.clearRect(0, 0, game.gamefieldCanvas.width, game.gamefieldCanvas.height);

        requestId = requestAnimationFrame(animate);

        game.background.draw();
        game.foreground.draw();

        if (game.player.alive) {
            game.player.draw(MYAPP.common.action);
        }

        if (game.playerExplosion.alive) {
            game.playerExplosion.draw();
        }

        game.player.projectiles.draw();
        game.enemies.draw();

        game.interface.draw({ life: game.player.getLife(), score: game.score });

        gamePlay();

        if (!game.play && !game.gameOver) {
            message.classList.toggle('toggle-modal');
            messageContent.innerText = 'Your score: ' + game.score;
            game.gameOver = true;
        }
    }

    function stop(e) {
        cancelAnimationFrame(requestId);
        init();
    }

    init();
};