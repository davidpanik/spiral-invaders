/* This is the starting point of the code, everything gets kicked off here */

'use strict';

import Phaser from './vendor/phaser.min';

let cursors, ship, alien, background, enemies, missiles;
const missileConfig = {
	canFire: true,
	delay: 500,
	timer: null
};

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
			background = this.add.tileSprite(WIDTH / 2, HEIGHT / 2, WIDTH, HEIGHT, 'space');
			enemies = this.physics.add.group();
			missiles = this.physics.add.group();
			ship = this.physics.add.sprite(WIDTH / 2, HEIGHT - 50, 'ship');
			alien = this.physics.add.sprite(WIDTH / 2, HEIGHT / 2, 'alien');
			enemies.add(alien);

			createAnimations(this);

			ship.setCollideWorldBounds(true);
			ship.depth = 10;
			ship.anims.play('ship-default');

			alien.anims.play('alien-default');
			alien.depth = 20;
			alien.angle = 180;
			alien.setVelocityX(-80);
			alien.setCollideWorldBounds(true);
			alien.anims.play('alien-right', true);

			this.physics.add.overlap(ship, enemies, () => {
				ship.destroy();
			}, null, this);

			this.physics.add.overlap(missiles, enemies, (missile, enemy) => {
				missile.destroy();
				enemy.destroy();
			}, null, this);

			cursors = this.input.keyboard.createCursorKeys();
		},
		update: function() {
			if (cursors.left.isDown) {
				ship.setVelocityX(-160);
				ship.anims.play('ship-left', true);
			} else if (cursors.right.isDown) {
				ship.setVelocityX(160);
				ship.anims.play('ship-right', true);
			} else {
				ship.setVelocityX(0);
				ship.anims.play('ship-default', true);
			}

			if (cursors.space.isDown) {
				if (missileConfig.canFire) {
					let missile = this.physics.add.sprite(ship.x, ship.y, 'missile');
					missiles.add(missile);
					missile.anims.play('missile-default');
					missile.setVelocityY(-200);

					setTimeout(() => {
						if (missile.body && missile.body.checkWorldBounds()) {
							missile.destroy();
						}
					}, 4000);
					
					missileConfig.canFire = false;
					missileConfig.timer = setTimeout(() => {
						missileConfig.canFire = true;
					}, missileConfig.delay);
				}
			}

			background.tilePositionX -= 0.1;
			background.tilePositionY -= 0.2;
		}
	}
};

const game = new Phaser.Game(config);

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
