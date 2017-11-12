
oskn.namespace('oskn', function () {
		oskn.setting = {
			time: {
				fps: 60,
				fastScale: 64,
				slowScale: 1 / 8,
			},
			screenSize: {
				x: 240,
				y: 320,
			},
			key: {
				playSpeedSlow: 'comma',
				playSpeedFast: 'period',
				gameClear: 'c',
			},
			ship: {
				size: {
					x: 8,
					y: 8,
				},
				xMin: 16,
				xMax: 240 - 16,
				baseY: 240 - 8,
			},
			enemy: {
				size: {
					x: 8,
					y: 8,
				},
				sideMoveDistance: 4,
				downMoveDistance: 8,
				xMin: 16,
				xMax: 240 - 16,
			},
			ownBullet: {
				speed: 4,
				size: {
					x: 2,
					y: 4,
				},
			},
		};
});

