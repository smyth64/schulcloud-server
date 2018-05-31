'use strict';

// model.js - A mongoose model
// https://www.edu-apps.org/code.html - LTI Parameters
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const worksheetSchema = new Schema({
  title: { type: String, required: true },
  content: { type: Object, required: true }
}, {
	timestamps: true
});

const worksheetModel = mongoose.model('worksheets', worksheetSchema);

module.exports = worksheetModel;
