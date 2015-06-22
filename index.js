var moment = require('moment');

var cacheHeaders = {
	generate: function(n, scale, privateCache) {
		var cacheControl = (privateCache === true) ? 'private' : 'public';

		if(n === null || n === false) {
			return {
				'Expires': null,
				'Cache-Control': cacheControl + ', no-cache'
			};
		}

		if(typeof scale === 'undefined') {
			scale = 'minutes';
		}

		var duration = moment.duration(n, scale);

		if(duration.asMilliseconds() === 0 && n !== 0) {
			throw new Error('unknown duration: ' + duration);
		}

		return {
			'Expires': moment().add(duration).toDate(),
			'Cache-Control': cacheControl + ', max-age=' + Math.round(duration.asSeconds())
		};
	},

	set: function(n, scale, privateCache, path) {
		return function(req, res, next) {
			if(typeof path !== 'undefined' && req.path !== path) {
				return next();
			}

			try {
				res.set(cacheHeaders.generate(n, scale, privateCache));
				next();
			} catch(e) {
				next(e);
			}
		};
	},

	neverCache: function(privateCache, path) {
		return cacheHeaders.set(null, null, privateCache, path);
	}
};

module.exports = cacheHeaders;
