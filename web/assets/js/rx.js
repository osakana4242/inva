
phina.define("Observer", {
	init: function () {
	},
	setup: function (target, func) {
		this.target = target;
		this.func = func;
		return this;
	},
	onNext: function () {
		this.func.call(this.target, this.target);
	},
});

phina.define("SubjectUnsubscriber", {
	init: function () {
		this.subject = null;
		this.observer = null;
	},
	setup: function (subject, observer) {
		this.subject = subject;
		this.observer = observer;
	},
	free: function () {
		this.subject = null;
	},
	dispose: function () {
		var index = this.subject.observers.findIndex(function (item) {
			return item === observer;
		}, this.observer);
		this.subject.observers.splice(index, 1);
	},
});

phina.define("Subject", {
	init: function () {
		this.observers = [];
		this.workObservers = [];
	},
	setup: function () {
	},
	onNext: function () {
		this.workObservers.splice(0, this.workObservers.length);
		this.workObservers.push.apply(this.workObservers, this.observers);
		this.workObservers.forEach(function (item) {
			item.onNext();
		});
	},
	subscribe: function(observer) {
		this.observers.push(observer);
		return SubjectUnsubscriber(this, observer);
	},
});

