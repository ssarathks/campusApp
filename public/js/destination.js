// INITIALIZE THE FIREBASE (utility.js)
initFirebase();
// Get a reference to the database service


// CHECK THE STATE OF THE USER.
// IF USER IS LOGGED IN, REDIRECT TO destination page
// ELSE CONTINUE WITH LOGIN PAGE

var db = firebase.firestore();

const content_body = document.getElementById('content_body');



function request_approve(id) {
  var doc_id = id.replace('request_approve_button','');
  var approved_date = document.getElementById('request_container_div'+doc_id).querySelector('input[name="dates_preffered"]:checked')
  if (approved_date) {
    console.log("selected");
    db.collection('permissions').doc(doc_id).update({
      status : "approved",
      approved_date : approved_date.value
    })
    .then(function() {
      var docRef = db.collection("permissions").doc(doc_id);
      docRef.get().then(function(doc1) {
          var name = doc1.data().permission_for
          var description = doc1.data().request_description
          var date = doc1.data().approved_date
          var posted_by = doc1.data().posted_by
          console.log(posted_by);
          

          // Add a new document with a generated id.
          db.collection("events").add({
            posted_by : posted_by,
            title : name,
            description : description,
            date : date
          })
          .then(function(docRef) {
            console.log("Document written with ID: ", docRef.id);
            alert("Approved successfully!");
            location.reload(false);
          })
          .catch(function(error) {
            console.error("Error adding document: ", error);
          });
      }).catch(function(error) {
          console.log("Error getting document:", error);
      });
      
      console.log(document.getElementById('pending_requests_link'));
      
    })
    .catch(function(error) {
        // The document probably doesn't exist.
        console.error("Error updating document: ", error);
    });
    
  }
  else{
    alert("Please select a approved date")
    
  }
  
}

function request_decline(id) {
  var doc_id = id.replace('request_decline_button','');
  db.collection('permissions').doc(doc_id).update({
    status : "declined"
  })
  .then(function() {
    alert("Permission declined");
    location.reload(false);
    console.log(document.getElementById('pending_requests_link'));
    
  })
  .catch(function(error) {
      // The document probably doesn't exist.
      console.error("Error updating document: ", error);
  });
}

