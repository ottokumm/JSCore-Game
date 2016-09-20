'use strict';

var MYAPP = window.MYAPP || {};

MYAPP.common = {
    action: {
        shoot: false,
        moveLeft: false,
        moveUp: false,
        moveRight: false,
        moveDown: false
    },

    keyBindings: {
        space: 32,
        left: 37,
        up: 38,
        right: 39,
        down: 40
    },

    boundaries: {
        upperBound: 0,
        lowerBound: 306,
        leftBound: 0,
        rightBound: 584
    }
};

MYAPP.constants = {
    projectile: {
        enemy: {
            width: 11,
            height: 8,
            type: 3,
            direction: true,
            sprite: MYAPP.imageRepository.projectile,
            collisionDamage: 40
        },

        player: {
            width: 11,
            height: 8,
            type: 0,
            direction: false,
            sprite: MYAPP.imageRepository.projectile,
            collisionDamage: 5
        }
    },

    player: {
        width: 64,
        height: 64,
        startXPos: 100,
        startYPos: 100,
        sprite: MYAPP.imageRepository.player,
        animationDelay: 5,
        shootYOffset: 27,
        fireRate: 4,
        startColumn: 5,
        columns: 9,
        speed: 5,
        collisionDamage: 0
    },

    enemy: {
        width: 48,
        height: 30,
        sprite: MYAPP.imageRepository.enemy,
        animationDelay: 5,
        shootYOffset: 10,
        fireRate: 65,
        startColumn: 3,
        columns: 5,
        speed: -5,
        collisionDamage: 5
    },

    background: {
        x: 0,
        y: 0,
        width: 584,
        height: 200,
        offset: 0,
        scrollSpeed: 1,
        image: MYAPP.imageRepository.background
    },

    foreground: {
        x: 0,
        y: 200,
        width: 584,
        height: 106,
        offset: 20,
        scrollSpeed: 5,
        image: MYAPP.imageRepository.background
    },

    explosion: {
        sprite: MYAPP.imageRepository.explosion,
        width: 36,
        height: 36,
        startColumn: 1,
        columns: 14,
        animationDelay: 5,
    },

    item: {
        sprite: MYAPP.imageRepository.item,
        width: 25,
        height: 25,
        startColumn: 0,
        columns: 1,
        animationDelay: 0,
        minSpawn: 0,
        maxSpawn: 100,
        spawnChance: 40,
        speed: -1,
        power: 25,
        amplitude: 20,
        frequency: 65,
    },

    game: {
        difficulty: 2
    },

    menu: {
        lifeColor: '#FF0000',
        scoreColor: '#FFF000',
        font: '16px ArcadeClassic'
    }
};