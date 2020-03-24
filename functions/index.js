const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

// AUTH TRIGGER - NEW USER SIGN UP
exports.newUserSignup = functions.auth.user().onCreate(user => {
  // for background triggers, return a value/promise
  return admin
    .firestore()
    .collection('users')
    .doc(user.uid)
    .set({
      email: user.email,
      upvotedOn: []
    });
});

// AUTH TRIGGER - USER DELETED
exports.userDeleted = functions.auth.user().onDelete(user => {
  // for background triggers, return a value/promise
  const doc = admin
    .firestore()
    .collection('users')
    .doc(user.uid);
  return doc.delete();
});
