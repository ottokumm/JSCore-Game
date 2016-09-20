'use strict';

var MYAPP = window.MYAPP || {};

MYAPP.imageRepository = new function () {
    var imageCount = 6,
        imageLoaded = 0;

    this.background = new Image();
    this.player = new Image();
    this.projectile = new Image();
    this.explosion = new Image();
    this.enemy = new Image();
    this.item = new Image();

    function resourceInitCheck() {
        imageLoaded++;
        if (imageLoaded === imageCount) {
            MYAPP.game();
        }
    }

    this.background.onload = function () {
        resourceInitCheck();
    };

    this.player.onload = function () {
        resourceInitCheck();
    };

    this.projectile.onload = function () {
        resourceInitCheck();
    };

    this.explosion.onload = function () {
        resourceInitCheck();
    };

    this.enemy.onload = function () {
        resourceInitCheck();
    };

    this.item.onload = function () {
        resourceInitCheck();
    };

    this.background.src = 'content/images/Background-Sky.png';
    this.player.src = 'content/images/Player-Ship.png';
    this.projectile.src = 'content/images/Projectiles.png';
    this.explosion.src = 'content/images/Explosion-One.png';
    this.enemy.src = 'content/images/Enemy-Ship.png';
    this.item.src = 'content/images/Item.png';
};
