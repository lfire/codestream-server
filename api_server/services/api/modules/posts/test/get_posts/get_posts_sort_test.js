'use strict';

var GetPostsTest = require('./get_posts_test');

class GetPostsSortTest extends GetPostsTest {

	get description () {
		return 'should return the correct posts in correct order when requesting posts in ascending order by ID';
	}

	// set the path to use for the request
	setPath (callback) {
		// sort the posts by ID, then specify an ascending sort order in the request
		this.myPosts.sort((a, b) => {
			return a._id.localeCompare(b._id);
		});
		this.path = `/posts/?teamId=${this.team._id}&streamId=${this.stream._id}&sort=asc`;
		callback();
	}

	// validate the request response
	validateResponse (data) {
		// this will check that the received posts not only match, but they are in the expected order
		this.validateSortedMatchingObjects(data.posts, this.myPosts, 'posts');
		super.validateResponse(data);
	}
}

module.exports = GetPostsSortTest;
