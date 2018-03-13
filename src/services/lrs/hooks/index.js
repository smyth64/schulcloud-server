const auth = require('feathers-authentication');
const globalHooks = require('../../../hooks');

const isProvider = hook => {
	let toolService = hook.app.service('ltiTools');
	return toolService.find({
		query: {
			user: hook.params.account.userId
		}
	}).then(tools => {
		const toolId = tools.data[0]._id;
		const pseudoService = hook.app.service('pseudonym');
		return Promise.all(
			hook.data.map(statement => pseudoService.find({
				query: {
					token: statement.actor.account.name,
					toolId: toolId
				}
			}).then(pseudonym => {
				if (!pseudonym.data) {
					throw new errors.Forbidden('you do not have rights for this user');
				}
				statement.actor.account.name = pseudonym.data[0].userId;
				return statement;
			}))
		).then(statements => {
			hook.data = statements;
			return hook;
		});
	})
}

exports.before = {
	all: [auth.hooks.authenticate('jwt')],
	find: [],
	get: [],
	create: [globalHooks.hasPermission('LRS_CREATE'), isProvider],
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
