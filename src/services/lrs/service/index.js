const rp = require("request-promise-native");

class LearningLockerStore {
	constructor(opts) {
		this.options = opts;
		this.app	 = null;
	}

	get(params) {
		//TODO
	}

	create(data, params) {
		// TODO: POST /statements to learning locker
		const baseUrl = 'http://fb10-bp2017cm2.hpi.uni-potsdam.de/data/xAPI/';
		const authorization = 'MTk5YmMxMTU1NDgxMGZlNTg0YmNkYTQyN2JjNDkwYjVmOTIzNzk2Nzo2Mzc0MGJmZmYzMzRkNmU3MDE3OTE2ZTQ3YTBlMTNmZWU1MjI4OTlj';

		const options = {
			method: 'POST',
			uri: baseUrl + 'statements',
			headers: {
				'Authorization': authorization,
				'X-Experience-API-Version': '1.0.3'
			},
			body: data,
			json: true
		};
		return rq(options).then(result => {
			return result
		}).catch(err => {
			return "Error"
		});

	}

	setup(app, path) {
		this.app = app;
	}
}

function service(opts) {
	return new LearningLockerStore(opts);
}

module.exports = service;
