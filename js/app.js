// ===== STATE =====
let habits = JSON.parse(localStorage.getItem('fp_habits') || '["Exercise","Read 30 min","Drink water","Sleep 8h"]');
let completions = JSON.parse(localStorage.getItem('fp_completions') || '{}');
let expenses = JSON.parse(localStorage.getItem('fp_expenses') || '[]');

let viewYear = new Date().getFullYear();
let viewMonth = new Date().getMonth();

// ===== SAVE =====
function save() {
  localStorage.setItem('fp_habits', JSON.stringify(habits));
  localStorage.setItem('fp_completions', JSON.stringify(completions));
  localStorage.setItem('fp_expenses', JSON.stringify(expenses));
}

// ===== HEADER DATE =====
document.getElementById('header-date').textContent =
  new Date().toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });

// ===== PAGE NAV =====
function showPage(pageId, btn) {
  document.querySelectorAll('.page').forEach(p => p.style.display = 'none');
  document.getElementById(pageId).style.display = 'block';
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  if (pageId === 'growth') renderGrowth();
  if (pageId === 'home') renderHome();
}

// ===== HELPERS =====
function daysInMonth(y, m) { return new Date(y, m + 1, 0).getDate(); }
function monthPrefix(y, m) { return `${y}-${String(m + 1).padStart(2, '0')}-`; }
function todayStr() {
  const t = new Date();
  return `${t.getFullYear()}-${String(t.getMonth()+1).padStart(2,'0')}-${String(t.getDate()).padStart(2,'0')}`;
}

// ===== HABITS =====
function addHabit() {
  const v = document.getElementById('habit-input').value.trim();
  if (!v) return;
  habits.push(v); save();
  renderHabitManage(); renderCal(); renderHome();
  document.getElementById('habit-input').value = '';
}

function removeHabit(i) {
  habits.splice(i, 1); save();
  renderHabitManage(); renderCal(); renderHome();
}

