phina.globalize();

(function(global) {
	var oskn = global.oskn = global.oskn || {};

	oskn.namespace = function(ns_string, func) {
		var parts = ns_string.split('.'),
		parent = oskn;
		
		if (parts[0] === "oskn") {
			parts = parts.slice(1);
		}
		
		for (var i = 0; i < parts.length; i += 1) {
			if (typeof parent[parts[i]] === "undefined") {
				parent[parts[i]] = {};
			}
			parent = parent[parts[i]];
		}
		if (func) {
			func.call(parent);
		}
		return parent;
	}

	oskn.inherits = function(childCtor, parentCtor) {
		Object.setPrototypeOf(childCtor.prototype, parentCtor.prototype);
	};

}(this));

oskn.namespace('oskn', function () {
	this.ASSETS = {
		image: {},
	};

	(function () {
		var images = [
			'./assets/img/enemy_01_01.png',
			'./assets/img/enemy_01_02.png',
			'./assets/img/ship.png',
			'./assets/img/own_bullet_01.png',
			'./assets/img/explosion_01_01.png',
		];
		images.forEach(function (path) {
			var reg = /.+\/(.+?)([\?#;].*)?$/;
			var match = path.match(reg);
			var key = match[1];
			oskn.ASSETS.image[key] = path;
		});
	})();

});

oskn.namespace('oskn', function () {
	this.createEnum = function (name, data) {
		var ret = {};

		cls = function (name, value) {
			this.name = name;
			this.value = value;
		};

		cls.prototype.valueOf = function () {
			return this.value;
		};

		cls.prototype.toString = function () {
			return this.name;
		};

		cls.prototype.equals = function (other) {
			return this === other;
		};

		for (var key in data) {
			ret[key] = new cls(key, data[key]);
		}

		return ret;
	};
});

// MainScene クラスを定義
phina.define('MainScene', {
	superClass: 'DisplayScene',
	init: function() {
		this.superInit.apply(this, arguments);
		this.appCore = new oskn.AppCore();
		var v1 = this.appCore.pool.vector2.alloc();
		v1.free();
		v1 = this.appCore.pool.vector2.alloc();

		// 背景色を指定
		this.backgroundColor = '#444';

		this.displayables = {};
		this.workDisplayables = {};
	},
	update: function() {
		this.appCore.update(this.app);

		for (var key in this.workDisplayables) {
			delete this.workDisplayables[key];
		}
		for (var key in this.displayables) {
			this.workDisplayables[key] = key;
		}

		var scene = this.appCore.sm.currentState;
		switch (scene.id) {
			case oskn.AppStateId.INGAME:
				this.updateIngame(scene);
				break;
			case oskn.AppStateId.TITLE:
				this.updateTitle(scene);
				break;
		}

		for (var key in this.workDisplayables) {
			var disp = this.displayables[key];
			disp.remove();
			delete this.displayables[key];
		}
	},

	updateTitle: function(scene) {
		{
			var id = oskn.AppObjectId.getOrCreate(oskn.AppObjectIdType.RESULT_TELOP, 3);
			var disp = this.displayables[id];
			if (!disp) {
				disp = Label({
					text: 'INVADER',
					fontSize: 16,
					fill: 'white',
				}).addChildTo(this);
				this.displayables[id] = disp;
			} else {
				delete this.workDisplayables[id];
			}
			disp.x = this.gridX.center();
			disp.y = this.gridY.width * 4 / 16;
		}
		{
			var id = oskn.AppObjectId.getOrCreate(oskn.AppObjectIdType.RESULT_TELOP, 4);
			var disp = this.displayables[id];
			if (!disp) {
				disp = Label({
					text: '@osakana4242',
					fontSize: 12,
					fill: 'white',
				}).addChildTo(this);
				this.displayables[id] = disp;
			} else {
				delete this.workDisplayables[id];
			}
			disp.x = this.gridX.center();
			disp.y = this.gridY.width * 12 / 16;
		}
	},

	updateIngame: function(scene) {
		{
			var item = scene.ship;
			var disp = this.displayables[item.id];
			if (!disp) {
				disp = Sprite('ship.png').addChildTo(this);
				this.displayables[item.id] = disp;
			} else {
				delete this.workDisplayables[item.id];
			}
			disp.x = item.position.x;
			disp.y = item.position.y;
		}

		scene.enemy.table.forEach(function (item) {
			var disp = this.displayables[item.id];
			if (!disp) {
				disp = Sprite('enemy_01_01.png').addChildTo(this);
				this.displayables[item.id] = disp;
			} else {
				delete this.workDisplayables[item.id];
			}
			var nextImageId = 'enemy_01_01.png';
			switch (item.styleId()) {
				case oskn.EnemyStyleId.WAIT:
					nextImageId = 'enemy_01_01.png';
					break;
				case oskn.EnemyStyleId.MOVE:
					nextImageId = 'enemy_01_02.png';
					break;
			}
			var nextImage = phina.asset.AssetManager.get('image', nextImageId);
			if (disp.image !== nextImage) {
				disp.image = nextImage;
			}

			disp.x = item.position.x;
			disp.y = item.position.y;
		}, this);

		scene.ownBullet.table.forEach(function (item) {
			var disp = this.displayables[item.id];
			if (!disp) {
				disp = Sprite('own_bullet_01.png').addChildTo(this);
				this.displayables[item.id] = disp;
			} else {
				delete this.workDisplayables[item.id];
			}
			disp.x = item.position.x;
			disp.y = item.position.y;
		}, this);

		scene.explosion.table.forEach(function (item) {
			var disp = this.displayables[item.id];
			if (!disp) {
				disp = Sprite('explosion_01_01.png').addChildTo(this);
				this.displayables[item.id] = disp;
			} else {
				delete this.workDisplayables[item.id];
			}
			var nextImageId = 'explosion_01_01.png';
			var index = oskn.AppMath.progressToIndex(item.getProgress(), 8);
			switch (index) {
				case 0:
					nextImageId = 'explosion_01_01.png';
					break;
				case 1:
					nextImageId = 'own_bullet_01.png';
					break;
				default:
					nextImageId = '';
					break;
			}
			if (disp.image !== nextImage && nextImageId !== '') {
				var nextImage = phina.asset.AssetManager.get('image', nextImageId);
				disp.image = nextImage;
			}
			disp.visible = nextImageId !== '';
			disp.x = item.position.x;
			disp.y = item.position.y;
		}, this);

		if (scene.sm.currentState.id === oskn.IngameStateId.GAME_CLEAR) {
			var id = oskn.AppObjectId.getOrCreate(oskn.AppObjectIdType.RESULT_TELOP, 1);
			var disp = this.displayables[id];
			if (!disp) {
				disp = Label({
					text: 'GAME CLEAR',
					fontSize: 16,
					fill: 'white',
				}).addChildTo(this);
				this.displayables[id] = disp;
			} else {
				delete this.workDisplayables[id];
			}
			disp.x = this.gridX.center();
			disp.y = this.gridY.center();
		}

		if (scene.sm.currentState.id === oskn.IngameStateId.GAME_OVER) {
			var id = oskn.AppObjectId.getOrCreate(oskn.AppObjectIdType.RESULT_TELOP, 2);
			var disp = this.displayables[id];
			if (!disp) {
				disp = Label({
					text: 'GAME OVER',
					fontSize: 16,
					fill: 'white',
				}).addChildTo(this);
				this.displayables[id] = disp;
			} else {
				delete this.workDisplayables[id];
			}
			disp.x = this.gridX.center();
			disp.y = this.gridY.center();
		}
	},
});

// メイン処理
phina.main(function() {
	// アプリケーション生成
	var app = GameApp({
		fps: 60,
		startLabel: 'main', // メインシーンから開始する
		width: 240,
		height: 320,
		assets: oskn.ASSETS,
//		pixelated: true,
//		fit: true,
	});
	// アプリケーション実行
	app.run();
});

Vector2.prototype.copyFrom = function (other) {
	this.x = other.x;
	this.y = other.y;
};


