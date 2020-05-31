function initFirebase() {
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
    var db = firebase.firestore();
}

function getAuthState (callback) {
  firebase.auth().onAuthStateChanged(function(user) {
    callback(user);
  });
};
