/*
Handle logout page
*/
Template.logout.profileFields = function(){
    console.log("userId= "+Meteor.userId());
    if (Meteor.userId()){
	var user = Meteor.users.findOne({_id:Meteor.userId()},{fields:{profile:1}});
	var profile;
	if (user) profile = EJSON.stringify(user.profile);
	console.log("user.profile: "+profile);
	return profile;
    } else {
	return null;
    };
};
//
Template.logout.events({
    'click #btnLogout': function(event){
	console.log("clicked on logout button");
	Meteor.logout();
    }
});
//
// EOF
//
