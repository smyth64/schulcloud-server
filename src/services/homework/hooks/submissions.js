'use strict';

const globalHooks = require('../../../hooks');
const hooks = require('feathers-hooks');
const auth = require('feathers-authentication');

const filterApplicableSubmissions = hook => {
	let uId = hook.params.account.userId;
	let data = hook.result.data;
	data = data.filter(function(c){
		return c.homeworkId.publicSubmissions
				|| JSON.stringify(c.homeworkId.teacherId) == JSON.stringify(hook.params.account.userId)
				|| JSON.stringify(c.studentId) == JSON.stringify(hook.params.account.userId);
	});

	if (hook.result.data)
		hook.result.data = data;
	else
		hook.result = data;

	return Promise.resolve(hook);
};

exports.before = {
  all: [auth.hooks.authenticate('jwt')],
  find: [globalHooks.mapPaginationQuery.bind(this)],
  get: [],
  create: [],
  update: [],
  patch: [],
  remove: []
};

exports.after = {
  all: [],
  find: [filterApplicableSubmissions],
  get: [],
  create: [],
  update: [],
  patch: [],
  remove: []
};
