
oskn.namespace('oskn', function () {
	oskn.Title = function(stateId, app) {
		super_.call(this, stateId);
		this.app = app;
		this.sm = this.createStates();
	};

	var cls = oskn.Title;
	var super_ = oskn.StateBehaviour;
	oskn.inherits(cls, super_);

	cls.prototype.enter = function () {
		this.sm.switchState(StateId.S1);
	};

	cls.prototype.exit = function () {
	};

	cls.prototype.update = function () {
		this.sm.update();
	};

	cls.prototype.createStates = function () {
		var sm = new oskn.StateMachine(this.app, "Title");
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
		function(self) {
		}, function(self) {
		}, function(self) {
			if (0.5 <= self.sm.stateTime) {
				if (self.app.pointer.button.up) {
					self.app.sm.switchState(oskn.AppStateId.INGAME);
				}
			}
		}));

		return sm;
	};

	oskn.TitleStateId = oskn.createEnum('StateId', {
		S1: 1,
		S2: 2,
	});

	var StateId = oskn.TitleStateId;
});

