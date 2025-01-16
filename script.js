// Firebase Configuration
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// Handle Authentication State Changes
auth.onAuthStateChanged((user) => {
    if (user) {
        document.getElementById("login-form").style.display = "none";
        document.getElementById("dashboard").style.display = "block";
        document.getElementById("logout-button").style.display = "block";
        // Show GPA columns for logged-in users
        const gpaColumns = document.querySelectorAll(".gpa-column");
        gpaColumns.forEach(col => col.style.display = "table-cell");
        loadData(true); // Load full data for logged-in users
    } else {
        document.getElementById("login-form").style.display = "none";
        document.getElementById("dashboard").style.display = "block"; // Leaderboard always visible
        document.getElementById("logout-button").style.display = "none";
        // Hide GPA columns for public users
        const gpaColumns = document.querySelectorAll(".gpa-column");
        gpaColumns.forEach(col => col.style.display = "none");
        loadData(false); // Load partial data for public users
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
                    ? `<td>${row.fallGPA}</td><td>${row.cumulativeGPA}</td>`
                    : `<td class="gpa-column" style="display:none;"></td><td class="gpa-column" style="display:none;"></td>`
            }
        `;
        dataTable.appendChild(tr);
    });
}

// Sort Leaderboard
function sortLeaderboard(criteria) {
    // Sorting logic will depend on your implementation
}

// Dark Mode Toggle
document.getElementById("dark-mode-toggle").addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
});
