/* This is the starting point of the code, everything gets kicked off here */

'use strict';

import Phaser from './vendor/phaser.min';

var cursors, ship;

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
			this.load.image('ship', './images/ship.png');
		},
		create: function () {
			this.add.image(WIDTH / 2, HEIGHT / 2, 'space');

			ship = this.physics.add.image(400, 550, 'ship');

			ship.setCollideWorldBounds(true);

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
		}
	}
};
const game = new Phaser.Game(config);
