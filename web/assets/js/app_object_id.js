
oskn.namespace('oskn', function () {
	this.AppObjectIdType = {
		SHIP: 1,
		ENEMY: 2,
		ENEMY_BULLET: 3,
		OWN_BULLET: 4,
		EXPLOSION: 5,
	};
});

oskn.namespace('oskn', function () {

	this.AppObjectId = function () {
		this.value = 0;
	};
	var cls = this.AppObjectId;

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

});


