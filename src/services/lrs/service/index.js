const rp = require("request-promise-native");

class LearningLockerStore {
	constructor(opts) {
		this.options = opts;
		this.app	 = null;
	}

	get(params) {
		// TODO
		return Promise.resolve([]);
	}

	create(data, params) {
		// TODO: outsource endpoint configuration
		const baseUrl = 'https://bp.schul-cloud.org/data/xAPI/';
		const authorization = 'MzJhODhlM2E0YjdkZDE3OThhMjE1YjI3MDE0N2NmNjRkM2IwZGI2YjowNzA0NWUzZTM5OTE0M2M0OTYzOTNkNDRlNzdiODFkY2ViODdlNjEw';

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

		return rp(options).then(result => {
			return Promise.resolve(result);
		}).catch(err => {
			return Promise.resolve(err);
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
