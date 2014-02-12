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
// For example it might be: phone number.
//
var check = Package.check.check;

Meteor.methods({
  findFirstMatchUser: function(fieldval, pfields) {
    check(fieldval, String);
    if (pfields.length < 1) throw new Meteor.Error(400, "Profiles fields list can not be empty.");

    var q = [], 
        row={};

    pfields.forEach(function(item){
        row = {}; 
        row['profile.'+item] = fieldval;
        q.push(row);
    }); 

    return Meteor.users.findOne({$or: q});
  }
});
