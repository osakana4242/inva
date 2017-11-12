
oskn.namespace('oskn', function () {
	oskn.OwnBulletService = function(app) {
		this.app = app;
		this.table = new oskn.OneIdTable(app);
	};
	var cls = oskn.OwnBulletService;

	cls.prototype.setup = function() {
		this.table.setup(oskn.AppObjectIdType.OWN_BULLET);
		return this;
	};

	cls.prototype.free = function () {
		this.table.free();
	};

	return cls;
});

