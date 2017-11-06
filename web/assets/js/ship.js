oskn.namespace('oskn', function () {

	this.Ship = function() {
		this.sm = this.createStates();
	};

	var cls = this.Ship;

	cls.prototype.setup = function(appCore) {
		this.appCore = appCore;
		this.position = appCore.pool.vector2.alloc();
		this.targetPosition = appCore.pool.vector2.alloc();
		this.scene = this.appCore.sm.currentState;
		this.position.x = oskn.AppMath.lerp(this.appCore.setting.ship.xMin, this.appCore.setting.ship.xMax, 0.5);
		this.position.y = this.appCore.setting.ship.baseY;
		this.targetPosition.copyFrom(this.position);
		this.rect_ = this.appCore.pool.rect.alloc();
		this.rect_.set(0, 0, this.appCore.setting.ship.size.x, this.appCore.setting.ship.size.y);
		this.sm.switchState(StateId.S1);
		return this;
	};

	cls.prototype.free = function() {
		this.rect_.free();
		this.targetPosition.free();
		this.position.free();
	};

	cls.prototype.rect = function () {
		this.rect_.x = this.position.x;
		this.rect_.y = this.position.y;
		return this.rect_;
	};

	cls.prototype.update = function() {
		this.sm.update();
		//if (this.appCore.pointer.button.stay) {
			this.targetPosition.copyFrom(this.appCore.pointer.position);
			this.targetPosition.x = oskn.AppMath.clamp(this.targetPosition.x, this.appCore.setting.ship.xMin, this.appCore.setting.ship.xMax);
			this.targetPosition.y = this.appCore.setting.ship.baseY;
		//}
		if (this.appCore.pointer.button.up) {
			if (!this.bullet) {
				this.bullet = this.appCore.pool.ownBullet.alloc().setup(this.appCore);
				this.bullet.position.copyFrom(this.position);
				this.bullet.power.set(0, -this.appCore.setting.ownBullet.speed);
				this.scene.ownBullet.table.add(this.bullet);
				this.bullet.onDead.subscribe(Observer().setup(this, function (self) {
					self.bullet = null;
				}));
			}
		}
		var v = this.appCore.pool.vector2.alloc();
		v.x = oskn.AppMath.lerp(this.position.x, this.targetPosition.x, 0.5);
		v.y = oskn.AppMath.lerp(this.position.y, this.targetPosition.y, 0.5);
		this.position.copyFrom(v);
		v.free();
	};

	cls.prototype.createStates = function () {
		var sm = new oskn.StateMachine("Ship");
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

