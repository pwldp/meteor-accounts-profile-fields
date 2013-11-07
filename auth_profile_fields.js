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
	//console.log("query="+JSON.stringify(q));

	ret = Meteor.users.findOne({$or: q}, {fields:{'username':1}});
	console.log("query ret="+JSON.stringify(ret));
	if (callback) callback(null, ret);
	return ret;

    }

});


//
// Run in client: Meteor.loginWithProfileField();
// var pfields = [ 'loyalty_card_number' ];
// Meteor.loginWithProfileField('12345', '123456', profields);
// First trying to log in using specified profile field, next if it fails,
// trying to log in using standard loginWithPassword function.
//
Meteor.loginWithProfileField = function(lname, password, pfields, callback){
    console.log("Meteor.loginWithProfileField, checking fields="+JSON.stringify(pfields));
    //if ( profile_fields.length === 0 ||
    check(lname, String);
    check(password, String);
    check(pfields, [String]);

    if ( Meteor.userId() ){
	callback( new Error("First logout current logged user ID="+Meteor.userId) );
    };
    //var ret = Meteor.findFirstSpecificUser(lname, pfields);
    //console.log("findFirstSpecificUser ret="+ret);


    Meteor.call('findFirstSpecificUser', lname, pfields, function (error, result) {
	console.log("findFirstSpecificUser...");
	if (error || !result) {
	    //callback && callback(
	    //error || new Error("No result from findFirstSpecificUser."));

	    Meteor.loginWithPassword(lname, password, function(err){
		if (err) console.log("login ERROR: "+err);
		if (err) callback(err);
		console.log("LoggedIn?");
		callback()
	    });
	    
	} else {
	    console.log("rsult="+JSON.stringify(result));
	    //callback && callback();
	    // found user, so try to log in

	    Meteor.loginWithPassword(result.username, password, function(err){
		if (err) console.log("login ERROR: "+err);
		if (err) callback(err);
		console.log("LoggedIn?");
		callback()
	    });

	}
    });

/*
    result = Meteor.call('findFirstSpecificUser', lname, pfields);
    console.log("rsult="+JSON.stringify(result));
*/

    if (callback) callback;
    return;
};




//
// EOF
//
