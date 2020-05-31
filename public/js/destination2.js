initFirebase();

getAuthState(function(user){
  var email_para=document.getElementById("email_para");

  if(user){
    email_para.innerHTML = user.email;
  }
});
