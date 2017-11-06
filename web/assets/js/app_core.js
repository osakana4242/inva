oskn.namespace('oskn', function () {

	this.AppCore = function() {
		this.setting = {
			screenSize: {
				x: 240,
				y: 320,
			},
			ship: {
				size: {
					x: 8,
					y: 8,
				},
				xMin: 16,
				xMax: 240 - 16,
				baseY: 240 - 8,
			},
			enemy: {
				size: {
					x: 8,
					y: 8,
				},
				sideMoveDistance: 4,
				downMoveDistance: 8,
				xMin: 16,
				xMax: 240 - 16,
			},
			ownBullet: {
				speed: 4,
				size: {
					x: 2,
					y: 4,
				},
			},
		};

		this.pool = {
			vector2: InstancePool(function() {
				return Vector2(0, 0);
			}),

			rect: InstancePool(function() {
				return Rect(0, 0, 0, 0);
			}),

			button: InstancePool(function() {
				return {
					stay: false,
					up: false,
					down: false,
				};
			}),

			enemy: InstancePool(function() {
				return new oskn.Enemy();
			}),

			ownBullet: InstancePool(function() {
				return OwnBullet();
			}),

			explosion: InstancePool(function() {
				return new oskn.Explosion();
			}),
		};
		this.pointer = {
			position: this.pool.vector2.alloc(),
			button: this.pool.button.alloc(),
		};
		this.StateId = StateId;
		this.sm = this.createStates();
		this.sm.switchState(StateId.S1);
	};

	var cls = this.AppCore;

	cls.prototype.update = function (app) {
		this.captureInput(app);
		this.sm.update();
	};

	cls.prototype.captureInput = function(app) {
		var p1 = app.pointer;
		var p2 = this.pointer;
		p2.position.copyFrom(p1.position);

		var b = p1.getPointing();
		if (b) {
			var n;
			n = 0;
		}
		p2.button.up = p2.button.stay && !b;
		p2.button.down = !p2.button.stay && b;
		p2.button.stay = b;
	};

	cls.prototype.createStates = function () {
		var sm = new oskn.StateMachine("AppCore");
		sm.verbose = true;
		sm.addState(new oskn.StateBehaviour(StateId.S1, this,
			function (self) {
				self.sm.switchState(StateId.INGAME);
		}));

		sm.addState(new oskn.Ingame(StateId.INGAME, this));

		sm.addState(new oskn.StateBehaviour(StateId.S3, this,
			function (self) {
		}));

		return sm;
	};

	var StateId = oskn.createEnum('StateId', {
		S1: 1,
		INGAME: 2,
		S3: 3,
	});

});

