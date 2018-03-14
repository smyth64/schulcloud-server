const auth = require('feathers-authentication');
const globalHooks = require('../../../hooks');
const hooks = require('feathers-hooks');

/*
 if user is a provider, check rights for users identified by token
 */
const handleProvider = hook => {
	// check if user is provider
	const userService = hook.app.service('/users');
	return userService.get(hook.params.account.userId, {
		query: {
			$populate: ['roles']
		}
	}).then(user => {
		if (!user.roles.find(role => role.name === 'provider')) return hook; // no permission check for non-providers!
		hook.params.account.isProvider = true;

		let toolsService = hook.app.service('ltiTools');
		return toolsService.find({
			query: {
				user: hook.params.account.userId
			}
		}).then(tools => {
			const toolIds = tools.data.map(tool => tool._id); // ids of all tools of the provider
			const pseudoService = hook.app.service('pseudonym');
			return Promise.all(
				hook.data.map(statement => pseudoService.find({
					query: {
						token: statement.actor.account.name,
						toolId: toolIds
					}
				}).then(pseudonyms => {
					if (!pseudonyms.data.length) {
						return false;
					}
					statement.actor.account.name = pseudonyms.data[0].userId;
					return statement;
				}))
			).then(statements => {
				if (statements.includes(false)) throw new Error('no permissions for a user');
				hook.data = statements;
				return hook;
			});
		})
	});
}

exports.before = {
	all: [auth.hooks.authenticate('jwt')],
	find: [globalHooks.hasPermission('LRS_VIEW')],
	get: [hooks.disable()],
	create: [globalHooks.hasPermission('LRS_CREATE'), handleProvider],
	update: [hooks.disable()],
	patch: [hooks.disable()],
	remove: [hooks.disable()]
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
