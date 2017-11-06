oskn.namespace('oskn', function () {

	this.Enemy = function () {
	};

	var cls = this.Enemy;

	cls.prototype.setup = function(appCore) {
		this.appCore = appCore;
		this.scene = this.appCore.sm.currentState;
		this.position = appCore.pool.vector2.alloc();
		this.targetPosition = appCore.pool.vector2.alloc();
		this.dirX = 1;
		this.sm = this.createStates();
		this.sm.switchState(StateId.S1);
		this.rect_ = this.appCore.pool.rect.alloc();
		this.rect_.set(0, 0, this.appCore.setting.enemy.size.x, this.appCore.setting.enemy.size.y);
		this.isDead_ = false;
		return this;
	};

	cls.prototype.free = function() {
		this.rect_.free();
		this.targetPosition.free();
		this.position.free();
		this.scene.enemy.table.remove(this);
	};

	cls.prototype.rect = function () {
		this.rect_.x = this.position.x;
		this.rect_.y = this.position.y;
		return this.rect_;
	};

	cls.prototype.isDead = function(v) {
		if (v === undefined) {
			return this.isDead_;
		} else {
			if (this.isDead_ === v) return;
			this.isDead_ = v;
			if (this.isDead_) {
				var explosion = this.appCore.pool.explosion.alloc().setup(this.appCore);
				explosion.position.copyFrom(this.position);
				this.scene.explosion.table.add(explosion);
				this.scene.freeTargets.push(this);
			}
		}
	};

	cls.prototype.update = function() {
		this.sm.update();
	};

	cls.prototype.onHit = function (other) {
		if (other.id.type() === oskn.AppObjectIdType.OWN_BULLET) {
			this.isDead(true);
		}
	};

	cls.prototype.onWallHit = function () {
		this.hasWallHit = true;
		this.targetFrameCount = this.app.sm.frameCount + 1;
	};

	cls.prototype.calcWaitFrameCount = function () {
		var enemyCount = this.scene.enemy.table.values.length;
		var t = oskn.AppMath.rate(enemyCount, 1, 20);
		var v = parseInt(oskn.AppMath.lerpIn(0, 30, t));
		return v;
	};

	cls.prototype.styleId = function() {
		switch (this.sm.currentState.id) {
		case StateId.SIDE_MOVE:
		case StateId.DOWN_MOVE:
				return StyleId.MOVE;
		default:
			return StyleId.WAIT;
		}
	};

	cls.prototype.createStates = function () {
		var sm = new oskn.StateMachine("Enemy");

		sm.addState(new oskn.StateBehaviour(StateId.S1, this,
			function (self) {
				self.sm.switchState(StateId.SIDE_MOVE);
		}));

		sm.addState(new oskn.StateBehaviour(StateId.SIDE_MOVE, this,
			function (self) {
				var info = self.scene.enemy.info;
				if (info.dirChangeFrameCount !== -1 && info.dirChangeFrameCount <= self.appCore.sm.frameCount) {
					info.dirX *= -1;
					info.dirChangeFrameCount = -1;
				}
				if (info.dirX != self.dirX) {
					self.dirX = info.dirX;
					self.sm.switchState(StateId.DOWN_MOVE);
					return;
				}
				self.position.x += self.dirX * self.appCore.setting.enemy.sideMoveDistance;
				if (((info.dirX < 0) && (self.position.x <= self.appCore.setting.enemy.xMin)) ||
					((0 < info.dirX) && (self.appCore.setting.enemy.xMax <= self.position.x))) {
					info.dirChangeFrameCount = self.appCore.sm.frameCount + 1;
				}
			}, function (self) {
			}, function (self) {
				var t = oskn.AppMath.progress01(self.sm.frameCount, self.calcWaitFrameCount());
				if (oskn.AppMath.isProgressCompleted(t)) {
					self.sm.switchState(StateId.WAIT);
				}
		}));

		sm.addState(new oskn.StateBehaviour(StateId.WAIT, this,
			function (self) {
		}, function (self) {
		}, function (self) {
			var t = oskn.AppMath.progress01(self.sm.frameCount, self.calcWaitFrameCount());
			if (oskn.AppMath.isProgressCompleted(t)) {
				self.sm.switchState(StateId.SIDE_MOVE);
			}
		}));

		sm.addState(new oskn.StateBehaviour(StateId.DOWN_MOVE, this,
			function (self) {
				self.position.y += self.appCore.setting.enemy.downMoveDistance;
			}, function (self) {
			}, function (self) {
			var t = oskn.AppMath.progress01(self.sm.frameCount, self.calcWaitFrameCount());
			if (oskn.AppMath.isProgressCompleted(t)) {
				self.sm.switchState(StateId.WAIT);
			}
		}));

		return sm;
	};

	oskn.EnemyStyleId = oskn.createEnum("StyleId", {
		WAIT: 1,
		MOVE: 2,
	});

	var StyleId = oskn.EnemyStyleId;

	var StateId = oskn.createEnum("StateId", {
		S1: 1,
		WAIT: 2,
		SIDE_MOVE: 3,
		DOWN_MOVE: 4,
	});
});

