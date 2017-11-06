oskn.namespace('oskn', function () {
	this.ExplosionService = function () {
		this.table = new oskn.OneIdTable();
	};
	var cls = this.ExplosionService;

	cls.prototype.setup = function (appCore) {
		this.appCore = appCore;
		this.table.setup(this.appCore, oskn.AppObjectIdType.EXPLOSION);
		return this;
	};

	cls.prototype.free = function () {
		this.table.free();
	};

	return cls;
});


oskn.namespace('oskn', function () {
	this.Explosion = function() {
		this.sm = this.createStates();
		this.onFree = Subject();
		this.onDead = Subject();
		this.isDead_ = false;
	};
	var cls = oskn.Explosion;

	cls.prototype.setup = function(appCore) {
		this.appCore = appCore;
		this.scene = this.appCore.sm.currentState;
		this.position = appCore.pool.vector2.alloc();
		this.power = appCore.pool.vector2.alloc();
		this.sm.switchState(StateId.S1);
		this.rect_ = this.appCore.pool.rect.alloc();
		this.rect_.set(0, 0, this.appCore.setting.ownBullet.size.x, this.appCore.setting.ownBullet.size.y);
		this.isDead_ = false;
		return this;
	};

	cls.prototype.isDead = function(v) {
		if (v === undefined) {
			return this.isDead_;
		} else {
			if (this.isDead_ === v) return;
			this.isDead_ = v;
			if (this.isDead_) {
				this.onDead.onNext();
				this.scene.freeTargets.push(this);
			}
		}
	};

	cls.prototype.free = function() {
		this.onFree.onNext();
		this.scene.explosion.table.remove(this);
		this.position.free();
		this.power.free();
		this.rect_.free();
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
		var sm = new oskn.StateMachine(cls.name);
		sm.addState(new oskn.StateBehaviour(StateId.S1, this,
			function () {
		}, function() {
		}, function() {
			var duration = 30;
			var t = oskn.AppMath.progress01(this.sm.frameCount, duration);
			if (oskn.AppMath.isProgressCompleted(t)) {
				this.sm.switchState(StateId.S2);
			}
		}));

		sm.addState(new oskn.StateBehaviour(StateId.S2, this,
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
	};
});

