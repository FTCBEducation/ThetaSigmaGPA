// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyBTj1TNRV8zCPhMJj8aUjfq175bGvNPIvs",
    authDomain: "ftcb-d1bfd.firebaseapp.com",
    projectId: "ftcb-d1bfd",
    storageBucket: "ftcb-d1bfd.firebaseapp.com",
    messagingSenderId: "53279722724",
    appId: "1:53279722724:web:73c876d28c0e4a83e570f1"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// Global Variables
let data = [];

// Authentication Listener
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
    const email = document.getElementById("login-email").value.trim();
    const password = document.getElementById("login-password").value.trim();

    try {
        await auth.signInWithEmailAndPassword(email, password);
        alert("Login successful!");
    } catch (error) {
        alert("Login failed: " + error.message);
    }
});

// Logout
document.getElementById("logout-button").addEventListener("click", () => {
    auth.signOut();
    alert("Logged out successfully!");
});

// Load Data
async function loadData() {
    const snapshot = await db.collection("members").get();
    data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    renderTable();
}

// Render Table
function renderTable() {
    const dataTable = document.getElementById("data-table");
    dataTable.innerHTML = "";
    data.forEach((row) => {
        const points = row.attendance * 10 + row.cumulativeGPA * 50;
        const goals = row.goals || "No goals set";
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${row.name}</td>
            <td>${row.fallGPA}</td>
            <td>${row.cumulativeGPA}</td>
            <td>${row.attendance}</td>
            <td>${points}</td>
            <td>${goals}</td>
            <td>
                <button class="btn btn-danger btn-sm" onclick="deleteData('${row.id}')">Delete</button>
            </td>
        `;
        dataTable.appendChild(tr);
    });
}

// Add Member
document.getElementById("data-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = document.getElementById("name").value.trim();
    const fallGPA = parseFloat(document.getElementById("fall-gpa