function toggleDay(habit, day) {
  const key = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}|${habit}`;
  completions[key] = !completions[key];
  save(); renderCal(); renderHome();
}

function toggleToday(habit) {
  const key = `${todayStr()}|${habit}`;
  completions[key] = !completions[key];
  save(); renderHome(); renderCal();
}

function renderHabitManage() {
  const el = document.getElementById('habit-manage-list');
  if (!habits.length) { el.innerHTML = '<p class="empty-msg">No habits yet. Add one above.</p>'; return; }
  el.innerHTML = habits.map((h, i) => `
    <div class="habit-item">
      <span class="habit-name-text">${h}</span>
      <button class="btn-del" onclick="removeHabit(${i})">&#x2715;</button>
    </div>`).join('');
}

function renderCal() {
  const days = daysInMonth(viewYear, viewMonth);
  const today = new Date();
  const isNow = today.getFullYear() === viewYear && today.getMonth() === viewMonth;
  const todayDay = today.getDate();
  const pfx = monthPrefix(viewYear, viewMonth);

  document.getElementById('cal-month-label').textContent =
    new Date(viewYear, viewMonth, 1).toLocaleString('default', { month: 'long', year: 'numeric' });

  const cols = 130 + days * 25;
  let html = `<div class="cal-grid" style="grid-template-columns:130px repeat(${days},22px);min-width:${cols}px;">`;
  html += '<div class="cal-head"></div>';
  for (let d = 1; d <= days; d++) html += `<div class="cal-head">${d}</div>`;

  habits.forEach(h => {
    html += `<div class="cal-label" title="${h}">${h}</div>`;
    for (let d = 1; d <= days; d++) {
      const key = `${pfx}${String(d).padStart(2, '0')}|${h}`;
      const done = completions[key];
      const future = isNow && d > todayDay;
      const esc = h.replace(/'/g, "\\'");
      html += `<div class="cal-cell${done ? ' done' : ''}${future ? ' future' : ''}"
        ${!future ? `onclick="toggleDay('${esc}',${d})"` : ''}
        title="${h} – Day ${d}"></div>`;
    }
  });

  html += '</div>';
  document.getElementById('cal-container').innerHTML = html;
}

function changeMonth(d) {
  viewMonth += d;
  if (viewMonth < 0) { viewMonth = 11; viewYear--; }
  if (viewMonth > 11) { viewMonth = 0; viewYear++; }
  renderCal();
}

// ===== HOME =====
function renderHome() {
  const t = new Date();
  const pfx = `${t.getFullYear()}-${String(t.getMonth()+1).padStart(2,'0')}-`;
  const td = todayStr();

  // today habits
  let todayDone = 0;
  habits.forEach(h => { if (completions[`${td}|${h}`]) todayDone++; });

  // monthly spend
  const monthKey = `${t.getFullYear()}-${String(t.getMonth()+1).padStart(2,'0')}`;
  const monthTotal = expenses
    .filter(e => e.date.startsWith(monthKey))
    .reduce((s, e) => s + Number(e.amount), 0);

  // streak avg this month
  const days = daysInMonth(t.getFullYear(), t.getMonth());
  let total = 0, done = 0;
  habits.forEach(h => {
    for (let d = 1; d <= t.getDate(); d++) {
      total++;
      if (completions[`${pfx}${String(d).padStart(2,'0')}|${h}`]) done++;
    }
  });
  const avg = total ? Math.round(done / total * 100) : 0;

  document.getElementById('ov-today').textContent = `${todayDone}/${habits.length}`;
  document.getElementById('ov-month').textContent = `₹${monthTotal.toLocaleString('en-IN')}`;
  document.getElementById('ov-streak').textContent = `${avg}%`;

  // today checklist
  const el = document.getElementById('home-habits-list');
  if (!habits.length) { el.innerHTML = '<p class="empty-msg">Add habits in the Habits tab.</p>'; return; }
  el.innerHTML = habits.map(h => {
    const key = `${td}|${h}`;
    const done = completions[key];
    const esc = h.replace(/'/g, "\\'");
    return `<div class="habit-item">
      <div class="habit-check${done ? ' done' : ''}" onclick="toggleToday('${esc}')"></div>
      <span class="habit-name-text" style="${done ? 'opacity:0.4;text-decoration:line-through;' : ''}">${h}</span>
    </div>`;
  }).join('');
}

// ===== EXPENSES =====
document.getElementById('exp-date').valueAsDate = new Date();

function addExpense() {
  const date = document.getElementById('exp-date').value;
  const cat = document.getElementById('exp-cat').value.trim();
  const amt = parseFloat(document.getElementById('exp-amt').value);
  const type = document.getElementById('exp-type').value;
  const note = document.getElementById('exp-note').value.trim();

  if (!date || !cat || isNaN(amt) || amt <= 0) {
    alert('Date, Category and Amount are required.');
    return;
  }
  expenses.push({ date, category: cat, amount: amt, type, note });
  expenses.sort((a, b) => b.date.localeCompare(a.date));
  save(); renderExpenses(); updateExpMetrics();

  document.getElementById('exp-cat').value = '';
  document.getElementById('exp-amt').value = '';
  document.getElementById('exp-note').value = '';
}

function removeExpense(i) {
  expenses.splice(i, 1); save(); renderExpenses(); updateExpMetrics();
}

function renderExpenses() {
  const body = document.getElementById('expense-body');
  if (!expenses.length) {
    body.innerHTML = '<tr><td colspan="6" class="empty-msg" style="padding:16px 10px;">No expenses yet.</td></tr>';
    return;
  }
  body.innerHTML = expenses.map((e, i) => `
    <tr>
      <td>${e.date}</td>
      <td>${e.category}</td>
      <td style="font-weight:600;">₹${Number(e.amount).toLocaleString('en-IN')}</td>
      <td><span class="type-badge type-${e.type.toLowerCase()}">${e.type}</span></td>
      <td style="opacity:0.6;">${e.note || '—'}</td>
      <td><button class="btn-del" onclick="removeExpense(${i})">&#x2715;</button></td>
    </tr>`).join('');
}

function updateExpMetrics() {
  const now = new Date();
  const mk = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}`;
  const monthly = expenses.filter(e => e.date.startsWith(mk));
  const total = monthly.reduce((s, e) => s + Number(e.amount), 0);
  document.getElementById('exp-count').textContent = expenses.length;
  document.getElementById('exp-this-month').textContent = `₹${total.toLocaleString('en-IN')}`;

  const types = {};
  expenses.forEach(e => types[e.type] = (types[e.type] || 0) + Number(e.amount));
  const top = Object.entries(types).sort((a, b) => b[1] - a[1])[0];
  document.getElementById('exp-top-type').textContent = top ? top[0] : '—';
}

// ===== GROWTH =====
const barColors = ['#00c896', '#00aeff', '#ffb340', '#ff6b6b', '#c084fc', '#f472b6'];
const barClasses = ['', 'blue', 'amber', 'coral', '', ''];

