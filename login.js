  // Your web app's Firebase configuration
  var firebaseConfig = {
    apiKey: "AIzaSyCJuTDil5mz0rsHrmBTlKSh0nPstEbwd3s",
    authDomain: "mind-barf-e6745.firebaseapp.com",
    databaseURL: "https://mind-barf-e6745-default-rtdb.firebaseio.com",
    projectId: "mind-barf-e6745",
    storageBucket: "mind-barf-e6745.appspot.com",
    messagingSenderId: "339425742596",
    appId: "1:339425742596:web:953a7a9ea744d52197ca51"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  var userRef = firebase.database().ref("Users");

  database = firebase.database();

  const auth = firebase.auth();

  function newUser(){
      var email = document.getElementById("email");
      var password = document.getElementById("password");

      auth.createUserWithEmailAndPassword(email.value, password.value)
      .then(function(){
        //userRef.push(email.value);
        localStorage.setItem("user", email.value);
        alert("Welcome: " + email.value);
        window.location = "test.html";

      })
      .catch(function(error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log("Failed login + REASON: " + errorMessage + " CODE: " + 
      errorCode)
      });


  };

  function logIn(){
    var email = document.getElementById("email");
    var password = document.getElementById("password");

    auth.signInWithEmailAndPassword(email.value, password.value)
    .then(function(){
      alert("Logged In: " + email.value);
      localStorage.setItem("user", email);
      window.location = "test.html";

    })
    .catch(function(error) {
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log("Failed login + REASON: " + errorMessage + " CODE: " + 
    errorCode)
    });
    


  };

  /*auth.onAuthStateChange(function(user){
    if(user){
      var email = user.email;
      alert("Active User" + email);
    }
    else{
      alert("No Active User");
    }
})*/