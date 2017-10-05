'use strict';

var Update_To_Database_Test = require('./update_to_database_test');

class Apply_No_Add_To_Database_Test extends Update_To_Database_Test {

	get_description () {
		return 'should get an unchanged model after applying a no-op add update and persisting';
	}

	update_test_model (callback) {
		var update = {
			array: 4
		};
		this.data.test.apply_op_by_id(
			this.test_model.id,
			{ add: update },
			callback
		);
	}
}

module.exports = Apply_No_Add_To_Database_Test;
