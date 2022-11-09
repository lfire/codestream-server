'use strict';

const SetPasswordTest = require('./set_password_test');
const Assert = require('assert');

class InvalidTokenTest extends SetPasswordTest {

	get description () {
		return 'should redirect to an error page when requesting a set password page with an invalid token';
	}

	before (callback) {
		super.before (error => {
			if (error) { return callback(error); }
			this.apiRequestOptions = {
				expectRedirect: true,
				noJsonInResponse: true
			};
			this.path = '/web/user/password?token=abcxyz';
			callback();
		});
	}

	validateResponse (data) {
		Assert.strictEqual(data, '/web/user/password/reset/invalid', 'incorrect redirect');
	}
}

module.exports = InvalidTokenTest;
