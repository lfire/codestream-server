'use strict';

var Restful_Request = require('./restful_request');

class Get_Request extends Restful_Request {

	authorize (callback) {
		return this.user.authorize_model(
			this.module.model_name,
			this.request.params.id,
			this,
			(error, authorized) => {
				if (error) { return callback(error); }
				if (!authorized) {
					return callback(this.error_handler.error('read_auth'));
				}
				else {
					return process.nextTick(callback);
				}
			}
		);
	}

	process(callback) {
		let id = this.request.params.id;
		this.data[this.module.collection_name].get_by_id(
			id,
			(error, model) => {
				this.got_model(error, model, callback);
			}
		);
	}

	got_model (error, model, callback) {
		if (error) { return callback(error); }
		const model_name = this.module.model_name || 'model';
		if (!model) {
			return callback(this.error_handler.error('not_found', { info: model_name }));
		}
		this.response_data = this.response_data || {};
		this.response_data[model_name] = model.get_sanitized_object();
		process.nextTick(callback);
	}
}

module.exports = Get_Request;
