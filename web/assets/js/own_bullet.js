oskn.namespace('oskn', function () {

	oskn.OwnBullet = function(app) {
		this.app = app;
		this.sm = this.createStates();
		this.onFree = new oskn.Subject();
		this.onDead = new oskn.Subject();
		this.isDead_ = false;
	};

	var cls = oskn.OwnBullet;

	cls.prototype.setup = function() {
		this.id = oskn.AppObjectId.getEmpty();
		this.scene = this.app.sm.currentState;
		this.position = this.app.pool.vector2.alloc();
		this.power = this.app.pool.vector2.alloc();
		this.sm.switchState(StateId.S1);
		this.rect_ = this.app.pool.rect.alloc();
		this.rect_.set(0, 0, this.app.setting.ownBullet.size.x, this.app.setting.ownBullet.size.y);
		this.isDead_ = false;
		return this;
	};

	cls.prototype.free = function() {
		this.sm.exitState();
		this.onFree.onNext();
		this.scene.ownBullet.table.remove(this);
		this.position.free();
		this.power.free();
		this.rect_.free();
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
	};

	cls.prototype.createStates = function () {
		var sm = new oskn.StateMachine(this.app, "IngameEnemy");
		sm.addState(new oskn.StateBehaviour(StateId.S1, this,
			function (self) {
				self.sm.switchState(StateId.S2);
		}));

		sm.addState(new oskn.StateBehaviour(StateId.S2, this,
			function (self) {
		}, function (self) {
		}, function (self) {
			self.position.add(self.power);
			if (self.position.y < 0) {
				self.sm.switchState(StateId.S3);
			}
		}));

		sm.addState(new oskn.StateBehaviour(StateId.S3, this,
		function (self) {
			self.isDead(true);
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

