// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyBTj1TNRV8zCPhMJj8aUjfq175bGvNPIvs",
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
const storage = firebase.storage();

// Global Variables
let data = [];

// Authentication State Listener
auth.onAuthStateChanged((user) => {
    if (user) {
        // User is signed in
        document.getElementById("login-form").style.display = "none";
        document.getElementById("dashboard").style.display = "block";
        loadData(); // Load the data for logged-in users
    } else {
        // User is signed out
        document.getElementById("login-form").style.display = "block";
        document.getElementById("dashboard").style.display = "none";
    }
});

// Login Functionality
document.getElementById("login-button").addEventListener("click", async () => {
    const email = document.getElementById("login-email").value.trim();
    const password = document.getElementById("login-password").value.trim();

    try {
        await auth.signInWithEmailAndPassword(email, password);
        alert("Login Successful!");
    } catch (error) {
        console.error("Login Failed:", error.message);
        alert("Login Failed: " + error.message);
    }
});

// Logout Functionality
document.getElementById("logout-button").addEventListener("click", () => {
    auth.signOut();
    alert("You have been logged out.");
});

// Dark Mode Toggle
document.getElementById("dark-mode-toggle").addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    const buttons = document.querySelectorAll("button");
    buttons.forEach((btn) => btn.classList.toggle("btn-dark"));
    const tables = document.querySelectorAll("table");
    tables.forEach((table) => table.classList.toggle("table-dark"));
});

// Load Data from Firestore
async function loadData() {
    try {
        const snapshot = await db.collection("members").get();
        data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        renderTable();
    } catch (error) {
        console.error("Error loading data:", error);
    }
}

// Render Data Table
function renderTable() {
    const dataTable = document.getElementById("data-table");
    dataTable.innerHTML = ""; // Clear previous data
    data.forEach((member) => {
        const points = calculatePoints(member);
        const row = `
            <tr>
                <td>${member.name}</td>
                <td>${member.fallGPA}</td>
                <td>${member.cumulativeGPA}</td>
                <td>${member.attendance}</td>
                <td>${points}</td>
                <td><button class="btn btn-danger btn-sm" onclick="deleteData('${member.id}')">Delete</button></td>
            </tr>`;
        dataTable.innerHTML += row;
    });
}

// Add New Member
document.getElementById("data-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = document.getElementById("name").value.trim();
    const fallGPA = parseFloat(document.getElementById("fall-gpa").value);
    const cumulativeGPA = parseFloat(document.getElementById("cumulative-gpa").value);
    const attendance = parseInt(document.getElementById("attendance").value);

    try {
        await db.collection("members").add({ name, fallGPA, cumulativeGPA, attendance });
        alert("Member added successfully!");
        loadData();
        document.getElementById("data-form").reset();
    } catch (error) {
        console.error("Error adding member:", error);
    }
});

// Delete Member
async function deleteData(id) {
    try {
        await db.collection("members").doc(id).delete();
        alert("Member deleted successfully!");
        loadData();
    } catch (error) {
        console.error("Error deleting member:", error);
    }
}

// Calculate Points
function calculatePoints(member) {
    return member.attendance * 10 + member.cumulativeGPA * 50;
}

// Sort Leaderboard
function sortLeaderboard(criteria) {
    data.sort((a, b) => b[criteria] - a[criteria]);
    renderTable();
}

// Upload Study Resource
async function uploadResource() {
    const file = document.getElementById("resource-upload").files[0];
    if (!file) return alert("Please select a file to upload.");
    try {
        const storageRef = storage.ref(`resources/${file.name}`);
        await storageRef.put(file);
        alert("File uploaded successfully!");
    } catch (error) {
        console.error("Error uploading file:", error);
    }
}
