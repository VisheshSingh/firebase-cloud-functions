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

// HTTP CALLABLE FUNCTIONS - NEW REQUEST\
exports.addRequest = functions.https.onCall((data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'only authenticated users can add new requests'
    );
  }

  if (data.text.length > 30) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'Request titles cannot be more than 30 characters long'
    );
  }

  return admin
    .firestore()
    .collection('requests')
    .add({
      text: data.text,
      upvotes: 0
    });
});
