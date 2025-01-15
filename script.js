let darkMode = false;
let data = JSON.parse(localStorage.getItem("fraternityData")) || [];

// Switch between sections
function showSection(sectionId) {
    document.querySelectorAll("section").forEach((section) => {
        section.style.display = section.id === sectionId ? "block" : "none";
    });
}

// Toggle Dark Mode
function toggleDarkMode() {
    darkMode = !darkMode;
    document.body.classList.toggle("dark-mode", darkMode);
}

// Render Data Table
function renderTable() {
    const dataTable = document.getElementById("data-table");
    dataTable.innerHTML = "";
    data.forEach((row, index) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${row.name}</td>
            <td>${row.fallGPA}</td>
            <td>${row.cumulativeGPA}</td>
            <td>${row.attendance}</td>
            <td>
                <button onclick="editData(${index})">Edit</button>
                <button onclick="deleteData(${index})">Delete</button>
            </td>
        `;
        dataTable.appendChild(tr);
    });
}

// Add Data
document.getElementById("data-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("name").value;
    const fallGPA = parseFloat(document.getElementById("fall-gpa").value);
    const cumulativeGPA = parseFloat(document.getElementById("cumulative-gpa").value);
    const attendance = parseInt(document.getElementById("attendance").value);

    data.push({ name, fallGPA, cumulativeGPA, attendance });
    localStorage.setItem("fraternityData", JSON.stringify(data));

    renderTable();
    document.getElementById("data-form").reset();
});

// Edit Data
function editData(index) {
    const row = data[index];
    document.getElementById("name").value = row.name;
    document.getElementById("fall-gpa").value = row.fallGPA;
    document.getElementById("cumulative-gpa").value = row.cumulativeGPA;
    document.getElementById("attendance").value = row.attendance;

    deleteData(index);
}

// Delete Data
function deleteData(index) {
    data.splice(index, 1);
    localStorage.setItem("fraternityData", JSON.stringify(data));
    renderTable();
}

renderTable();
