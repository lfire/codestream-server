'use strict';

var Bound_Async = require(process.env.CI_API_TOP + '/lib/util/bound_async');
var Restful_Request = require(process.env.CI_API_TOP + '/lib/util/restful/restful_request.js');
var User_Creator = require('./user_creator');
var Confirm_Code = require('./confirm_code');

const CONFIRMATION_CODE_TIMEOUT = 7 * 24 * 60 * 60 * 1000;

class Register_Request extends Restful_Request {

	authorize (callback) {
		return callback(false);
	}

	process (callback) {
		Bound_Async.series(this, [
			this.allow,
			this.generate_confirm_code,
			this.save_user,
			this.send_email
		], (error) => {
			if (error) { return callback(error); }
			this.response_data = { user: this.user.get_sanitized_object() };
			callback();
		});
	}

	allow (callback) {
		this.allow_parameters(
			'body',
			{
				string: ['email', 'password', 'username', 'first_name', 'last_name'],
				number: ['timeout'],
				'array(string)': ['emails']
			},
			callback
		);
	}

	generate_confirm_code (callback) {
		this.request.body.confirmation_code = Confirm_Code();
		this.request.body.confirmation_attempts = 0;
		let timeout = this.request.body.timeout || CONFIRMATION_CODE_TIMEOUT;
		timeout = Math.min(timeout, CONFIRMATION_CODE_TIMEOUT);
		this.request.body.confirmation_code_expires_at = Date.now() + timeout;
		delete this.request.body.timeout;
		process.nextTick(callback);
	}

	save_user (callback) {
		if (this.request.body.email) {
			this.request.body.emails = [this.request.body.email];
			delete this.request.body.email;
		}
		this.user_creator = new User_Creator({
			request: this
		});
		this.user_creator.create_user(
			this.request.body,
			(error, user) => {
				if (error) { return callback(error); }
				this.user = user;
				callback();
			}
		);
	}

	send_email (callback) {
		this.api.services.email.send_confirmation_email(
			{
				user: this.user.attributes,
				email: this.user.get('emails')[0],
				request: this
			},
			callback
		);
	}
}

module.exports = Register_Request;
