function register(){
        user=document.getElementById("un1").value;
        pass=document.getElementById("pwd1").value;
        email=document.getElementById("em").value;
        if(user!==null && user!=="", pass!==null && pass!=="", email!==null && email!==""){
          $.ajax({
          type: "POST",
          url: "login_register.php",
          data: { "un":user, "pwd":pass, "em":email },
          success: function(data) {
            window.alert(data);
          }
         });
        }else{
           window.alert("Για την εγγραφή συμπληρώστε όλα τα πεδία");
     }
}


function login(){
        user=document.getElementById("un").value;
        pass=document.getElementById("pwd").value;
        if(user!==null && user!=="", pass!==null && pass!==""){
          $.ajax({
          type: "POST",
          url: "login_register.php",
          data: { "un":user, "pwd":pass },
          success: function(data) {
            if(data==="Λάθος Στοιχεία") window.alert(data);
            else{
              if(pass==="admin") window.location.href="dashboard.html";
              else window.location.href="user.html";
            }
          }
        });
    }else{
      window.alert("Για την σύνδεση εισάγετε username και password");
    }
}

function remember(){
  window.alert('Μη υλοποιημένο');
}
