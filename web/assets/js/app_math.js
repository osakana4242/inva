
oskn.namespace('oskn', function () {

	this.AppMath = {};
	var cls = this.AppMath;

	cls.lerp = function(a, b, t) {
		return a + ( b - a ) * t;
	};

	cls.lerpIn = function(a, b, t) {
		return a + ( b - a ) * t * t;
	};

	cls.lerpOut = function(a, b, t) {
		var c = 1 - t;
		return a + ( b - a ) * (1 - (c * c));
	};

	cls.clamp = function(v, min, max) {
		if ( v < min ) return min;
		if ( max < v ) return max;
		return v;
	};

	cls.rate = function(v, min, max) {
		var v1 = cls.clamp(v, min, max);
		return (v1 - min) / (max - min);
	};

	cls.progress01 = function(t, duration) {
		if ( duration === 0 ) return 1;
		return oskn.AppMath.clamp(t / duration, 0, 1);
	};

	cls.isProgressCompleted = function(t) {
		return 1 <= t;
	};

});

