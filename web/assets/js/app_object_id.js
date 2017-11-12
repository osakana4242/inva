
oskn.namespace('oskn', function () {
	oskn.AppObjectIdType = {
		NONE: 0,
		SHIP: 1,
		ENEMY: 2,
		ENEMY_BULLET: 3,
		OWN_BULLET: 4,
		EXPLOSION: 5,
		RESULT_TELOP: 6,
	};
});

oskn.namespace('oskn', function () {

	oskn.AppObjectId = function () {
		this.value = 0;
	};
	var cls = oskn.AppObjectId;

	cls.SHIFT = 8;

	cls.prototype.valueOf = function () {
		return this.value;
	};

	cls.prototype.toString = function () {
		return this.valueOf().toString();
	};

	cls.prototype.setup = function (type, id) {
		this.value = (type << cls.SHIFT) | id;
		return this;
	};

	cls.prototype.type = function () {
		return (this.value >> cls.SHIFT);
	};

	cls.prototype.equals = function (other) {
		return this.value === other.value;
	};

	cls.prototype.isEmpty = function() {
		return this.value === 0;
	};

	cls.getEmpty = function() {
		return cls.getOrCreate(oskn.AppObjectId.NONE, 0);
	};

	cls.getOrCreate = function(type, id) {
		var inst = new cls();
		inst.setup(type, id);
		return inst;
	};
});


