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

// Handle Authentication State
auth.onAuthStateChanged(async (user) => {
    const loginForm = document.getElementById("login-form");
    const logoutButton = document.getElementById("logout-button");
    const gpaColumns = document.querySelectorAll(".gpa-column");

    if (user) {
        loginForm.style.display = "none";
        logoutButton.style.display = "block";
        const role = await getUserRole(user.uid);

        if (role === "admin" || role === "member") {
            gpaColumns.forEach(col => col.style.display = "table-cell");
        } else {
            gpaColumns.forEach(col => col.style.display = "none");
        }

        loadLeaderboard(role);
    } else {
        loginForm.style.display = "flex";
        logoutButton.style.display = "none";
        gpaColumns.forEach(col => col.style.display = "none");
        loadLeaderboard("public");
    }
});

// Fetch User Role
async function getUserRole(uid) {
    const userDoc = await db.collection("users").doc(uid).get();
    return userDoc.exists ? userDoc.data().role : "public";
}

// Load Leaderboard
async function loadLeaderboard(role) {
    try {
        const snapshot = await db.collection("members").get();
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        renderLeaderboard(data, role);
    } catch (error) {
        console.error("Error loading leaderboard:", error);
    }
}

// Render Leaderboard
function renderLeaderboard(data, role) {
    const dataTable = document.getElementById("data-table");
    dataTable.innerHTML = "";
    let rank = 1;
    data
        .sort((a, b) => b.points - a.points) // Sort by points
        .forEach(row => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${rank++}</td>
                <td>${row.name}</td>
                <td>${row.attendance}</td>
                <td>${row.points}</td>
                ${
                    role === "admin" || role === "member"
                        ? `<td>${row.fallGPA}</td><td>${row.cumulativeGPA}</td>`
                        : `<td class="gpa-column" style="display:none;"></td><td class="gpa-column" style="display:none;"></td>`
                }
            `;
            dataTable.appendChild(tr);
        });
}

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

// Dark Mode Toggle
document.getElementById("dark-mode-toggle").addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
});
