'use strict';

const CodemarkReplyTest = require('./codemark_reply_test');
const ObjectID = require('mongodb').ObjectID;

class CodemarkNotFoundTest extends CodemarkReplyTest {

	get description () {
		return 'should return an error when trying to send an inbound email request with a to address that has a codemarkID for a codemark that does not exist';
	}

	getExpectedError () {
		return {
			code: 'INBE-1008',
		};
	}

	// make the data to be used in the request that triggers the message
	makePostData (callback) {
		super.makePostData(() => {
			// inject a valid but non-existent codemark ID
			const index = this.data.to[0].address.indexOf('.');
			const fakeCodemarkId = ObjectID();
			this.data.to[0].address = fakeCodemarkId + this.data.to[0].address.slice(index);
			this.data.to.splice(1);
			callback();
		});
	}
}

module.exports = CodemarkNotFoundTest;
