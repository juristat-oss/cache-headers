var moment = require('moment');

var cacheHeaders = {
	generate: function(n, scale) {
		if(typeof scale === 'undefined') {
			scale = 'minutes';
		}

		var duration = moment.duration(n, scale);

		if(duration.asMilliseconds() === 0 && n !== 0) {
			throw new Error('unknown duration: ' + duration);
		}

		return {
			'Expires': moment().add(duration).toDate(),
			'Cache-Control': 'private, max-age=' + Math.round(duration.asSeconds())
		};
	},

	set: function(n, scale) {
		return function(req, res, next) {
			try {
				res.set(cacheHeaders.generate(n, scale));
				next();
			} catch(e) {
				next(e);
			}
		};
	}
};

module.exports = cacheHeaders;
