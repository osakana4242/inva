
oskn.namespace('oskn', function () {
	this.Ingame = function(stateId, app) {
		super_.call(this, stateId);
		this.app = app;
		this.sm = this.createStates();
		this.freeTargets = [];
		this.resultType = ResultType.NONE;
	};

	var cls = this.Ingame;
	var super_ = oskn.StateBehaviour;
	oskn.inherits(cls, super_);

	cls.prototype.enter = function () {
		this.ship = new oskn.Ship(this.app).setup();
		this.ship.id = new oskn.AppObjectId().setup(oskn.AppObjectIdType.SHIP, 1);
		this.enemy = new oskn.EnemyService(this.app).setup();
		this.ownBullet = new oskn.OwnBulletService(this.app).setup();
		this.explosion = new oskn.ExplosionService(this.app).setup();

		this.deadRect = this.app.pool.rect.alloc();
		this.deadRect.x = 0;
		this.deadRect.width = this.app.setting.screenSize.x;
		this.deadRect.y = this.ship.rect().y;
		this.deadRect.height = this.ship.rect().height;

		var xCount = 10;
		var yCount = 5;
		var left = 32;
		var top = 32;
		for (var yi = 0; yi < yCount; ++yi) {
			for (var xi = 0; xi < xCount; ++xi) {
				var item = this.app.pool.enemy.alloc().setup(this.app);
				item.position.x = left + xi * 16;
				item.position.y = top + yi * 16;
				this.enemy.table.add(item);
			}
		}

		this.resultType = ResultType.NONE;

		this.sm.switchState(StateId.S1);
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
		var sm = new oskn.StateMachine(this.app, "Ingame");
		sm.addState(new oskn.StateBehaviour(StateId.S1, this,
			function (self) {
			},
			function (self) {
			},
			function (self) {
				if (0.5 <= self.sm.stateTime) {
					self.sm.switchState(StateId.S2);
				}
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
				// 鄂ｩ遘∵ｭ､.
				self.ship.isDead();
				self.resultType = ResultType.NG;
			}
			var isGameClear = self.enemy.table.values.length <= 0;
			isGameClear |= self.app.keyboard.getKey(self.app.setting.key.gameClear);
			if (isGameClear) {
				self.resultType = ResultType.OK;
			}
			switch (self.resultType) {
			case ResultType.OK:
				self.sm.switchState(StateId.GAME_CLEAR);
				break;
			case ResultType.NG:
				self.sm.switchState(StateId.GAME_OVER);
				break;
			}
		}));

		sm.addState(new oskn.StateBehaviour(StateId.GAME_CLEAR, this,
		function(self) {
		}, function(self) {
		}, function(self) {
			if (0.5 <= self.sm.stateTime) {
				if (self.app.pointer.button.up) {
					self.app.sm.switchState(oskn.AppStateId.TITLE);
				}
			}
		}));

		sm.addState(new oskn.StateBehaviour(StateId.GAME_OVER, this,
		function(self) {
		}, function(self) {
		}, function(self) {
			if (0.5 <= self.sm.stateTime) {
				if (self.app.pointer.button.up) {
					self.app.sm.switchState(oskn.AppStateId.TITLE);
				}
			}
		}));

		return sm;
	};

	var ResultType = oskn.createEnum('ResultType', {
		NONE: 0,
		OK: 1,
		NG: 2,
	});

	oskn.IngameStateId = oskn.createEnum('StateId', {
		S1: 1,
		S2: 2,
		GAME_CLEAR: 3,
		GAME_OVER: 4,
		END: 5,
	});

	var StateId = oskn.IngameStateId;
});