function makeBars(entries, prefix) {
  if (!entries.length) return '<p class="empty-msg">No data yet.</p>';
  const max = Math.max(...entries.map(e => e.val), 1);
  return entries.map(([label, val], i) => `
    <div class="bar-row">
      <div class="bar-meta"><span class="bar-label">${label}</span><span class="bar-val">${prefix}${typeof val === 'number' ? val.toLocaleString('en-IN') : val}</span></div>
      <div class="bar-track"><div class="bar-fill ${barClasses[i % barClasses.length]}" style="width:${Math.round(val/max*100)}%;background:${barColors[i%barColors.length]};"></div></div>
    </div>`).join('');
}

function renderGrowth() {
  // by category
  const cats = {};
  expenses.forEach(e => cats[e.category] = (cats[e.category] || 0) + Number(e.amount));
  const catEntries = Object.entries(cats).sort((a,b)=>b[1]-a[1]).map(([l,v])=>({val:v,0:l,1:v}));
  document.getElementById('growth-exp-bars').innerHTML = makeBars(
    Object.entries(cats).sort((a,b)=>b[1]-a[1]).map(([l,v])=>[l,v]), '₹'
  );

  // habit completion
  const t = new Date();
  const pfx = `${t.getFullYear()}-${String(t.getMonth()+1).padStart(2,'0')}-`;
  const days = t.getDate();
  const habitEntries = habits.map(h => {
    let done = 0;
    for (let d = 1; d <= days; d++)
      if (completions[`${pfx}${String(d).padStart(2,'0')}|${h}`]) done++;
    return [h, Math.round(done / days * 100)];
  });
  document.getElementById('growth-habit-bars').innerHTML = makeBars(habitEntries, '') + (habitEntries.length ? '' : '');
  // fix % display
  if (habitEntries.length) {
    document.getElementById('growth-habit-bars').innerHTML = habitEntries.map(([h, pct], i) => `
      <div class="bar-row">
        <div class="bar-meta"><span class="bar-label">${h}</span><span class="bar-val">${pct}%</span></div>
        <div class="bar-track"><div class="bar-fill" style="width:${pct}%;background:${barColors[i%barColors.length]};"></div></div>
      </div>`).join('');
  } else {
    document.getElementById('growth-habit-bars').innerHTML = '<p class="empty-msg">No habits tracked yet.</p>';
  }

  // monthly spend
  const monthly = {};
  expenses.forEach(e => {
    const mk = e.date.slice(0, 7);
    monthly[mk] = (monthly[mk] || 0) + Number(e.amount);
  });
  const monthEntries = Object.entries(monthly).sort((a,b)=>a[0].localeCompare(b[0])).map(([m,v])=>{
    const [y,mo] = m.split('-');
    const label = new Date(y, mo-1, 1).toLocaleString('default',{month:'short',year:'2-digit'});
    return [label, v];
  });
  document.getElementById('growth-monthly').innerHTML = makeBars(monthEntries, '₹');
}

// ===== EXCEL EXPORT =====
function exportExcel() {
  const wb = XLSX.utils.book_new();

  // Expenses sheet
  const expRows = [
    ['Date', 'Category', 'Amount (₹)', 'Type', 'Note'],
    ...expenses.map(e => [e.date, e.category, Number(e.amount), e.type, e.note || ''])
  ];
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(expRows), 'Expenses');

  // Habits sheet
  const t = new Date();
  const y = t.getFullYear(), mo = t.getMonth();
  const days = daysInMonth(y, mo);
  const pfx = monthPrefix(y, mo);
  const habHeader = ['Habit', ...Array.from({length: days}, (_, i) => `Day ${i+1}`), 'Done', 'Completion %'];
  const habRows = habits.map(h => {
    const row = [h];
    let done = 0;
    for (let d = 1; d <= days; d++) {
      const v = completions[`${pfx}${String(d).padStart(2,'0')}|${h}`] ? 1 : 0;
      row.push(v); done += v;
    }
    row.push(done, `${Math.round(done / days * 100)}%`);
    return row;
  });
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet([habHeader, ...habRows]), 'Habits');

  const month = new Date(y, mo, 1).toLocaleString('default', {month:'short', year:'numeric'}).replace(' ','-');
  XLSX.writeFile(wb, `fitpro-${month}.xlsx`);
}

// ===== INIT =====
renderHabitManage();
renderCal();
renderExpenses();
updateExpMetrics();
renderHome();
