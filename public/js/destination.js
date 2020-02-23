// INITIALIZE THE FIREBASE (utility.js)
initFirebase();

// CHECK THE STATE OF THE USER.
// IF USER IS LOGGED IN, REDIRECT TO destination page
// ELSE CONTINUE WITH LOGIN PAGE
getAuthState(function(user) {
  var data = user.toJSON();

  var userEmail = document.getElementById('user-email');
  var userEmailVerified = document.getElementById('user-email-verified');
  var userAnonymous = document.getElementById('user-anonymous');
  var userUID = document.getElementById('user-uid');
  
  if (userEmail) {
    userEmail.innerHTML = data.email;
  }

  if (userEmailVerified) {
    userEmailVerified.innerHTML = data.emailVerified;
  }

  if (userAnonymous) {
    userAnonymous.innerHTML = data.isAnonymous;
  }

  if (userUID) {
    userUID.innerHTML = data.uid;
  }
});

var logoutUser = function() {
  firebase
    .auth()
    .signOut()
    .then(function() {
      window.location = "index.html";
    })
    .catch(function(error) {
      // An error happened.
    });
};

// REGISTER EVENTS
document.getElementById("btn-logout").addEventListener("click", logoutUser);
