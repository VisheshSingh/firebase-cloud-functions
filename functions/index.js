const functions = require('firebase-functions');

// AUTH TRIGGER - NEW USER SIGN UP
exports.newUserSignup = functions.auth.user().onCreate(user => {
  console.log('New user signed up: ', user.email, user.uid);
});

// AUTH TRIGGER - USER DELETED
exports.userDeleted = functions.auth.user().onDelete(user => {
  console.log('User deleted', user.email, user.uid);
});
