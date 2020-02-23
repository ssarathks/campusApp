// firebase user : sarathputhen@gmail.com
//         password : sarath@1998


var config = {
  apiKey: "AIzaSyADnYJh16w33KzFeYhJJOleSi7aZcMLFAw",
  authDomain: "campusapp-df124.firebaseapp.com",
  databaseURL: "https://campusapp-df124.firebaseio.com",
  projectId: "campusapp-df124",
  storageBucket: "campusapp-df124.appspot.com",
  messagingSenderId: "168038743226",
  appId: "1:168038743226:web:d2ea696a173eaeb61d9683",
  measurementId: "G-JS8G1X2H2Y"
};

firebase.initializeApp(config);

function login() {
  var email=document.getElementById("emailfield").value;
  var password=document.getElementById("passwordfield").value;
  firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
  // Handle Errors here.
  var errorCode = error.code;
  var errorMessage = error.message;

  window.alert(errorMessage);
});
firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION)
  .then(function() {
    // Existing and future Auth states are now persisted in the current
    // session only. Closing the window would clear any existing state even
    // if a user forgets to sign out.
    // ...
    // New sign-in will be persisted with session persistence.
    return firebase.auth().signInWithEmailAndPassword(email, password);
  })
  .catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
  });
  var user = firebase.auth().currentUser;

  if (user) {
    // User is signed in.
    window.location.href = "destination.html";
    console.log(user.email);
  } else {
    // No user is signed in.
  }
}


function logout(){
    firebase.auth().signOut().then(function() {
    // Sign-out successful.
    console.log("signed out");
    window.location = "index.html";
  }).catch(function(error) {
    // An error happened.
  });
}

console.log("connected")
