const {Octokit} = require("@octokit/rest");
const ErrorHandler = require(process.env.CSSVC_BACKEND_ROOT + '/shared/server_utils/error_handler');
const RestfulRequest = require(process.env.CSSVC_BACKEND_ROOT + '/api_server/lib/util/restful/restful_request.js');

class CodespacesAuth extends RestfulRequest {

    constructor (options) {
        super(options);
        this.errorHandler = this.module.errorHandler;
    }

    async authorize () {
        // no authorization necessary, authorization is handled by the processing logic
    }

    // process the request...
    async process () {
        try {
            this.provider = "github";
            this.authToken = this.request.body.authToken;
            this.octokit = new Octokit({ auth: this.authToken });
            const userData = await this.githubApiRequest('users', 'getAuthenticated');
            const emailData = await this.getEmailData();
            this.log("*** codespaces userData: " + JSON.stringify(userData));
            this.log("*** codespaces emailData: " + JSON.stringify(emailData));
        } catch (e) {
            throw e;
        }
    }

    async getEmailData() {
        try {
            let emailData = await this.githubApiRequest('users', 'listEmailsForAuthenticatedUser');
            emailData = emailData instanceof Array ? emailData : null;
            return emailData;
        } catch (e) {
            this.warn(ErrorHandler.log(e));
            if (e.message === "invalidProviderCredentials") {
                return null;
            } else {
                throw e;
            }
        }
    }

    // make a github api request
    async githubApiRequest(module, method) {
        if (this.accessToken === 'invalid-token') {	// for testing
            throw this.request.errorHandler.error('invalidProviderCredentials', { reason: 'invalid token' });
        }
        const mockCode = (
            this.providerInfo &&
            this.providerInfo.code &&
            this.providerInfo.code.match(/^mock.*-(.+)-(.+)$/)
        );
        if (mockCode && mockCode.length >= 3) {
            if (method === 'getAuthenticated') {
                return this._mockIdentity(mockCode[1]);
            }
            else if (method === 'listEmailsForAuthenticatedUser') {
                return this._mockEmails();
            }
        }
        try {
            return (await this.octokit[module][method]()).data;
        }
        catch (error) {
            throw new Error('invalidProviderCredentials');
        }
    }
}

module.exports = CodespacesAuth;