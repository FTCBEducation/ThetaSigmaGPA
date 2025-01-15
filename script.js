// Firebase Configuration
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();

// Global Variables
let currentUser = null;

// Authentication
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
        alert(error.message);
    }
});

// Logout
document.getElementById("logout-button").addEventListener("click", () => {
    auth.signOut();
});

// Load Data from Firestore
async function loadData() {
    const snapshot = await db.collection("members").get();
    const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
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
