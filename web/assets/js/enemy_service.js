
oskn.namespace('oskn', function () {
	oskn.EnemyService = function (app) {
		this.app = app;
		this.table = new oskn.OneIdTable(app);
	};
	var cls = oskn.EnemyService;

	cls.prototype.setup = function() {
		this.table.setup(oskn.AppObjectIdType.ENEMY);
		this.info = {
			dirX: 1,
			dirChangeFrameCount: -1,
		};
		return this;
	};

	cls.prototype.free = function () {
		this.table.free();
	};

	return cls;
});

