
  // Your web app's Firebase configuration
  var firebaseConfig = {
    apiKey: "AIzaSyCJuTDil5mz0rsHrmBTlKSh0nPstEbwd3s",
    authDomain: "mind-barf-e6745.firebaseapp.com",
    projectId: "mind-barf-e6745",
    storageBucket: "mind-barf-e6745.appspot.com",
    messagingSenderId: "339425742596",
    appId: "1:339425742596:web:953a7a9ea744d52197ca51"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  const auth = firebase.auth();

  function newUser(){
      var email = document.getElementById("email");
      var password = document.getElementById("password");

      const promise = auth.createUserWithEmailAndPassword(email.value, password.value);
      promise.catch(e => alert(e.message));

      window.location.href = "mindMap.html";

      alert("Welcome");

  };

  function logIn(){
    var email = document.getElementById("email");
    var password = document.getElementById("password");

    const promise = auth.signInWithEmailAndPassword(email.value, password.value);
    promise.catch(e => alert(e.message));

    alert("Logged In");
    
    window.location.href = "test.html";

  };

  