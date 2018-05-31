'use strict';

const service = require('feathers-mongoose');
const worksheetModel = require('./model');
const hooks = require('./hooks');

module.exports = function() {
  const app = this;

	const options = {
    Model: worksheetModel,
    paginate: {
      default: 100,
      max: 100
    },
		lean: true
  };

  // Initialize our service with any options it requires
  app.use('/worksheet', service(options));

  // Get our initialize service to that we can bind hooks
  const worksheetService = app.service('/worksheet');

  // Set up our before hooks
	worksheetService.before(hooks.before);

  // Set up our after hooks
	worksheetService.after(hooks.after);
};
