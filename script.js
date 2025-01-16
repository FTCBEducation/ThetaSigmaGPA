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
  if (user) {
    document.getElementById("login-form").style.display = "none";
    document.getElementById("dashboard").style.display = "block";
    loadData();
  } else {
    document.getElementById("login-form").style.display = "flex";
    document.getElementById("dashboard").style.display = "none";
  }
});

// Login Functionality
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

// Logout Functionality
document.getElementById("logout-button").addEventListener("click", () => {
  auth.signOut();
  alert("Logged out successfully!");
});

// Load Data from Firestore
async function loadData() {
  try {
    const snapshot = await db.collection("members").get();
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    renderTable(data);
  } catch (error) {
    console.error("Error loading data:", error);
  }
}

// Render Table
function renderTable(data) {
  const dataTable = document.getElementById("data-table");
  dataTable.innerHTML = "";
  data.forEach((row) => {
    const points = row.attendance * 10 + row.cumulativeGPA * 50;
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${row.name}</td>
      <td>${row.fallGPA}</td>
      <td>${row.cumulativeGPA}</td>
      <td>${row.attendance}</td>
      <td>${points}</td>
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

// Dark Mode Toggle
document.getElementById("dark-mode-toggle").addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
});
