// all pages
const pages = document.querySelectorAll(".page");

// hide all pages
function hideAllPages() {
  pages.forEach(page => {
    page.style.display = "none";
  });
}

// show one page
function showPage(pageId) {
  hideAllPages();
  document.getElementById(pageId).style.display = "block";
}

// default page
showPage("home");

// nav buttons
document.getElementById("nav-home").addEventListener("click", () => {
  showPage("home");
});

document.getElementById("nav-habits").addEventListener("click", () => {
  showPage("habits");
});

document.getElementById("nav-growth").addEventListener("click", () => {
  showPage("growth");
});

document.getElementById("nav-expense").addEventListener("click", () => {
  showPage("expense");
});

document.getElementById("nav-export").addEventListener("click", () => {
  alert("Export feature – next step 😄");
});
// ===== ADD EXPENSE LOGIC =====
const addBtn = document.querySelector(".add-btn");
const expenseBody = document.getElementById("expense-body");
const STORAGE_KEY = "fitpro_expenses";
let expenses = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
function renderExpenses() {
  expenseBody.innerHTML = "";

  expenses.forEach(exp => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${exp.date}</td>
      <td>${exp.category}</td>
      <td>₹${exp.amount}</td>
      <td>${exp.type}</td>
      <td>${exp.note}</td>
    `;
    expenseBody.appendChild(row);
  });
}

// load saved data when page loads
renderExpenses();

addBtn.addEventListener("click", () => {
  const inputs = document.querySelectorAll(".expense-form input");
  const select = document.querySelector(".expense-form select");

  const date = inputs[0].value;
  const category = inputs[1].value;
  const amount = inputs[2].value;
  const note = inputs[3].value;
  const type = select.value;

  if (!date || !category || !amount) {
    alert("Date, Category, Amount fill pannunga");
    return;
  }

  const expense = { date, category, amount, type, note };

  expenses.push(expense);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
  renderExpenses();

  inputs.forEach(i => i.value = "");
});



