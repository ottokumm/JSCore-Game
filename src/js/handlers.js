'use strict';

var MYAPP = window.MYAPP || {};

MYAPP.handlers = {
    retryHandler: '',
    onRetry: function (callback) {
        this.retryHandler = callback;
    },
    keyHandler: function (event, state) {
        var key = event.keyCode || 0,
            action = MYAPP.common.action,
            keyBindings = MYAPP.common.keyBindings;

        switch (key) {
            case keyBindings.space: {
                if (!action.shoot && state) {
                    action.shoot = true;
                }

                if (action.shoot && !state) {
                    action.shoot = false;
                }
            } break;

            case keyBindings.left: {
                if (!action.moveLeft && state) {
                    action.moveLeft = true;
                }

                if (action.moveLeft && !state) {
                    action.moveLeft = false;
                }
            } break;

            case keyBindings.up: {
                if (!action.moveUp && state) {
                    action.moveUp = true;
                }

                if (action.moveUp && !state) {
                    action.moveUp = false;
                }
            } break;

            case keyBindings.right: {
                if (!action.moveRight && state) {
                    action.moveRight = true;
                }

                if (action.moveRight && !state) {
                    action.moveRight = false;
                }
            } break;

            case keyBindings.down: {
                if (!action.moveDown && state) {
                    action.moveDown = true;
                }

                if (action.moveDown && !state) {
                    action.moveDown = false;
                }
            } break;

            default: ;
        }

        return action;
    },

    keyUpListener: function () {
        document.addEventListener('keyup', function (e) {
            MYAPP.common.action = MYAPP.handlers.keyHandler(e, false);
        });
    },

    keyDownListener: function () {
        document.addEventListener('keydown', function (e) {
            MYAPP.common.action = MYAPP.handlers.keyHandler(e, true);
        });
    },

    retryButtonListener: function () {
        document.getElementById('retryBtnId').addEventListener('click', this.retryHandler, false);
    }
};