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

// Updated leaderboard data with accurate "Pledge Class"
const leaderboardData = [
    { name: "David Lucas", pledgeClass: "Beta Upsilon", major: "Architecture", fallGpa: 3.63, cumulativeGpa: 3.26 },
    { name: "Christian Bidolli", pledgeClass: "Beta Chi", major: "FRL", fallGpa: 2.54, cumulativeGpa: 2.97 },
    { name: "Kyle Barnes", pledgeClass: "Beta Chi", major: "Electrical Engineering", fallGpa: 3.40, cumulativeGpa: 3.30 },
    { name: "Evan Tiemann", pledgeClass: "Beta Chi", major: "Computer Engineering", fallGpa: 0.60, cumulativeGpa: 2.74 },
    { name: "Izaac Friaz", pledgeClass: "Beta Chi", major: "Industrial Engineering", fallGpa: 3.42, cumulativeGpa: 2.64 },
    { name: "Aiden Daniels", pledgeClass: "Beta Chi", major: "Biotech", fallGpa: 3.40, cumulativeGpa: 2.73 },
    { name: "Austin Walker", pledgeClass: "Beta Psi", major: "Biology", fallGpa: 3.88, cumulativeGpa: 3.88 },
    { name: "Matthew Aguilara", pledgeClass: "Beta Psi", major: "Kinesiology", fallGpa: 2.22, cumulativeGpa: 3.31 },
    { name: "Christian Enkerlin", pledgeClass: "Beta Psi", major: "Business + Psychology", fallGpa: 3.88, cumulativeGpa: 3.63 },
    { name: "Collin Currie", pledgeClass: "Beta Psi", major: "Electromechanical Engineering", fallGpa: 2.50, cumulativeGpa: 2.70 },
    { name: "Cade Wheeler", pledgeClass: "Beta Omega", major: "Mechanical Engineering", fallGpa: 3.87, cumulativeGpa: 3.17 },
    { name: "Adam Godfrey", pledgeClass: "Beta Omega", major: "Computer Engineering", fallGpa: 1.90, cumulativeGpa: 2.60 },
    { name: "Ethan Quezada", pledgeClass: "Beta Omega", major: "Business Administration", fallGpa: 3.63, cumulativeGpa: 3.11 },
    { name: "Connor Tye", pledgeClass: "Beta Omega", major: "Anthropology", fallGpa: 2.92, cumulativeGpa: 3.08 },
    { name: "Joel Carvajal", pledgeClass: "Beta Omega", major: "Construction Engineering", fallGpa: 2.63, cumulativeGpa: 2.85 },
    { name: "Joseph Lee", pledgeClass: "Gamma Alpha", major: "Electrical Engineering", fallGpa: 2.71, cumulativeGpa: 3.35 },
    { name: "Neil Lim", pledgeClass: "Gamma Alpha", major: "Marketing", fallGpa: 2.27, cumulativeGpa: 2.86 },
    { name: "Ethan Henderson", pledgeClass: "Gamma Beta", major: "Biology", fallGpa: 1.46, cumulativeGpa: 2.56 },
    { name: "Eddie McKay", pledgeClass: "Gamma Beta", major: "Computer Engineering", fallGpa: 2.11, cumulativeGpa: 3.04 },
    { name: "Chase Haut", pledgeClass: "Gamma Beta", major: "FRL", fallGpa: 3.12, cumulativeGpa: 3.16 },
    { name: "Nico Rodriguez", pledgeClass: "Gamma Gamma", major: "Mechanical Engineering", fallGpa: 2.82, cumulativeGpa: 3.33 },
    { name: "Daniel Alvarez", pledgeClass: "Gamma Gamma", major: "Political Science", fallGpa: 0.00, cumulativeGpa: 2.74 },
    { name: "Arya Mehrazarin", pledgeClass: "Gamma Delta", major: "Mechanical Engineering", fallGpa: 2.57, cumulativeGpa: 3.12 },
    { name: "Cole Shumaker", pledgeClass: "Gamma Delta", major: "Architecture", fallGpa: 3.76, cumulativeGpa: 3.75 }
    // Remaining data goes here...
];

// Populate the leaderboard dynamically
function populateLeaderboard(data) {
    const tbody = document.getElementById('leaderboard').querySelector('tbody');
    tbody.innerHTML = ""; // Clear table before repopulating
    data.forEach(member => {
        const row = `
            <tr>
                <td>${member.name}</td>
                <td>${member.pledgeClass}</td>
                <td>${member.major}</td>
                <td>${member.fallGpa}</td>
                <td>${member.cumulativeGpa}</td>
            </tr>
        `;
        tbody.innerHTML += row;
    });
}

// Sort the leaderboard
function sortLeaderboard(column, type) {
    const sortedData = [...leaderboardData].sort((a, b) => {
        if (type === "string") {
            return a[column].localeCompare(b[column]);
        } else if (type === "number") {
            return a[column] - b[column];
        }
    });
    populateLeaderboard(sortedData);
}

// Attach event listeners to column headers
document.querySelectorAll("th").forEach(header => {
    header.addEventListener("click", () => {
        const column = header.dataset.column;
        const type = header.dataset.type;
        sortLeaderboard(column, type);
    });
});

// Initial population
populateLeaderboard(leaderboardData);
