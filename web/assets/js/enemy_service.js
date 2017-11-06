
oskn.namespace('oskn', function () {
	this.EnemyService = function () {
		this.table = new oskn.OneIdTable();
	};
	var cls = this.EnemyService;

	cls.prototype.setup = function (appCore) {
		this.appCore = appCore;
		this.table.setup(this.appCore, oskn.AppObjectIdType.ENEMY);
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

