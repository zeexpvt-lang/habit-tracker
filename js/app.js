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
