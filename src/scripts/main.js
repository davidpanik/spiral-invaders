/* This is the starting point of the code, everything gets kicked off here */

'use strict';

import Phaser from './vendor/phaser.min';

let cursors, ship, alien, background;
const missiles = {
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
		},
		create: function () {
			background = this.add.tileSprite(WIDTH / 2, HEIGHT / 2, WIDTH, HEIGHT, 'space');

			ship = this.physics.add.sprite(WIDTH / 2, HEIGHT - 50, 'ship');
			alien = this.physics.add.sprite(WIDTH / 2, HEIGHT / 2, 'alien');

			this.anims.create({
				key: 'ship-default',
				frames: this.anims.generateFrameNumbers('ship', { start: 0, end: 1 }),
				frameRate: 10,
				repeat: -1
			});
			this.anims.create({
				key: 'ship-left',
				frames: this.anims.generateFrameNumbers('ship', { start: 2, end: 3 }),
				frameRate: 10,
				repeat: -1
			});
			this.anims.create({
				key: 'ship-right',
				frames: this.anims.generateFrameNumbers('ship', { start: 4, end: 5 }),
				frameRate: 10,
				repeat: -1
			});
			this.anims.create({
				key: 'alien-default',
				frames: this.anims.generateFrameNumbers('alien', { start: 0, end: 1 }),
				frameRate: 10,
				repeat: -1
			});
			this.anims.create({
				key: 'alien-left',
				frames: this.anims.generateFrameNumbers('alien', { start: 2, end: 3 }),
				frameRate: 10,
				repeat: -1
			});
			this.anims.create({
				key: 'alien-right',
				frames: this.anims.generateFrameNumbers('alien', { start: 4, end: 5 }),
				frameRate: 10,
				repeat: -1
			});
			this.anims.create({
				key: 'missile-default',
				frames: this.anims.generateFrameNumbers('missile', { start: 0, end: 1 }),
				frameRate: 10,
				repeat: -1
			});

			this.physics.world.on("worldbounds", function (body) {
				console.log('crash', body);
			});

			ship.setCollideWorldBounds(true);
			ship.depth = 10;
			ship.anims.play('ship-default');

			alien.anims.play('alien-default');
			alien.depth = 20;
			alien.angle = 180;
			alien.setVelocityX(-80);
			alien.anims.play('alien-right', true);

			cursors = this.input.keyboard.createCursorKeys();
			console.log(background);
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
				if (missiles.canFire) {
					let missile = this.physics.add.sprite(ship.x, ship.y, 'missile');
					missile.anims.play('missile-default');
					missile.setVelocityY(-200);

					setTimeout(() => {
						if (missile.body.checkWorldBounds()) {
							missile.destroy();
						}
					}, 4000);
					
					missiles.canFire = false;
					missiles.timer = setTimeout(() => {
						missiles.canFire = true;
					}, missiles.delay);
				}
			}

			background.tilePositionX -= 0.1;
			background.tilePositionY -= 0.2;
		}
	}
};

const game = new Phaser.Game(config);
