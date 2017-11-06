
oskn.namespace('oskn', function () {
	this.Ingame = function(stateId, appCore) {
		super_.call(this, stateId);
		this.appCore = appCore;
		this.sm = this.createStates();
		this.sm.switchState(StateId.S1);
		this.freeTargets = [];
	};

	var cls = this.Ingame;
	var super_ = oskn.StateBehaviour;
	oskn.inherits(cls, super_);

	cls.prototype.init = function(stateId, appCore) {
		this.superInit(stateId);
		this.appCore = appCore;
		this.sm = this.createStates();
		this.sm.switchState(StateId.S1);
	};

	cls.prototype.enter = function () {
		this.ship = new oskn.Ship().setup(this.appCore);
		this.ship.id = new oskn.AppObjectId().setup(oskn.AppObjectIdType.SHIP, 1);
		this.enemy = new oskn.EnemyService().setup(this.appCore);
		this.ownBullet = new oskn.OwnBulletService().setup(this.appCore);
		this.explosion = new oskn.ExplosionService().setup(this.appCore);

		this.deadRect = this.appCore.pool.rect.alloc();
		this.deadRect.x = 0;
		this.deadRect.width = this.appCore.setting.screenSize.x;
		this.deadRect.y = this.ship.rect().y;
		this.deadRect.height = this.ship.rect().height;

		var xCount = 10;
		var yCount = 5;
		var left = 32;
		var top = 32;
		for (var yi = 0; yi < yCount; ++yi) {
			for (var xi = 0; xi < xCount; ++xi) {
				var item = this.appCore.pool.enemy.alloc().setup(this.appCore);
				item.position.x = left + xi * 16;
				item.position.y = top + yi * 16;
				this.enemy.table.add(item);
			}
		}
	};

	cls.prototype.exit = function () {
		this.ship.free();
		this.enemy.free();
		this.ownBullet.free();
		this.explosion.free();
	};

	cls.prototype.update = function () {
		this.sm.update();
		this.freeFreeTargets();
	};

	cls.prototype.freeFreeTargets = function() {
		if (0 < this.freeTargets.length) {
			for (var i = 0; i < this.freeTargets.length; ++i) {
				this.freeTargets[i].free();
			}
			this.freeTargets.splice(0, this.freeTargets.length);
		}
	};

	cls.prototype.createStates = function () {
		var sm = new oskn.StateMachine("Ingame");
		sm.addState(new oskn.StateBehaviour(StateId.S1, this,
			function (self) {
				self.sm.switchState(StateId.S2);
		}));

		sm.addState(new oskn.StateBehaviour(StateId.S2, this,
			function (self) {
		}, function (self) {
		}, function (self) {
			self.ship.update();
			self.enemy.table.forEach(function (_item) {
				_item.update();
			});
			self.ownBullet.table.forEach(function (_item) {
				_item.update();
			});
			self.explosion.table.forEach(function (_item) {
				_item.update();
			});

			self.ownBullet.table.forEach(function (_bullet) {
				var hit = this.enemy.table.values.find(function (_enemy) {
					return Collision.testRectRect(this.rect(), _enemy.rect());
				}, _bullet);
				if (hit !== null) {
					hit.onHit(_bullet);
					_bullet.isDead(true);
				}
			}, self);

			var hit = self.enemy.table.values.find(function (_enemy) {
				return Collision.testRectRect(this.deadRect, _enemy.rect());
			}, self);
			if (hit !== null) {
				// 死亡.
				self.ship.free();
				self.sm.switchState(StateId.GAME_OVER);
			}
		}));

		sm.addState(new oskn.StateBehaviour(StateId.S3, this,
			function (self) {
		}));

		sm.addState(new oskn.StateBehaviour(StateId.GAME_OVER, this,
			function (self) {
		}));

		return sm;
	};

	var StateId = oskn.createEnum('StateId', {
		S1: 1,
		S2: 2,
		S3: 3,
		GAME_OVER: 4,
	});
});

