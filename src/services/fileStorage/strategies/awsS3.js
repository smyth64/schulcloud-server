const promisify = require('es6-promisify');
const errors = require('feathers-errors');
const SchoolModel = require('../../school/model');
const UserModel = require('../../user/model');
const CourseModel = require('../../user-group/model').courseModel;
const ClassModel = require('../../user-group/model').classModel;
const aws = require('aws-sdk');
let awsConfig;
try {
	awsConfig = require("../../../../config/secrets.json").aws;
} catch (e) {
	awsConfig = {};
}

const AbstractFileStorageStrategy = require('./interface.js');

// verifies whether the given userId has permission for the given context (course, user, class)
const verifyStorageContext = (userId, storageContext) => {
	var values = storageContext.split("/");
	if (values.length != 2) return Promise.reject(new errors.BadRequest("StorageContext is invalid"));
	var context = values[0];
	switch(context) {
		case 'users':
			return UserModel.findById(values[1]).exec().then(res => {
				if (!res || res._id != userId.toString()) {
					return Promise.reject(new errors.Forbidden("You don't have permissions!"));
				}
				return res;
			});
		case 'courses':
			return CourseModel.find({$and: [{userIds: userId}, {_id: values[1]}]}).exec().then(res => {
				if (!res || res.length <= 0) {
					return Promise.reject(new errors.Forbidden("You don't have permissions!"));
				}
				return res;
			});
		case 'classes':
			return ClassModel.find({$and: [{userIds: userId}, {_id: values[1]}]}).exec().then(res => {
				if (!res || res.length <= 0) {
					return Promise.reject(new errors.Forbidden("You don't have permissions!"));
				}
				return res;
			});
		default: return Promise.reject("StorageContext is invalid");
	}
};

const createAWSConfig = () => {
	var config = new aws.Config(awsConfig);
	config.endpoint = new aws.Endpoint(awsConfig.endpointUrl);
	return config;
};

class AWSS3Strategy extends AbstractFileStorageStrategy {

	create(schoolId) {
		if (!schoolId) return Promise.reject(new errors.BadRequest('No school id'));

		// check if school already has a bucket
		var promise = SchoolModel.findById(schoolId).exec();

		return promise.then((result) => {
			if (!result) return Promise.reject(new errors.NotFound('school not found'));

			let bucketName = `bucket-${schoolId}`;
			var config = createAWSConfig();
			var s3 = new aws.S3(config);

			return new Promise((resolve, reject) => {
				s3.createBucket({Bucket: bucketName}, function (err, res) {
					if (err) {
						reject(err);
					} else {
						resolve({message: "Successfully created s3-bucket!", data: res});
					}
				});
			});
		}).catch(err => {
			return Promise.reject(err);
		});
	}

	getFiles(userId, storageContext) {
		if (!userId || !storageContext) return Promise.reject(new errors.BadRequest('Missing parameters'));
		return verifyStorageContext(userId, storageContext).then(res => {
			return UserModel.findById(userId).exec().then(result => {
				if (!result || !result.schoolId) return Promise.reject(errors.NotFound("User not found"));

				let bucketName = `bucket-${result.schoolId}`;
				var config = createAWSConfig();
				var s3 = new aws.S3(config);

				return new Promise((resolve, reject) => {
					s3.listObjectsV2({Bucket: bucketName, Prefix: storageContext}, function (err, res) {
						if (err) {
							reject(err);
						} else {
							resolve(res);
						}
					});
				});
			}).catch(err => {
				return err;
			});
		}).catch(err => {
			return err;
		});
	}

	generateSignedUrl(userId, storageContext, fileName, fileType) {
		if (!userId || !storageContext || !fileName || !fileType) return Promise.reject(new errors.BadRequest('Missing parameters'));
		return verifyStorageContext(userId, storageContext).then(res => {
			return UserModel.findById(userId).exec().then(result => {
				if (!result || !result.schoolId) return Promise.reject(errors.NotFound("User not found"));

				let bucketName = `bucket-${result.schoolId}`;
				var config = createAWSConfig();
				var params = {
					Bucket: bucketName,
					Key: storageContext + '/' + fileName,
					Expires: 60,
					ContentType: fileType
				};
				var s3 = new aws.S3(config);
				
				return new Promise((resolve, reject) => {
					s3.getSignedUrl('putObject', params, function (err, res) {
						if (err) {
							reject(err);
						} else {
							resolve(res);
						}
					});
				});
			}).catch(err => {
				return err;
			});
		}).catch(err => {
			return err;
		});
	}
}

module.exports = AWSS3Strategy;