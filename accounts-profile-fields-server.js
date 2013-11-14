//
// meteor-auth_profile_fields-server.js
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
console.log("accounts-profile-fields-server...");
//
//var EJSON = Package.ejson.EJSON;
var check = Package.check.check;
var Future = Npm.require('fibers/future');
//
Meteor.methods({
    findFirstMatchUser: function(fieldval, pfields) {
	check(fieldval, String);
	//if (!fieldval || fieldval.length<1) throw new Meteor.Error(400, "Profiles field value is empty.");
	if (pfields.length<1) throw new Meteor.Error(400, "Profiles fields list can not be empty.");
	//
	var fut = new Future();
	//
	// build query array
	var q = []
	    , row={};
	pfields.forEach(function(item){
	    row = {};
	    row["profile."+item] = fieldval;
	    q.push(row);
	});
	console.log("query="+JSON.stringify(q));
	var ret = Meteor.users.findOne({$or: q}, {fields:{'username':1}} );
	fut['return']( ret );
	return fut.wait();
    }
});
//
// EOF
//

