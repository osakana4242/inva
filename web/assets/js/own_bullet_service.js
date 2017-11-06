oskn.namespace('oskn', function () {
	this.OwnBulletService = function () {
		this.table = new oskn.OneIdTable();
	};
	var cls = this.OwnBulletService;

	cls.prototype.setup = function (appCore) {
		this.appCore = appCore;
		this.table.setup(this.appCore, oskn.AppObjectIdType.OWN_BULLET);
		return this;
	};

	cls.prototype.free = function () {
		this.table.free();
	};

	return cls;
});

