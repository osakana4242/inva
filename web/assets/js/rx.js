oskn.namespace('oskn', function () {

	oskn.CompositDisposable = function() {
		this.items = [];
	};

	var cls = oskn.CompositDisposable;

	cls.prototype.setup = function() {
		return this;
	};

	cls.prototype.add = function(item) {
		this.items.push(item);
	};

	cls.prototype.clear = function() {
		for (var i = this.items.length - 1; 0 <= i; --i) {
			var item = this.items[i];
			item.dispose();
		}
		this.items.splice(0, this.items.length);
	};

});

oskn.namespace('oskn', function () {

	oskn.Observer = function () {
	};

	var cls = oskn.Observer;

	cls.prototype.setup = function (target, func) {
		this.target = target;
		this.func = func;
		return this;
	};

	cls.prototype.onNext = function () {
		this.func.call(this.target, this.target);
	};

});

oskn.namespace('oskn', function () {
	oskn.SubjectUnsubscriber = function() {
		this.subject_ = null;
		this.observer_ = null;
	};

	var cls = oskn.SubjectUnsubscriber;

	cls.prototype.setup = function(subject, observer) {
		this.subject_ = subject;
		this.observer_ = observer;
		return this;
	};

	cls.prototype.free = function () {
		this.subject_ = null;
	};

	cls.prototype.dispose = function() {
		var index = this.subject_.observers.findIndex(function (item) {
			return item === this;
		}, this.observer_);
		this.subject_.observers.splice(index, 1);
	};

});

oskn.namespace('oskn', function () {
	oskn.Subject = function() {
		this.observers = [];
		this.workObservers = [];
	};

	var cls = oskn.Subject;

	cls.prototype.setup = function () {
	};

	cls.prototype.onNext = function () {
		this.workObservers.splice(0, this.workObservers.length);
		this.workObservers.push.apply(this.workObservers, this.observers);
		this.workObservers.forEach(function (item) {
			item.onNext();
		});
	};

	cls.prototype.subscribe = function(observer) {
		this.observers.push(observer);
		return new oskn.SubjectUnsubscriber().setup(this, observer);
	};

});

