//
// meteor-auth_profile_fields-server.js
//
// Dariusz Pawlak <d.pawlak@wurth.pl>
//

//
// Authentication method which uses users profile fields defined in settings.json file:
// settings.json example:
//
// {
//    "login_with_profile_fields": ["phone","registration_plate"]
// }
//
//
// Be aware of using ONLY profile fields which have unique values
// For example it might be: phone number.
//
var check = Package.check.check;

var allowedLoginFields = [];
// Server function to add one or more allowed fields that the client
// may use when submitting a login request.
//
// @param fields {Array} or {String}
var allowLoginWithFields = function(fields) {
    if (typeof fields === 'string') fields = [fields];
	allowedLoginFields = allowedLoginFields.concat(fields);
};
//
var selectorFromUserProfileQuery = function (fields, value) {
    check(fields, Array);
    check(value, String);

    var selector = [];
    allowedLoginFields.forEach(function(field) {
	var row = {};
	if (fields.indexOf(field) !== -1) {
	    row['profile.' + field] = value;
	    selector.push(row);
	}
    });
    // Also match on username and email address
    selector.push({ username: value });
    selector.push({ 'emails.address': value });

    return { $or: selector };
};
//
// Load profile fields list on server startup
//
Meteor.startup(function(){
    // load allowed login fields from settings.json
    try {
	allowLoginWithFields(Meteor.settings.login_with_profile_fields);
    } catch (e) {
	throw err;
    };
});
//
// register login handler which uses users profile fields
//
Accounts.registerLoginHandler("profileFields", function(options){
    
    if (! options.profileFields && ! options.loginName){
	return undefined;
    };
    //
    var selector = selectorFromUserProfileQuery(allowedLoginFields, options.loginName);
    console.log("selector= "+EJSON.stringify(selector));
    //
    var user = Meteor.users.findOne(selector);
    
    if (!user) throw new Meteor.Error(403, "User not found");
    //
    if (!user.services || !user.services.password || !(user.services.password.bcrypt || user.services.password.srp))
	throw new Meteor.Error(403, "User has no password set");

    return {
	userId: user._id
    };

});
