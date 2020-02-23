// firebase user : sarathputhen@gmail.com
// password : sarath@1998

// INITIALIZE THE FIREBASE (utility.js)
initFirebase();

// CHECK THE STATE OF THE USER.
// IF USER IS LOGGED IN, REDIRECT TO destination page
// ELSE CONTINUE WITH LOGIN PAGE
getAuthState(function(user) {
  if (user) {
    window.location.href = "destination.html";
  }
});

// ATTACH FORM SUBMIT EVENTLISTENER
document.getElementById("loginform").addEventListener("submit", function(e) {
  e.preventDefault();
  
  var email = document.getElementById("inp-email").value;
  var password = document.getElementById("inp-password").value;

  // IF ELEMENTS DOESN'T EXIST IN DOM, RETURN
  if (!email || !password) return;

  var authMessage = document.getElementById('auth-message');
  authMessage.style.display = 'block';

  firebase
    .auth()
    .signInWithEmailAndPassword(email, password)
    .catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;

      console.log("[login] > error", error);
    });
});
