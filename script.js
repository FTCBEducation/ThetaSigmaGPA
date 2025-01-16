// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyBTj...",
    authDomain: "ftcb-d1bfd.firebaseapp.com",
    projectId: "ftcb-d1bfd",
    storageBucket: "ftcb-d1bfd.appspot.com",
    messagingSenderId: "53279722724",
    appId: "1:53279722724:web:73c876d28c0e4a83e570f1"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// Authentication State Listener
auth.onAuthStateChanged((user) => {
    if (user) {
        document.getElementById("login-form").style.display = "none";
        document.getElementById("dashboard").style.display = "block";
        loadData();
    } else {
        document.getElementById("login-form").style.display = "flex";
        document.getElementById("dashboard").style.display = "none";
    }
});

// Login
document.getElementById("login-button").addEventListener("click", async () => {
    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;

    try {
        await auth.signInWithEmailAndPassword(email, password);
    } catch (error) {
        alert("Login Failed: " + error.message);
    }
});

// Logout
document.getElementById("logout-button").addEventListener("click", () => {
    auth.signOut();
});

// Dark Mode Toggle
document.getElementById("dark-mode-toggle").addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
});
