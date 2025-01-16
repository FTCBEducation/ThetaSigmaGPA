// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyBTj1TNRV8zCPhMJj8aUjfq175bGvNPIvs",
  authDomain: "ftcb-d1bfd.firebaseapp.com",
  projectId: "ftcb-d1bfd",
  storageBucket: "ftcb-d1bfd.firebasestorage.app",
  messagingSenderId: "53279722724",
  appId: "1:53279722724:web:73c876d28c0e4a83e570f1"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();

// Global Variables
let currentUser = null;

// Authentication State Listener
auth.onAuthStateChanged((user) => {
    if (user) {
        currentUser = user;
        document.getElementById("login-form").style.display = "none";
        document.getElementById("dashboard").style.display = "block";
        loadData();
    } else {
        currentUser = null;
        document.getElementById("login-form").style.display = "block";
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

// Load Data from Firestore
async function loadData() {
    const snapshot = await db.collection("members").get();
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    renderTable(data);
}

// Render Data Table
function renderTable(data) {
    const dataTable = document.getElementById("data-table");
    dataTable.innerHTML = "";
    data.forEach((row) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${row.name}</td>
            <td>${row.fallGPA}</td>
            <td>${row.cumulativeGPA}</td>
            <td>${row.attendance}</td>
            <td>
                <button onclick="deleteData('${row.id}')">Delete</button>
            </td>
        `;
        dataTable.appendChild(tr);
    });
}

// Add Data
document.getElementById("data-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = document.getElementById("name").value;
    const fallGPA = parseFloat(document.getElementById("fall-gpa").value);
    const cumulativeGPA = parseFloat(document.getElementById("cumulative-gpa").value);
    const attendance = parseInt(document.getElementById("attendance").value);

    await db.collection("members").add({ name, fallGPA, cumulativeGPA, attendance });
    loadData();
    document.getElementById("data-form").reset();
});

// Delete Data
async function deleteData(id) {
    await db.collection("members").doc(id).delete();
    loadData();
}
