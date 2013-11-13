//
// meteor-auth_profile_fields-server.js
//
// Provides function loginWithProfileFields() which is designed to log in
// user by using specified 'profile' field(s).
//
// Dariusz Pawlak <d.pawlak@wurth.pl>
// 2013.11.07
//


//
// This method finds first user which satisfies the conditions:
// the 'fieldval' is equal to content of the one of fields from 'pfields' list.
//
// So be aware of using ONLY profile fields which have unique values.
// For example it mighty be: phone number.
//
Meteor.methods({
  findFirstSpecificUser: function(fieldval, pfields, callback) {
	  check(fieldval, String);
	  check(pfields, [String]);
	  // build query array
	  var q = []
	    , row={};

	  pfields.forEach(function(item){
	    row = {};
	    row["profile."+item] = fieldval;
	    q.push(row);
	  });

	  var ret = Meteor.users.findOne({$or: q}, {fields:{'username':1}});
	  console.log("query ret="+JSON.stringify(ret));
	  if (callback) callback(null, ret);
	  return ret;

  }

});

//
// EOF
//
