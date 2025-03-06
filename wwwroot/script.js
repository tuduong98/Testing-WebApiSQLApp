const apiUrl = "api/employees";
let isEditMode = false;
let editId = null;

// Load employees on page load
document.addEventListener("DOMContentLoaded", loadEmployees);

// Add/Edit employee form submission
document
  .getElementById("employeeForm")
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    const employee = {
      fullName: document.getElementById("fullName").value,
      email: document.getElementById("email").value,
      phoneNumber: document.getElementById("phoneNumber").value,
      position: document.getElementById("position").value,
      salary: parseFloat(document.getElementById("salary").value),
      hiredDate: new Date(
        document.getElementById("hiredDate").value
      ).toISOString(),
    };

    const method = isEditMode ? "PUT" : "POST";
    const url = isEditMode ? `${apiUrl}/${editId}` : apiUrl;

    try {
      const response = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(employee),
      });

      if (response.ok) {
        showMessage(
          isEditMode
            ? "Employee updated successfully!"
            : "Employee added successfully!",
          true
        );
        document.getElementById("employeeForm").reset();
        resetForm();
        loadEmployees();
      } else {
        throw new Error("Failed to save employee");
      }
    } catch (error) {
      showMessage(error.message, false);
    }
  });

// Search employee by ID
document.getElementById("searchForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const id = document.getElementById("searchId").value;
  try {
    const response = await fetch(`${apiUrl}/${id}`);
    const resultDiv = document.getElementById("searchResult");
    if (response.ok) {
      const employee = await response.json();
      resultDiv.innerHTML = `
                <p>ID: ${employee.id}</p>
                <p>Full Name: ${employee.fullName}</p>
                <p>Email: ${employee.email}</p>
                <p>Phone: ${employee.phoneNumber}</p>
                <p>Position: ${employee.position}</p>
                <p>Salary: ${employee.salary}</p>
                <p>Hired Date: ${new Date(
                  employee.hiredDate
                ).toLocaleString()}</p>
            `;
    } else {
      resultDiv.innerHTML = "<p>Employee not found!</p>";
    }
  } catch (error) {
    resultDiv.innerHTML = "<p>Error fetching employee!</p>";
  }
});

// Load employees into table
async function loadEmployees() {
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    const tbody = document.getElementById("employeeTableBody");
    tbody.innerHTML = "";

    data.employees.forEach((emp) => {
      const row = document.createElement("tr");
      row.innerHTML = `
                <td>${emp.id}</td>
                <td>${emp.fullName}</td>
                <td>${emp.email}</td>
                <td>${emp.phoneNumber}</td>
                <td>${emp.position}</td>
                <td>${emp.salary}</td>
                <td>${new Date(emp.hiredDate).toLocaleString()}</td>
                <td>
                    <button class="edit" onclick="editEmployee(${
                      emp.id
                    })">Edit</button>
                    <button class="delete" onclick="deleteEmployee(${
                      emp.id
                    })">Delete</button>
                </td>
            `;
      tbody.appendChild(row);
    });
  } catch (error) {
    console.error("Error loading employees:", error);
  }
}

// Delete employee
async function deleteEmployee(id) {
  if (confirm("Are you sure you want to delete this employee?")) {
    try {
      await fetch(`${apiUrl}/${id}`, { method: "DELETE" });
      showMessage("Employee deleted successfully!", true);
      loadEmployees();
    } catch (error) {
      showMessage("Error deleting employee!", false);
    }
  }
}

// Edit employee
async function editEmployee(id) {
  try {
    const response = await fetch(`${apiUrl}/${id}`);
    if (response.ok) {
      const employee = await response.json();
      document.getElementById("fullName").value = employee.fullName;
      document.getElementById("email").value = employee.email;
      document.getElementById("phoneNumber").value = employee.phoneNumber;
      document.getElementById("position").value = employee.position;
      document.getElementById("salary").value = employee.salary;
      document.getElementById("hiredDate").value = employee.hiredDate.slice(
        0,
        16
      );

      isEditMode = true;
      editId = id;
      document.getElementById("formTitle").textContent = "Edit Employee";
      document.getElementById("submitButton").textContent = "Update Employee";
    }
  } catch (error) {
    showMessage("Error fetching employee for edit!", false);
  }
}

// Reset form to add mode
function resetForm() {
  isEditMode = false;
  editId = null;
  document.getElementById("formTitle").textContent = "Add New Employee";
  document.getElementById("submitButton").textContent = "Add Employee";
}

// Show success/error message
function showMessage(message, isSuccess) {
  const messageDiv = document.getElementById("formMessage");
  messageDiv.textContent = message;
  messageDiv.className = isSuccess ? "success" : "error";
  setTimeout(() => (messageDiv.textContent = ""), 3000);
}

// Handle Refresh button click
document
  .getElementById("refreshButton")
  .addEventListener("click", loadEmployees);
