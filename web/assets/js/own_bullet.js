(function () {
	phina.define("OwnBullet", {
		init: function () {
			this.sm = this.createStates();
			this.onFree = Subject();
			this.onDead = Subject();
			this.isDead_ = false;
		},
		setup: function(appCore) {
			this.appCore = appCore;
			this.scene = this.appCore.sm.currentState;
			this.position = appCore.pool.vector2.alloc();
			this.power = appCore.pool.vector2.alloc();
			this.sm.switchState(StateId.S1);
			this.rect_ = this.appCore.pool.rect.alloc();
			this.rect_.set(0, 0, this.appCore.setting.ownBullet.size.x, this.appCore.setting.ownBullet.size.y);
			this.isDead_ = false;
			return this;
		},
		isDead: function(v) {
			if (v === undefined) {
				return this.isDead_;
			} else {
				if (this.isDead_ === v) return;
				this.isDead_ = v;
				if (this.isDead_) {
					var explosion = this.appCore.pool.explosion.alloc().setup(this.appCore);
					explosion.position.copyFrom(this.position);
					this.scene.explosion.table.add(explosion);
					this.onDead.onNext();
					this.scene.freeTargets.push(this);
				}
			}
		},
		free: function() {
			this.onFree.onNext();
			this.scene.ownBullet.table.remove(this);
			this.position.free();
			this.power.free();
			this.rect_.free();
		},
		rect: function () {
			this.rect_.x = this.position.x;
			this.rect_.y = this.position.y;
			return this.rect_;
		},
		update: function() {
			this.sm.update();
		},
		createStates: function () {
			var sm = new oskn.StateMachine("IngameEnemy");
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
		},
	});

	var StateId = {
		S1: 1,
		S2: 2,
		S3: 3,
	};
})();

