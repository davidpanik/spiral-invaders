/* This is the starting point of the code, everything gets kicked off here */

'use strict';

import Phaser from './vendor/phaser.min';


const game = {
	WIDTH: 800,
	HEIGHT: 600,
	init: function() {

	},
	collisions: function(scope) {
		scope.physics.add.overlap(ship.sprite, aliens.group, () => {
			ship.sprite.destroy();
			alert('GAME OVER');
		}, null, scope);

		scope.physics.add.overlap(missiles.group, aliens.group, (missile, alien) => {
			missile.destroy();
			alien.destroy();
		}, null, scope);

		scope.physics.add.overlap(missiles.group, walls.group, (missile, wall) => {
			missile.destroy();
		}, null, scope);

		scope.physics.add.overlap(aliens.group, walls.left, (wall, alien) => {
			alien.setVelocityX(80);
			alien.y += 10;
			alien.anims.play('alien-left', true);
		}, null, scope);

		scope.physics.add.overlap(aliens.group, walls.right, (wall, alien) => {
			alien.setVelocityX(-80);
			alien.y += 10;
			alien.anims.play('alien-right', true);
		}, null, scope);

		scope.physics.add.overlap(aliens.group, walls.bottom, (wall, alien) => {
			alert('GAME OVER');
		}, null, scope);
	}	
};

const ship = {
	SPEED: 160,
	scope: null,
	sprite: null,
	init: function(scope) {
		this.scope = scope;

		this.sprite = this.scope.physics.add.sprite(game.WIDTH / 2, game.HEIGHT - 50, 'ship');
		this.sprite.setCollideWorldBounds(true);
		this.sprite.depth = 10;
		this.sprite.anims.play('ship-default');
	},
	moveLeft: function() {
		this.sprite.setVelocityX(-1 * this.SPEED);
		this.sprite.anims.play('ship-left', true);
	},
	moveRight: function() {
		this.sprite.setVelocityX(this.SPEED);
		this.sprite.anims.play('ship-right', true);
	},
	stop: function() {
		this.sprite.setVelocityX(0);
		this.sprite.anims.play('ship-default', true);
	}
}

const cannon = {
	canFire: true,
	delay: 500,
	timer: null,
	fire: function() {
		if (cannon.canFire) {
			missiles.add();

			this.canFire = false;
			this.timer = setTimeout(() => {
				this.canFire = true;
			}, this.delay);
		}
	}
};

const walls = {
	SIZE: 100,
	scope: null,
	top: null,
	bottom: null,
	left: null,
	right: null,
	group: null,
	init: function(scope) {
		this.scope = scope;

		this.left = this.scope.add.tileSprite(0 - (this.SIZE / 2), game.HEIGHT / 2, this.SIZE, game.HEIGHT + (this.SIZE * 2), 'transparent');
		this.right = this.scope.add.tileSprite(game.WIDTH + (this.SIZE / 2), game.HEIGHT / 2, this.SIZE, game.HEIGHT + (this.SIZE * 2), 'transparent');

		this.top = this.scope.add.tileSprite(game.WIDTH / 2, 0 - (this.SIZE / 2), game.WIDTH + (this.SIZE * 2), this.SIZE, 'transparent');
		this.bottom = this.scope.add.tileSprite(game.WIDTH / 2, game.HEIGHT + (this.SIZE / 2), game.WIDTH + (this.SIZE * 2), this.SIZE, 'transparent');

		this.group = this.scope.physics.add.group();

		this.group.add(this.left);
		this.group.add(this.right);
		this.group.add(this.top);
		this.group.add(this.bottom);
	}
};

const aliens = {
	SPEED: 100,
	scope: null,
	group: null,
	init: function(scope) {
		this.scope = scope;

		this.group = this.scope.physics.add.group();
	},
	add: function() {
		let alien = this.scope.physics.add.sprite(game.WIDTH / 2, game.HEIGHT / 2, 'alien');
		this.group.add(alien);
		alien.anims.play('alien-default');
		alien.depth = 20;
		alien.angle = 180;

		if (random(2) === 1) {
			this.moveLeft(alien);
		} else {
			this.moveRight(alien);
		}
	},
	moveLeft: function(alien) {
		alien.setVelocityX(-1 * this.SPEED);
		alien.anims.play('alien-right', true);
	},
	moveRight: function(alien) {
		alien.setVelocityX(this.SPEED);
		alien.anims.play('alien-left', true);		
	}
}

const controls = {
	scope: null,
	cursors: null,
	init: function(scope) {
		this.scope = scope;

		this.cursors = this.scope.input.keyboard.createCursorKeys();
	},
	update: function () {
		if (this.cursors.left.isDown) {
			ship.moveLeft();
		} else if (this.cursors.right.isDown) {
			ship.moveRight();
		} else {
			ship.stop();
		}

		if (this.cursors.space.isDown) {
			cannon.fire(this.scope);
		}
	}
}

const missiles = {
	SPEED: -200,
	scope: null,
	group: null,
	init: function(scope) {
		this.scope = scope;

		this.group = this.scope.physics.add.group();
	},
	add: function() {
		let missile = this.scope.physics.add.sprite(ship.sprite.x, ship.sprite.y, 'missile');
		this.group.add(missile);
		missile.anims.play('missile-default');
		missile.setVelocityY(this.SPEED);
	}
};

const background = {
	sprite: null,
	scope: null,
	init: function(scope) {
		this.scope = scope;
		this.sprite = this.scope.add.tileSprite(game.WIDTH / 2, game.HEIGHT / 2, game.WIDTH, game.HEIGHT, 'space');
	},
	update: function() {
		this.sprite.tilePositionX -= 0.1;
		this.sprite.tilePositionY -= 0.2;
	}
};

const assets = {
	load: function(scope) {
		scope.load.image('space', './images/space.png');
		scope.load.image('transparent', './images/transparent.png');
		scope.load.spritesheet('ship', './images/ship.png', { frameWidth: 32, frameHeight: 44 });
		scope.load.spritesheet('alien', './images/alien.png', { frameWidth: 32, frameHeight: 32 });
		scope.load.spritesheet('missile', './images/missile.png', { frameWidth: 8, frameHeight: 19 });
		scope.load.spritesheet('explosion', './images/explosion.png', { frameWidth: 32, frameHeight: 32 });
	},
	configure: function(scope) {
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
};

function random(max) {
	return (Math.floor(Math.random() * max));
}


new Phaser.Game({
	width: game.WIDTH,
	height: game.HEIGHT,
	physics: {
		default: 'arcade'
	},
	scene: {
		preload: function () {
			assets.load(this);
		},
		create: function () {
			assets.configure(this);
			background.init(this);
			walls.init(this);
			ship.init(this);
			missiles.init(this);
			aliens.init(this);
			aliens.add(this);
			controls.init(this);
			game.collisions(this);
		},
		update: function () {
			controls.update();
			background.update();
		}
	}
});
