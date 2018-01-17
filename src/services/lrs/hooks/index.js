// TODO: check rights
const feedbackTokenIsValid = hook => {
	return new Promise((resolve, reject) => {
		const feedback = this.app.service("feedback");
		const feedback_key = data.feedback_key;

		feedback.get(feedback_key)
			.then(user => {
				const xapi = data.xapi;

				// TODO: check
			});
	});
};

exports.before = {
	all: [],
	find: [],
	get: [],
	create: [],
	update: [],
	patch: [],
	remove: []
};

exports.after = {
	all: [],
	find: [],
	get: [],
	create: [],
	update: [],
	patch: [],
	remove: []
};
