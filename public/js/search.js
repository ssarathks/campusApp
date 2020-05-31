// INITIALIZE THE FIREBASE (utility.js)
initFirebase();
// Get a reference to the database service


// CHECK THE STATE OF THE USER.
// IF USER IS LOGGED IN, REDIRECT TO destination page
// ELSE CONTINUE WITH LOGIN PAGE

var db = firebase.firestore();


getAuthState(function(user) {

  // LOGGED IN USER DATAS

  var data = user.toJSON();

  if (welcome_heading) {
    welcome_heading.innerHTML = "Welcome " +data.email;
  }
  
  var doc_ref = db.collection("user_info").doc(data.uid);
  doc_ref.get().then(function(doc){
    if (doc.exists){
      // console.log("Document data : ",doc.data().account_type);
      var account_type = doc.data().account_type;

      //IF ADMIN LOGIN
      if (account_type == 'admin') {
    
      }

      //IF ALUMNI LOGIN
      else if (account_type == 'alumni') {
        //SETTING SUBHEADING
        welcome_sub_heading.innerHTML = "<p>Welcome admin.This is the admin and alumni portal of the campusapp</p>";

        //SETTING SIDEMENU CONTENT
        menu_content.innerHTML += `<li id='request_permission_item'><a href='#'><i class='fa fa-dashboard fa-lg'></i> Requests Permission</a></li>`;
        menu_content.innerHTML += `<li><a href='#'><i class='fa fa-dashboard fa-lg'></i> Search Students</a></li>`;
        menu_content.innerHTML += `<li><a href='#'><i class='fa fa-dashboard fa-lg'></i> Add Internship</a></li>`;
        menu_content.innerHTML += `<li><a href='#'><i class='fa fa-dashboard fa-lg'></i> Add off Campus Placement</a></li>`;


        //******** */
        //REQUEST PERMISSION EVENT OF ALUMNI
        //******** */
        //REDIRECTIGN TO REQUESTPERMISSIO.HTML PAGE
        document.getElementById('request_permission_item').addEventListener("click", function(e) {
          e.preventDefault();
          window.location.href = 'request_permission.html'
        });
        console.log();
        
        //SUBMIT EVENT LISTENER
        document.getElementById('request_permission_form').addEventListener("submit", function(e) {
          e.preventDefault();
          var permission_for = document.getElementById('permission_for').value;
          var request_description = document.getElementById('request_permission_textarea').value;
          var request_dates = []
          for(var i = 0 , j = 0; i < 5 ; i++){
            if(document.getElementById('request_date'+(i+1)).value != ""){
              request_dates[j] = firebase.firestore.Timestamp.fromDate(new Date(document.getElementById('request_date'+(i+1)).value));
              j+=1;
            }
          }
          
          // Add a new document with a generated id.
          var new_permission_doc = db.collection("permissions").doc();

          new_permission_doc.set({
            permission_for : permission_for,
            request_description : request_description,
            approved : false,
            posted_by : db.doc("/user_info/"+data.uid),
            posted_on : firebase.firestore.Timestamp.fromDate(new Date(Date.now()))
          })
          .then(function() {
            if(request_dates.length != 0){
              new_permission_doc.set({
                dates_preffered : request_dates
              }, {merge : true});
            }
            alert("Submitted Successfully")
          })
          .catch(function(error) {
          console.error("Error adding document: ", error);
          });
          
          
          
        });

        

        

      }
    } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
    }
    }).catch(function(error) {
      console.log("Error getting document:", error);
  });

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

var destination2 = function(){
  window.location = "destination2.html"
}
// REGISTER EVENTS
document.getElementById("btn-logout").addEventListener("click", logoutUser);
document.getElementById("button2").addEventListener("click",destination2);
