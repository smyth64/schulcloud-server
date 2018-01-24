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
		// TODO: POST /statements to learning locker
		const baseUrl = 'http://172.20.8.5/data/xAPI/';
		const authorization = 'OTJhMDMxYzc4ZDkzMjFmYmEyNDM4Y2QwMjU5NzgzYTU5MDQ0MjU2NzoxZjZhOWNmNTQyNWZjMGQzYjg1YTZjYmZmY2M1OTM1Nzk2Mzg5N2Nl';

		const options = {
			method: 'POST',
			uri: baseUrl + 'statements',
			headers: {
				'Authorization': authorization,
				'X-Experience-API-Version': '1.0.3'
			},
			body: [
				{
					"actor": { "mbox": "mailto:test2@example.org" },
					"verb": { "id": "http://www.example.org/verb" },
					"object": { "id": "http://www.example.org/activity"}
				},
				{
					"actor": { "mbox": "mailto:test2@example.org"},
					"verb": {"id": "http://adlnet.gov/expapi/verbs/completed"},
					"object": {"objectType": "Activity", "id": "http://www.example.com/activities/1"}
				}
			],
			json: true
		};
		console.log(options);
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
