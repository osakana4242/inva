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
		this.subject = null;
		this.observer = null;
	};

	var cls = oskn.SubjectUnsubscriber;

	cls.prototype.setup = function (subject, observer) {
		this.subject = subject;
		this.observer = observer;
	};

	cls.prototype.free = function () {
		this.subject = null;
	};

	cls.prototype.dispose = function () {
		var index = this.subject.observers.findIndex(function (item) {
			return item === observer;
		}, this.observer);
		this.subject.observers.splice(index, 1);
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
		return new oskn.SubjectUnsubscriber(this, observer);
	};

});

