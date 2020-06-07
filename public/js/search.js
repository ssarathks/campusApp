// INITIALIZE THE FIREBASE (utility.js)
initFirebase();
// Get a reference to the database service


// CHECK THE STATE OF THE USER.
// IF USER IS LOGGED IN, REDIRECT TO destination page
// ELSE CONTINUE WITH LOGIN PAGE

var db = firebase.firestore();

function capitalize(text) {
  return text.charAt(0).toUpperCase() + text.slice(1)  
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
        
      }

      //IF ADMIN LOGIN
      else if (account_type == 'admin') {      

        console.log("reached");
        search_button = document.getElementById('search_button')
        search_by_company = document.getElementById('search_by_company')
        search_by_skill = document.getElementById('search_by_skill')
        search_field = document.getElementById('search_field')
        search_button.addEventListener('click', function (e) {
          e.preventDefault();
          content_body.innerHTML=""
          content_body.innerHTML+=`<h2>Search Results</h2>`
          if (!search_by_company.checked && !search_by_skill.checked) {
            alert("Please select atleast one option")
          }
          if (search_by_company.checked) {
            
            search_term = search_field.value
            search_term_array = [search_term.toLowerCase(),search_term.toUpperCase(),capitalize(search_term)]
            console.log(search_term_array);
            
            db.collection("user_info")
              .where("account_type", "==", "alumni")
              .where('company_name', 'in', search_term_array)
              .get()
              .then(function(querySnapshot) {
                  querySnapshot.forEach(function(doc) {
                      // doc.data() is never undefined for query doc snapshots
                      var name = doc.data().name;
                      var branch = doc.data().branch;
                      var mobile_no = doc.data().mobile_no;
                      var year_of_graduation = doc.data().year_of_graduation;
                      var present_status = doc.data().present_status;
                      var company_name = doc.data().company_name;
                      var technologies_known = doc.data().technologies_known;
                      var technologies_working_on = doc.data().technologies_working_on;
                      //search result div is given the style of request container div
                      content_body.innerHTML+=
                      `<div class="request_container_div" id="search_result_div`+doc.id+`">
                        </div>`
   
                      var search_result_div = document.getElementById('search_result_div'+doc.id);
                      
                      if (name) {
                        search_result_div.innerHTML+=
                        `<div class="" id="">
                               <h4 id="">Name : `+name+`</h4>
                          </div>`
                      }
                      if (branch) {
                        search_result_div.innerHTML+=
                        `<div class="" id="">
                               <p>Branch : `+branch+`<p>
                          </div>`
                      }
                      if (year_of_graduation) {
                        search_result_div.innerHTML+=
                        `<div class="" id="">
                               <p>Year of Graduation : `+year_of_graduation+`<p>
                          </div>`
                      }
                      if (present_status) {
                        search_result_div.innerHTML+=
                        `<div class="" id="">
                               <p>Present Status : `+present_status+`<p>
                          </div>`
                      }
                      if (company_name) {
                        search_result_div.innerHTML+=
                        `<div class="" id="">
                          <b><p>Company Name : `+company_name+`<p></b>
                          </div>`
                      }
                      if (mobile_no) {
                        search_result_div.innerHTML+=
                        `<div class="" id="">
                          <p>Mobile No : `+mobile_no+`<p>
                          </div>`
                      }
                      if (technologies_known) {
                        var index = 0
                        search_result_div.innerHTML+=
                        `<div class="" id="technologies_known_div`+doc.id+`">
                          <span>Technologies Known :</span>
                          </div>`
                        technologies_known_div = document.getElementById('technologies_known_div'+doc.id);
                          while(technologies_known[index] != undefined){
                            technologies_known_div.innerHTML += `<span>`+technologies_known[index]+`,</span>`
                            index = index+1
                          }
                      }
                      if (technologies_working_on) {
                        var index = 0
                        search_result_div.innerHTML+=
                        `<div class="" id="technologies_working_on_div`+doc.id+`">
                          <span>Technologies Known :</span>
                          </div>`
                          technologies_working_on_div = document.getElementById('technologies_working_on_div'+doc.id);
                          while(technologies_working_on[index] != undefined){
                            technologies_working_on_div.innerHTML += `<span>`+technologies_working_on[index]+`,</span>`
                            index = index+1
                          }
                      }
                      console.log(doc.id, " => ", doc.data());
                  });
              })
              .catch(function(error) {
                  console.log("Error getting documents: ", error);
              });

            
            }
          
        })        
      }

      //IF ALUMNI LOGIN
      else if (account_type == 'alumni') {
        

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
