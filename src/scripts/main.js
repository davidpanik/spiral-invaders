/* This is the starting point of the code, everything gets kicked off here */

'use strict';

import Phaser from './vendor/phaser.min';

let cursors, ship;
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
			this.load.spritesheet('missile', './images/missile.png', { frameWidth: 8, frameHeight: 19 });
		},
		create: function () {
			this.add.image(WIDTH / 2, HEIGHT / 2, 'space');

			ship = this.physics.add.sprite(400, 550, 'ship');
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
				key: 'missile-default',
				frames: this.anims.generateFrameNumbers('missile', { start: 0, end: 1 }),
				frameRate: 10,
				repeat: -1
			});

			ship.setCollideWorldBounds(true);
			ship.depth = 10;
			ship.anims.play('ship-default');

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
				if (missiles.canFire) {
					let missile = this.physics.add.sprite(ship.x, ship.y, 'missile');
					missile.anims.play('missile-default');
					missile.setVelocityY(-200);
					
					missiles.canFire = false;
					missiles.timer = setTimeout(() => {
						missiles.canFire = true;
					}, missiles.delay);
				}
			}
		}
	}
};

const game = new Phaser.Game(config);
