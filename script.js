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
const auth = firebase.auth();
const db = firebase.firestore();

// Handle Authentication State Changes
auth.onAuthStateChanged((user) => {
    const loginForm = document.getElementById("login-form");
    const logoutButton = document.getElementById("logout-button");
    const gpaColumns = document.querySelectorAll(".gpa-column");

    if (user) {
        loginForm.style.display = "none";
        logoutButton.style.display = "block";
        gpaColumns.forEach(col => col.style.display = "table-cell"); // Show GPA columns for logged-in users
        loadData(true);
    } else {
        loginForm.style.display = "block";
        logoutButton.style.display = "none";
        gpaColumns.forEach(col => col.style.display = "none"); // Hide GPA columns for public users
        loadData(false);
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

// Load Data from Firestore
async function loadData(isLoggedIn) {
    try {
        const snapshot = await db.collection("members").get();
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        renderTable(data, isLoggedIn);
    } catch (error) {
        console.error("Error loading data:", error);
    }
}

// Render Table
function renderTable(data, isLoggedIn) {
    const dataTable = document.getElementById("data-table");
    dataTable.innerHTML = "";
    data.forEach((row) => {
        const points = row.attendance * 10 + row.cumulativeGPA * 50;
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${row.name}</td>
            <td>${row.attendance}</td>
            <td>${points}</td>
            ${
                isLoggedIn
                    ? `<td>${row.fallGPA}</td><td>${row.cumulativeGPA}</td>` // Show GPA for logged-in users
                    : `<td class="gpa-column" style="display:none;"></td><td class="gpa-column" style="display:none;"></td>` // Hide GPA for non-logged-in users
            }
        `;
        dataTable.appendChild(tr);
    });
}

// Sort Leaderboard
function sortLeaderboard(criteria) {
    // Add sorting logic here
}

// Dark Mode Toggle
document.getElementById("dark-mode-toggle").addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
});
