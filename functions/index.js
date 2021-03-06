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
  console.log('data', data);
  if (data.text.length > 30) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'Request titles cannot be more than 30 characters long'
    );
  }

  return admin
    .firestore()
    .collection('requests')
    .doc()
    .set({
      text: data.text,
      upvotes: 0
    });
});

// UPVOTE CALLABLE FUNCTION
exports.upvote = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'only authenticated users can add new requests'
    );
  }

  const user = admin
    .firestore()
    .collection('users')
    .doc(context.auth.uid);
  const request = admin
    .firestore()
    .collection('requests')
    .doc(data.id);
  console.log('User: ', user, 'Request: ', request);

  const doc = await user.get();
  // check the user hasn't already upvoted a request
  if (doc.data().upvotedOn.includes(data.id)) {
    throw new functions.https.HttpsError(
      'failed-precondition',
      'You can only upvote something once'
    );
  }

  // update user array
  await user.update({
    upvotedOn: [...doc.data().upvotedOn, data.id]
  });

  // update votes on the request
  return request.update({
    upvotes: admin.firestore.FieldValue.increment(1)
  });
});

// FIRESTORE TRIGGER
exports.logActivities = functions.firestore
  .document(`/{collection}/{id}`)
  .onCreate((snap, context) => {
    console.log(snap.data());

    const collection = context.params.collection;
    const id = context.params.id;

    const activities = admin.firestore().collection('activities');
    if (collection === 'requests') {
      return activities.add({ text: 'A new request was added!' });
    }

    if (collection === 'users') {
      return activities.add({ text: ' A new user signed up!' });
    }

    return null;
  });
