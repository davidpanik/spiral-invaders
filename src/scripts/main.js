/* This is the starting point of the code, everything gets kicked off here */

'use strict';

import Phaser from './vendor/phaser.min';

let cursors, ship;
let missiles = {
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
				key: 'ship-animate',
				frames: this.anims.generateFrameNumbers('ship', { start: 0, end: 1 }),
				frameRate: 10,
				repeat: -1
			});
			this.anims.create({
				key: 'missile-animate',
				frames: this.anims.generateFrameNumbers('missile', { start: 0, end: 1 }),
				frameRate: 10,
				repeat: -1
			});

			ship.setCollideWorldBounds(true);
			ship.anims.play('ship-animate');

			cursors = this.input.keyboard.createCursorKeys();
		},
		update: function() {
			if (cursors.left.isDown) {
				ship.setVelocityX(-160);
			} else if (cursors.right.isDown) {
				ship.setVelocityX(160);
			} else {
				ship.setVelocityX(0);
			}

			if (cursors.space.isDown) {
				if (missiles.canFire) {
					var missile = this.physics.add.sprite(ship.x, ship.y, 'missile');
					missile.anims.play('missile-animate');
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
