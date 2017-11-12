oskn.namespace('oskn', function() {

	oskn.StateMachine = function (name) {
		this.name = name || "noname";
		this.states = {};
		this.currentState = new oskn.StateBehaviour(0);
		this.beforeState = this.currentState;
		this.nextState = null;
		this.frameCount = 0;
		this.verbose = false;
	};

	var cls = oskn.StateMachine;

	cls.prototype.update = function() {
		this.refleshState();
		this.currentState.update();
		++this.frameCount;
	};

	cls.prototype.addState = function(state) {
		this.states[state.id] = state;
	};

	cls.prototype.switchState = function(stateId) {
		if (this.nextState !== null) {
			throw "二重呼び出しを検出";
		}
		this.nextState = this.states[stateId];
	};

	cls.prototype.refleshState = function() {
		if (!this.nextState) return;
		while (this.nextState !== null) {
			this.beforeState = this.currentState;
			this.beforeState.exit();
			this.currentState = this.nextState;
			if (this.verbose) {
				console.log( this.name + " stateChange, fc: " + this.frameCount + ", state: [" + this.beforeState.id.name + ", " + this.currentState.id.name + "]" );
			}
			this.frameCount = 0;
			this.nextState = null;
			this.currentState.enter();
		}
	};

});

oskn.namespace('oskn', function() {

	this.StateBehaviour = function(stateId, owner, enter, exit, update) {
		this.id = stateId;
		this.owner = owner;
		this.innerEnter = enter || function(self) {};
		this.innerExit = exit || function(self) {};
		this.innerUpdate = update || function(self) {};
	};

	var cls = this.StateBehaviour;

	cls.prototype.enter = function() {
		this.innerEnter.call(this.owner, this.owner);
	};

	cls.prototype.exit = function() {
		this.innerExit.call(this.owner, this.owner);
	};

	cls.prototype.update = function() {
		this.innerUpdate.call(this.owner, this.owner);
	};

});

