'use strict';

const globalHooks = require('../../../hooks');
const hooks = require('feathers-hooks');
const auth = require('feathers-authentication');

const addToSubmission = hook => {
    const submissionService = hook.app.service('/submissions');

    submissionService.patch(hook.result.submissionId, {$push: {comments: hook.result._id}});
};

const removeFromSubmission = hook => {
    const commentService = hook.app.service('/comments');
    const submissionService = hook.app.service('/submissions');
    return commentService.get(hook.id).then((comment) => {
        console.log(comment.submissionId,hook.id);
        submissionService.patch(comment.submissionId, {$pull : {comments: hook.id}});
    });
};

exports.before = {
  all: [auth.hooks.authenticate('jwt')],
  find: [globalHooks.mapPaginationQuery.bind(this)],
  get: [],
  create: [],
  update: [],
  patch: [],
  remove: [removeFromSubmission]
};

exports.after = {
  all: [],
  find: [],
  get: [],
  create: [addToSubmission],
  update: [],
  patch: [],
  remove: []
};
