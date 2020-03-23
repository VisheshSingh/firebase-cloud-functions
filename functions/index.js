const functions = require('firebase-functions');

// HTTP REQUESTS
exports.toTheDojo = functions.https.onRequest((req, res) => {
  res.redirect('https://www.thenetninja.co.uk');
});

// CALLABLE
exports.sayHello = functions.https.onCall((data, context) => {
  const name = data.name;
  return `hello ${name}!`;
});
