oskn.namespace('oskn', function () {

	oskn.InstancePool = function(factory) {
		this.factory = factory;
		this.items = [];
	};

	var cls = oskn.InstancePool;

	cls.prototype.alloc = function() {
		if (this.items.length <= 0) {
			var item = this.factory();
			var self = this;
			item.free = function () {
				if (item.__proto__.free) {
					item.__proto__.free.call(item);
				}
				self.free(item);
			};
			item.poolInstanceId = 1;
			return item;
		} else {
			var item = this.items.pop();
			return item;
		}
	};

	cls.prototype.free = function(item) {
		item.poolInstanceId = (item.poolInstanceId + 1) & 0x7fffffff;
		this.items.push(item);
	};

});

oskn.namespace('oskn', function () {
	this.WeakRef = function() {
	};

	var cls = this.WeakRef;

	cls.prototype.setup = function(value) {
		this.value_ = value;
		this.poolInstanceId_ = this.value_.poolInstanceId;
		return this;
	};

	cls.prototype.hasValue = function() {
		if (!this.value_)
			return false;
		if (this.value_.poolInstanceId !== this.poolInstanceId_)
			return false;
		return true;
	};

	cls.prototype.target = function() {
		if (this.hasValue())
			return this.value_;
		return null;
	};

});

