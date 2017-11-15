oskn.namespace('oskn', function () {

	oskn.Ship = function(app) {
		this.app = app;
		this.sm = this.createStates();
		this.isDead_ = false;
		this.bulletDisposer = new oskn.CompositDisposable();
	};

	var cls = oskn.Ship;

	cls.prototype.setup = function() {
		this.id = oskn.AppObjectId.getEmpty();
		this.position = this.app.pool.vector2.alloc();
		this.targetPosition = this.app.pool.vector2.alloc();
		this.scene = this.app.sm.currentState;
		this.position.x = oskn.AppMath.lerp(this.app.setting.ship.xMin, this.app.setting.ship.xMax, 0.5);
		this.position.y = this.app.setting.ship.baseY;
		this.targetPosition.copyFrom(this.position);
		this.rect_ = this.app.pool.rect.alloc();
		this.rect_.set(0, 0, this.app.setting.ship.size.x, this.app.setting.ship.size.y);
		this.isDead_ = false;
		this.sm.switchState(StateId.S1);
		return this;
	};

	cls.prototype.free = function() {
		this.sm.exitState();
		this.rect_.free();
		this.targetPosition.free();
		this.position.free();
		this.bulletDisposer.clear();
	};

	cls.prototype.isDead = function(v) {
		if (v === undefined) {
			return this.isDead_;
		} else {
			if (this.isDead_ === v) return;
			this.isDead_ = v;
			if (this.isDead_) {
				var explosion = this.app.pool.explosion.alloc().setup();
				explosion.position.copyFrom(this.position);
				this.scene.explosion.table.add(explosion);
				this.onDead.onNext();
				this.scene.freeTargets.push(this);
			}
		}
	};

	cls.prototype.rect = function () {
		this.rect_.x = this.position.x;
		this.rect_.y = this.position.y;
		return this.rect_;
	};

	cls.prototype.update = function() {
		this.sm.update();
		this.targetPosition.copyFrom(this.app.pointer.position);
		this.targetPosition.x = oskn.AppMath.clamp(this.targetPosition.x, this.app.setting.ship.xMin, this.app.setting.ship.xMax);
		this.targetPosition.y = this.app.setting.ship.baseY;

		if (this.app.pointer.button.up) {
			if (!this.bullet) {
				this.bulletDisposer.clear();
				this.bullet = this.app.pool.ownBullet.alloc().setup();
				this.bullet.position.copyFrom(this.position);
				this.bullet.power.set(0, -this.app.setting.ownBullet.speed);
				this.scene.ownBullet.table.add(this.bullet);
				var disposer = this.bullet.onDead.subscribe(new oskn.Observer().setup(this, function (self) {
					self.bullet = null;
				}));
				this.bulletDisposer.add(disposer);
			}
		}
		var v = this.app.pool.vector2.alloc();
		v.x = oskn.AppMath.lerp(this.position.x, this.targetPosition.x, 0.5);
		v.y = oskn.AppMath.lerp(this.position.y, this.targetPosition.y, 0.5);
		this.position.copyFrom(v);
		v.free();
	};

	cls.prototype.createStates = function () {
		var sm = new oskn.StateMachine(this.app, "Ship");
		sm.addState(new oskn.StateBehaviour(StateId.S1, this,
			function (self) {
				self.sm.switchState(StateId.S2);
		}));

		sm.addState(new oskn.StateBehaviour(StateId.S2, this,
			function (self) {
		}, function (self) {
		}, function (self) {
		}));

		sm.addState(new oskn.StateBehaviour(StateId.S3, this,
			function (self) {
		}, function (self) {
		}, function (self) {
		}));

		return sm;
	};

	var StateId = {
		S1: 1,
		S2: 2,
		S3: 3,
	};
});

