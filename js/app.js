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
// demo expense data
const expenses = [
  { date: "2026-01-01", category: "Food", amount: 250, type: "Need" },
  { date: "2026-01-02", category: "Gym", amount: 500, type: "Need" },
  { date: "2026-01-03", category: "Shopping", amount: 1200, type: "Want" }
];

const expenseBody = document.getElementById("expense-body");

function renderExpenses() {
  expenseBody.innerHTML = "";
  expenses.forEach(exp => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${exp.date}</td>
      <td>${exp.category}</td>
      <td>₹${exp.amount}</td>
      <td>${exp.type}</td>
    `;
    expenseBody.appendChild(row);
  });
}

renderExpenses();
