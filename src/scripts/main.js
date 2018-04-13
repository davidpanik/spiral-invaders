/* This is the starting point of the code, everything gets kicked off here */

'use strict';

import Phaser from './vendor/phaser.min';

let cursors, ship, background, groupAliens, groupMissiles, groupWalls, wallLeft, wallRight, wallTop, wallBottom;

const cannon = {
	canFire: true,
	delay: 500,
	timer: null,
	fire: function(scope) {
		if (cannon.canFire) {
			let missile = scope.physics.add.sprite(ship.x, ship.y, 'missile');
			groupMissiles.add(missile);
			missile.anims.play('missile-default');
			missile.setVelocityY(-200);

			this.canFire = false;
			this.timer = setTimeout(() => {
				this.canFire = true;
			}, this.delay);
		}
	}
};

const controls = {
	cursors: null,
	create: function(scope) {
		this.cursors = scope.input.keyboard.createCursorKeys();
	},
	update: function (scope) {
		if (this.cursors.left.isDown) {
			ship.setVelocityX(-160);
			ship.anims.play('ship-left', true);
		} else if (this.cursors.right.isDown) {
			ship.setVelocityX(160);
			ship.anims.play('ship-right', true);
		} else {
			ship.setVelocityX(0);
			ship.anims.play('ship-default', true);
		}

		if (this.cursors.space.isDown) {
			cannon.fire(scope);
		}
	}
}

const WIDTH = 800;
const HEIGHT = 600;
const WALLSIZE = 100;

const config = {
	width: WIDTH,
	height: HEIGHT,
	physics: {
		default: 'arcade',
		arcade: {
			// gravity: { y: 100 }
		}
	},
	scene: {
		preload: function() {
			this.load.image('space', './images/space.png');
			this.load.image('transparent', './images/transparent.png');
			this.load.spritesheet('ship', './images/ship.png', { frameWidth: 32, frameHeight: 44 });
			this.load.spritesheet('alien', './images/alien.png', { frameWidth: 32, frameHeight: 32 });
			this.load.spritesheet('missile', './images/missile.png', { frameWidth: 8, frameHeight: 19 });
			this.load.spritesheet('explosion', './images/explosion.png', { frameWidth: 32, frameHeight: 32 });
		},
		create: function () {
			createAnimations(this);

			groupAliens = this.physics.add.group();
			groupMissiles = this.physics.add.group();
			groupWalls = this.physics.add.group();

			background = this.add.tileSprite(WIDTH / 2, HEIGHT / 2, WIDTH, HEIGHT, 'space');

			wallLeft = this.add.tileSprite(0 - (WALLSIZE / 2), HEIGHT / 2, WALLSIZE, HEIGHT + (WALLSIZE * 2), 'transparent');
			wallRight = this.add.tileSprite(WIDTH + (WALLSIZE / 2), HEIGHT / 2, WALLSIZE, HEIGHT + (WALLSIZE * 2), 'transparent');

			wallTop = this.add.tileSprite(WIDTH / 2, 0 - (WALLSIZE / 2), WIDTH + (WALLSIZE * 2), WALLSIZE, 'transparent');
			wallBottom = this.add.tileSprite(WIDTH / 2, HEIGHT + (WALLSIZE / 2), WIDTH + (WALLSIZE * 2), WALLSIZE, 'transparent');

			groupWalls.add(wallLeft);
			groupWalls.add(wallRight);
			groupWalls.add(wallTop);
			groupWalls.add(wallBottom);

			createShip(this);

			createAlien(this);

			createCollisions(this);

			controls.create(this);
		},
		update: function() {
			controls.update(this);

			background.tilePositionX -= 0.1;
			background.tilePositionY -= 0.2;
		}
	}
};

const game = new Phaser.Game(config);

function createShip(scope) {
	ship = scope.physics.add.sprite(WIDTH / 2, HEIGHT - 50, 'ship');
	ship.setCollideWorldBounds(true);
	ship.depth = 10;
	ship.anims.play('ship-default');
}

function createAlien(scope) {
	let alien = scope.physics.add.sprite(WIDTH / 2, HEIGHT / 2, 'alien');
	groupAliens.add(alien);
	alien.anims.play('alien-default');
	alien.depth = 20;
	alien.angle = 180;
	// alien.setCollideWorldBounds(true);

	if (random(2) === 1) {
		alien.setVelocityX(-80);
		alien.anims.play('alien-right', true);		
	} else {
		alien.setVelocityX(80);
		alien.anims.play('alien-left', true);
	}
}

function createCollisions(scope) {
	scope.physics.add.overlap(ship, groupAliens, () => {
		ship.destroy();
	}, null, scope);

	scope.physics.add.overlap(groupMissiles, groupAliens, (missile, alien) => {
		missile.destroy();
		alien.destroy();
	}, null, scope);

	scope.physics.add.overlap(groupMissiles, groupWalls, (missile, wall) => {
		missile.destroy();
	}, null, scope);

	scope.physics.add.overlap(groupAliens, wallLeft, (wall, alien) => {
		alien.setVelocityX(80);
		alien.y += 10;
		alien.anims.play('alien-left', true);
	}, null, scope);

	scope.physics.add.overlap(groupAliens, wallRight, (wall, alien) => {
		alien.setVelocityX(-80);
		alien.y += 10;
		alien.anims.play('alien-right', true);
	}, null, scope);

	scope.physics.add.overlap(groupAliens, wallBottom, (wall, alien) => {
		alert('GAME OVER');
	}, null, scope);
}

function createAnimations(scope) {
	function create(name, sprite, start, end, repeat = -1, frameRate = 10) {
		scope.anims.create({
			key: name,
			frames: scope.anims.generateFrameNumbers(sprite, { start: start, end: end }),
			frameRate: frameRate,
			repeat: repeat
		});
	}

	create('ship-default', 'ship', 0, 1);
	create('ship-left', 'ship', 2, 3);
	create('ship-right', 'ship', 4, 5);
	create('alien-default', 'alien', 0, 1);
	create('alien-left', 'alien', 2, 3);
	create('alien-right', 'alien', 4, 5);
	create('missile-default', 'missile', 0, 1);
	create('explosion-default', 'explosion', 0, 5, 30, 0);
}

function random(max) {
	return (Math.floor(Math.random() * max));
}