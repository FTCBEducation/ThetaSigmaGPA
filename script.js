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
const storage = firebase.storage();
const auth = firebase.auth();

// Global Variables
let data = [];

// Authentication State Listener
auth.onAuthStateChanged((user) => {
    if (user) {
        document.getElementById("login-form").style.display = "none";
        document.getElementById("dashboard").style.display = "block";
        loadData();
    } else {
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
    data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    renderTable();
}

// Render Data Table
function renderTable() {
    const dataTable = document.getElementById("data-table");
    dataTable.innerHTML = "";
    data.forEach((row) => {
        const points = calculatePoints(row);
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${row.name}</td>
            <td>${row.fallGPA}</td>
            <td>${row.cumulativeGPA}</td>
            <td>${row.attendance}</td>
            <td>${points}</td>
            <td>
                <button onclick="showProfile('${row.id}')">Profile</button>
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

// Show Member Profile
function showProfile(id) {
    const member = data.find((item) => item.id === id);
    alert(`Name: ${member.name}\nFall GPA: ${member.fallGPA}\nCumulative GPA: ${member.cumulativeGPA}\nAttendance: ${member.attendance}`);
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

// Dark Mode
function toggleDarkMode() {
    document.body.classList.toggle("dark-mode");
}

// Upload Study Resource
async function uploadResource() {
    const file = document.getElementById("resource-upload").files[0];
    if (!file) return alert("No file selected!");
    const storageRef = storage.ref(`resources/${file.name}`);
    await storageRef.put(file);
    alert("File uploaded successfully!");
}

// Generate QR Code
function generateQRCode() {
    const eventId = document.getElementById("event-id").value;
    if (!eventId) return alert("Enter an Event ID!");
    new QRCode(document.getElementById("qrcode"), {
        text: `https://yourwebsite.com/checkin?event=${eventId}`,
        width: 128,
        height: 128
    });
}