getAuthState(function(user) {

  // LOGGED IN USER DATAS

  var data = user.toJSON();
  //
  // var userEmail = document.getElementById('user-email');
  // var userEmailVerified = document.getElementById('user-email-verified');
  // var userAnonymous = document.getElementById('user-anonymous');
  // var userUID = document.getElementById('user-uid');
  // var welcome_heading = document.getElementById('welcome_heading');
  //
  // if (userEmail) {
  //   userEmail.innerHTML = data.email;
  // }
  //
  // if (userEmailVerified) {
  //   userEmailVerified.innerHTML = data.emailVerified;
  // }
  //
  // if (userAnonymous) {
  //   userAnonymous.innerHTML = data.isAnonymous;
  // }
  //
  // if (userUID) {
  //   userUID.innerHTML = data.uid;
  // }
  if (welcome_heading) {
    welcome_heading.innerHTML = "Welcome " +data.email;
  }


  //RETREIVING

  // db.collection("user_info").doc(data.uid).get().then((querySnapshot) => {
  //     querySnapshot.forEach((item) => {
  //         var new_p = document.createElement('p');
  //         new_p.id = doc.id + item;
  //         content_div.appendChild(new_p);
  //         document.getElementById(new_p.id).innerHTML = item;
  //         console.log(`${doc.id} => ${doc.data()}`);
  //     });
  // });

  var welcome_sub_heading = document.getElementById('welcome_sub_heading');
  var menu_content = document.getElementById('menu-content');


  var doc_ref = db.collection("user_info").doc(data.uid);
  doc_ref.get().then(function(doc){
    if (doc.exists){
      // console.log("Document data : ",doc.data().account_type);
      var account_type = doc.data().account_type;
      if (account_type == 'student'){
        welcome_sub_heading.innerHTML = "<p>Sorry! This is an admin portal.Students are not permitted to do any actions here.Kindly use the android application.</p>";
        console.log("sorry you are not permitted");
      }

      //IF ADMIN LOGIN
      else if (account_type == 'admin') {

        //VARIABLE DECLARATIONS
        var pending_requests_link = document.getElementById('pending_requests_link');


        //setting subheading for admin
        welcome_sub_heading.innerHTML = "<p>Welcome admin.This is the admin and alumni portal of the campusapp</p>";



        //SETTING SIDEMENU CONTENT
        menu_content.innerHTML += '<li id="pending_requests_link"><a href="#"><i class="fa fa-dashboard fa-lg"></i> Pending Requests</a></li>';
        menu_content.innerHTML += '<li id="search_alumni_link"><a href="#"><i class="fa fa-dashboard fa-lg"></i> Search Alumni</a></li>';
        menu_content.innerHTML += "<li><a href='#'><i class='fa fa-globe fa-lg'></i> Reports</a></li>";


        //SIDE MENU actions

        document.getElementById('pending_requests_link').addEventListener("click", function(e) {
          e.preventDefault();
          content_body.innerHTML = "";
          content_body.innerHTML += `<h3>Pending Requests</h3>`;
          db.collection("permissions").where("status", "==", "pending")
            .get()
            .then(function(querySnapshot) {
              if (querySnapshot.empty) {
                content_body.innerHTML = `<h3>No pending requests!</h3>`
              }
              else {
                querySnapshot.forEach(function(doc) {
                    doc.data().posted_by.get().then(function(doc1){

                      var request_title = doc.data().permission_for;
                      var request_description = doc.data().request_description;
                      var dates_preffered = doc.data().dates_preffered;
                      var posted_on = doc.data().posted_on;
                      var name_ref = doc.data().posted_by;

                      content_body.innerHTML +=
                          `<div class="request_container_div" id="request_container_div`+doc.id+`">
                          </div>`

                      var request_container_div = document.getElementById('request_container_div'+doc.id);
                          if (request_title) {
                            request_container_div.innerHTML+=
                            `<div class="" id="request_heading_div">
                               <h3 id="request_heading">Request for : `+doc.data().permission_for+`</h3>
                            </div>`
                          }

                          if(request_description){
                            request_container_div.innerHTML+=
                            `<div class="">
                                <p id="request_description">`+doc.data().request_description+`</p>
                              </div>
                            </div>`
                          }


                        //VARAIBLES
                        if (dates_preffered) {
                          var date_index = 0;

                          request_container_div.innerHTML+=`<p>Preffered dates :</p>`
                          request_container_div.innerHTML+=`<div id="dates_preffered_div`+doc.id+`">`
                          var dates_preffered_div = document.getElementById('dates_preffered_div'+doc.id)
                          while (doc.data().dates_preffered[date_index] != undefined){

                            var dates_preffered = doc.data().dates_preffered[date_index].toDate().toString().slice(0,15);

                            dates_preffered_div.innerHTML +=
                            `<input type="radio" id="dates_preffered`+date_index+`" name="dates_preffered" value="`+dates_preffered+`">
                            <label for="age1">`+ dates_preffered+`</label><br>`
                            date_index = date_index + 1;
                          }
                          request_container_div.innerHTML+=`</div>`
                          
                        }

                        if (name_ref) {
                          var name = doc1.data().name;
                          var mobile_no = doc1.data().mobile_no;
                          if (name) {
                            request_container_div.innerHTML +=
                            `<div class="">
                            <p id="posted_by">Posted By : ` +name+ `</p>
                            </div>`
                        }
                        if (mobile_no) {
                          request_container_div.innerHTML +=
                          `<div class="">
                          <p id="mobile_no">Contact No : ` +mobile_no+ `</p>
                          </div>`
                        }
                      }

                        if (posted_on) {
                          request_container_div.innerHTML +=
                          `<div class="">
                            <p id="posted_by">Posted On : ` +posted_on.toDate().toString().slice(0,15)+ `</p>
                          </div>`
                        }
                        // name = doc1.data().name; //name from user info fetched through reference
                        // <span id="time">Posted On :`+ doc.data().posted_on.toDate().toString().slice(0,15) +`</span>



                      request_container_div.innerHTML +=
                        `<div>
                            <div class="" id="request_button_div">
                              <button class="btn btn-success" type="button" name="button" id="request_approve_button`+doc.id+`" onClick = "request_approve(this.id)">Approve</button>
                              <button class="btn btn-warning" type="button" name="button">Reply with a message</button>
                              <button class="btn btn-danger" type="button" name="button" id="request_decline_button`+doc.id+`" onClick = "request_decline(this.id)">Decline</button>
                            </div>
                         </div>`;


                  })
                });

              }

            })

            .catch(function(error) {
                console.log("Error getting documents: ", error);
            });
        });

        //REDIRECTING TO SEARCH.HTML PAGE
        document.getElementById('search_alumni_link').addEventListener("click", function(e) {
          e.preventDefault();
          window.location.href = 'search.html'
        });

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
            posted_on : firebase.firestore.Timestamp.fromDate(new Date(Date.now())),
            status : "pending",
            approved_date : ""
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
