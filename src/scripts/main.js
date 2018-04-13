/* This is the starting point of the code, everything gets kicked off here */

'use strict';

import Phaser from './vendor/phaser.min';

let cursors, ship, background, groupAliens, groupMissiles;

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

			setTimeout(() => {
				if (missile.body && missile.body.checkWorldBounds()) {
					missile.destroy();
				}
			}, 4000);

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
			this.load.spritesheet('ship', './images/ship.png', { frameWidth: 32, frameHeight: 44 });
			this.load.spritesheet('alien', './images/alien.png', { frameWidth: 32, frameHeight: 32 });
			this.load.spritesheet('missile', './images/missile.png', { frameWidth: 8, frameHeight: 19 });
			this.load.spritesheet('explosion', './images/explosion.png', { frameWidth: 32, frameHeight: 32 });
		},
		create: function () {
			createAnimations(this);

			background = this.add.tileSprite(WIDTH / 2, HEIGHT / 2, WIDTH, HEIGHT, 'space');

			groupAliens = this.physics.add.group();
			groupMissiles = this.physics.add.group();

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
	alien.setVelocityX(-80);
	alien.setCollideWorldBounds(true);
	alien.anims.play('alien-right', true);
}

function createCollisions(scope) {
	scope.physics.add.overlap(ship, groupAliens, () => {
		ship.destroy();
	}, null, scope);

	scope.physics.add.overlap(groupMissiles, groupAliens, (missile, enemy) => {
		missile.destroy();
		enemy.destroy();
	}, null, scope);
}

function createAnimations(scope) {
	scope.anims.create({
		key: 'ship-default',
		frames: scope.anims.generateFrameNumbers('ship', { start: 0, end: 1 }),
		frameRate: 10,
		repeat: -1
	});
	scope.anims.create({
		key: 'ship-left',
		frames: scope.anims.generateFrameNumbers('ship', { start: 2, end: 3 }),
		frameRate: 10,
		repeat: -1
	});
	scope.anims.create({
		key: 'ship-right',
		frames: scope.anims.generateFrameNumbers('ship', { start: 4, end: 5 }),
		frameRate: 10,
		repeat: -1
	});
	scope.anims.create({
		key: 'alien-default',
		frames: scope.anims.generateFrameNumbers('alien', { start: 0, end: 1 }),
		frameRate: 10,
		repeat: -1
	});
	scope.anims.create({
		key: 'alien-left',
		frames: scope.anims.generateFrameNumbers('alien', { start: 2, end: 3 }),
		frameRate: 10,
		repeat: -1
	});
	scope.anims.create({
		key: 'alien-right',
		frames: scope.anims.generateFrameNumbers('alien', { start: 4, end: 5 }),
		frameRate: 10,
		repeat: -1
	});
	scope.anims.create({
		key: 'missile-default',
		frames: scope.anims.generateFrameNumbers('missile', { start: 0, end: 1 }),
		frameRate: 10,
		repeat: -1
	});
	scope.anims.create({
		key: 'explosion-default',
		frames: scope.anims.generateFrameNumbers('explosion', { start: 0, end: 5 }),
		frameRate: 30,
		repeat: 0
	});
}
