oskn.namespace('oskn', function () {

	this.AppCore = function() {
		this.app = this;
		this.setting = oskn.setting;
		var app = this.app;

		this.pool = {
			vector2: new oskn.InstancePool(function() {
				return Vector2(0, 0);
			}),

			rect: new oskn.InstancePool(function() {
				return Rect(0, 0, 0, 0);
			}),

			button: new oskn.InstancePool(function() {
				return {
					stay: false,
					up: false,
					down: false,
				};
			}),

			enemy: new oskn.InstancePool(function() {
				return new oskn.Enemy(app);
			}),

			ownBullet: new oskn.InstancePool(function() {
				return new oskn.OwnBullet(app);
			}),

			explosion: new oskn.InstancePool(function() {
				return new oskn.Explosion(app);
			}),
		};
		this.pointer = {
			position: this.pool.vector2.alloc(),
			button: this.pool.button.alloc(),
		};
		this.time = new oskn.TimeService(this);
		this.keyboard = null;
		this.StateId = StateId;
		this.sm = this.createStates();
		this.sm.switchState(StateId.S1);
	};

	var cls = this.AppCore;

	cls.prototype.update = function (phinaApp) {
		this.keyboard = phinaApp.keyboard;

		var dt = this.time.oneFrameTime * this.time.timeScale;
		if (this.keyboard.getKey(this.setting.key.playSpeedFast)) {
			dt *= this.setting.time.fastScale;
		} else if (this.keyboard.getKey(this.setting.key.playSpeedSlow)) {
			dt *= this.setting.time.slowScale;
		}

		this.time.updateByDeltaTime(dt, phinaApp, this.innerUpdate, this);
	};

	cls.prototype.innerUpdate = function(phinaApp) {
		this.captureInput(phinaApp);
		this.sm.update();
		this.time.update();
	};

	cls.prototype.captureInput = function(phinaApp) {
		var p1 = phinaApp.pointer;
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

		if (phinaApp.keyboard.getKey('c')) {
			console.log('c!');
		}
	};

	cls.prototype.createStates = function () {
		var sm = new oskn.StateMachine(this.app, "AppCore");
		sm.verbose = true;
		sm.addState(new oskn.StateBehaviour(StateId.S1, this,
			function (self) {
				self.sm.switchState(StateId.TITLE);
		}));

		sm.addState(new oskn.Title(StateId.TITLE, this));

		sm.addState(new oskn.Ingame(StateId.INGAME, this));

		sm.addState(new oskn.StateBehaviour(StateId.S3, this,
			function (self) {
		}));

		return sm;
	};

	oskn.AppStateId = oskn.createEnum('StateId', {
		S1: 1,
		TITLE: 2,
		INGAME: 3,
		S3: 4,
	});

	var StateId = oskn.AppStateId;

});

oskn.namespace('oskn', function () {

	oskn.TimeService = function(app) {
		this.app = app;
		this.fps = app.setting.time.fps;
		this.oneFrameTime = 1.0 / this.fps;
		this.timeScale = 1.0;
		this.deltaTime = this.oneFrameTime;
		this.frameElapsedTime = 0.0;
		this.frameCount = 0;
		/** 消化が必要な時間. */
		this.needUpdateTime_ = 0.0;
	};
	var cls = oskn.TimeService;

	cls.prototype.updateByDeltaTime = function(dt, phinaApp, func, funcThis) {
		this.needUpdateTime_ += dt;
		var needFrameCount = parseInt(this.needUpdateTime_ / this.oneFrameTime);
		for (var i = 0; i < needFrameCount; ++i) {
			func.call(funcThis, phinaApp);
		}
	};

	cls.prototype.update = function() {
		++this.frameCount;
		this.frameElapsedTime += this.oneFrameTime;
		this.needUpdateTime_ -= this.oneFrameTime;
	};
});

