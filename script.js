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
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-firestore.js";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Populate the leaderboard dynamically
function populateLeaderboard(data) {
    const tbody = document.getElementById('leaderboard').querySelector('tbody');
    tbody.innerHTML = ""; // Clear table before repopulating
    data.forEach(member => {
        const row = `
            <tr>
                <td>${member.name}</td>
                <td>${member.position}</td>
                <td>${member.major}</td>
                <td>${member.fallGpa}</td>
                <td>${member.cumulativeGpa}</td>
            </tr>
        `;
        tbody.innerHTML += row;
    });
}

// Fetch data from Firebase Firestore
async function fetchLeaderboard() {
    const querySnapshot = await getDocs(collection(db, "leaderboard"));
    const data = [
        { name: "David Lucas", position: "Beta Upsilon", major: "Architecture", fallGpa: 3.63, cumulativeGpa: 3.26 },
        { name: "Austin Walker", position: "Beta Psi", major: "Biology", fallGpa: 3.88, cumulativeGpa: 3.88 },
        { name: "Christian Bidolli", position: "Beta Chi", major: "FRL", fallGpa: 2.54, cumulativeGpa: 2.97 },
        { name: "Cade Wheeler", position: "Beta Omega", major: "Mechanical Engineering", fallGpa: 3.87, cumulativeGpa: 3.17 },
        { name: "Adam Garay", position: "Beta Chi", major: "Industrial Engineering", fallGpa: 4.00, cumulativeGpa: 2.99 },
        { name: "Kyle Barnes", position: "Beta Upsilon", major: "Electrical Engineering", fallGpa: 3.40, cumulativeGpa: 3.30 },
        { name: "Evan Tiemann", position: "Beta Chi", major: "Computer Engineering", fallGpa: 0.60, cumulativeGpa: 2.74 },
        { name: "Logan Sandhu", position: "Beta Chi", major: "FRL", fallGpa: 3.07, cumulativeGpa: 3.15 },
        { name: "Christian Enkerlin", position: "Beta Psi", major: "Business + Psychology", fallGpa: 3.88, cumulativeGpa: 3.63 },
        { name: "Joseph Lee", position: "Beta Chi", major: "Electrical Engineering", fallGpa: 2.71, cumulativeGpa: 3.35 },
        { name: "Ut Batra", position: "Beta Omega", major: "Electromechanical Engineering", fallGpa: 3.22, cumulativeGpa: 2.95 },
        { name: "Ethan Quezada", position: "Beta Omega", major: "Business Administration", fallGpa: 3.63, cumulativeGpa: 3.11 },
        { name: "Diego Carrillo", position: "Gamma Alpha", major: "Construction Engineering", fallGpa: 2.44, cumulativeGpa: 3.10 },
        { name: "Matthew Aguilara", position: "Gamma Alpha", major: "Kinesiology", fallGpa: 2.22, cumulativeGpa: 3.31 },
        { name: "Adam Carrera", position: "Gamma Gamma", major: "Construction Engineering", fallGpa: 3.29, cumulativeGpa: 3.29 },
        { name: "Alexander Halikidis", position: "Gamma Delta", major: "Construction Engineering", fallGpa: 2.47, cumulativeGpa: 3.03 }
        // All other data should go here...
    ];

    populateLeaderboard(data);
}

// Sort the leaderboard
function sortLeaderboard(column, type) {
    const tbody = document.getElementById("leaderboard").querySelector("tbody");
    const rows = Array.from(tbody.querySelectorAll("tr"));
    const sortedRows = rows.sort((a, b) => {
        const aValue = a.querySelector(`td:nth-child(${column})`).innerText;
        const bValue = b.querySelector(`td:nth-child(${column})`).innerText;

        if (type === "string") {
            return aValue.localeCompare(bValue);
        } else if (type === "number") {
            return parseFloat(aValue) - parseFloat(bValue);
        }
    });

    tbody.innerHTML = "";
    sortedRows.forEach(row => tbody.appendChild(row));
}

// Attach event listeners to column headers
document.querySelectorAll("th").forEach(header => {
    header.addEventListener("click", () => {
        const column = header.dataset.column;
        const type = header.dataset.type;
        sortLeaderboard(column, type);
    });
});

// Fetch leaderboard data on page load
fetchLeaderboard();
