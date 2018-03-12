/* This is the starting point of the code, everything gets kicked off here */

'use strict';

import Phaser from './vendor/phaser.min';

const config = {
	width: 800,
	height: 600,
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 200 }
		}
	},
	scene: {
		preload: function() {
			this.load.setBaseURL('http://labs.phaser.io');

			this.load.image('sky', 'assets/skies/space3.png');
			this.load.image('logo', 'assets/sprites/phaser3-logo.png');
			this.load.image('red', 'assets/particles/red.png');
		},
		create: function () {
			this.add.image(400, 300, 'sky');

			var particles = this.add.particles('red');

			var emitter = particles.createEmitter({
				speed: 100,
				scale: { start: 1, end: 0 },
				blendMode: 'ADD'
			});

			var logo = this.physics.add.image(400, 100, 'logo');

			logo.setVelocity(100, 200);
			logo.setBounce(1, 1);
			logo.setCollideWorldBounds(true);

			emitter.startFollow(logo);
		}
	}
};
const game = new Phaser.Game(config);
