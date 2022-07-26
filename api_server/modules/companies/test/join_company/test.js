// handle unit tests for the "PUT /companies/join/:id" request, to join a company

'use strict';

const JoinCompanyTest = require('./join_company_test');
const JoinCompanyFetchTest = require('./join_company_fetch_test');
const CompanyNotFoundTest = require('./company_not_found_test');
const ACLTest = require('./acl_test');
const NoDomainJoiningTest = require('./no_domain_joining_test');
const MessageTest = require('./message_test');
const MessageToTeamTest = require('./message_to_team_test');
const JoinTeamSubscriptionTest = require('./join_team_subscription_test');
const JoinCompanyV3BroadcasterTokenTest = require('./join_company_v3_broadcaster_token_test');

class JoinCompanyRequestTester {

	test () {
		new JoinCompanyTest().test();
		new JoinCompanyFetchTest().test();
		new CompanyNotFoundTest().test();
		new ACLTest().test();
		new NoDomainJoiningTest().test();
		new MessageTest().test();
		new MessageToTeamTest().test();
		new JoinTeamSubscriptionTest().test();
		new JoinTeamSubscriptionTest({ useV3BroadcasterToken: true }).test();
		new JoinCompanyV3BroadcasterTokenTest().test();
	}
}

module.exports = new JoinCompanyRequestTester();
