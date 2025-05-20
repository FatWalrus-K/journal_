const subjects = ["A Level", "TMUA", "Python", "R", "Other"];
let currentDate = null;

function checkPassword() {
  const pw = document.getElementById("password-input").value;
  if (pw === "keenan") {
    document.getElementById("login-screen").style.display = "none";
    document.getElementById("app").style.display = "block";
    renderCalendar();
    showStats();
  } else {
    alert("Incorrect password!");
  }
}

function renderCalendar() {
  const calendar = document.getElementById("calendar");
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  let html = "<h2>" + today.toLocaleString('default', { month: 'long' }) + " " + year + "</h2><div class='calendar-grid'>";
  for (let i = 1; i <= lastDay.getDate(); i++) {
    const dateKey = year + "-" + String(month+1).padStart(2, '0') + "-" + String(i).padStart(2, '0');
    const entry = getEntry(dateKey);
    const summary = entry ? (entry.subjects.length + " subjects") : "";
    html += `<div class="calendar-day" onclick="selectDate('${dateKey}')">${i}<br><small>${summary}</small></div>`;
  }
  html += "</div>";
  calendar.innerHTML = html;
}

function selectDate(dateStr) {
  currentDate = dateStr;
  document.getElementById("entry-date-title").innerText = "Entry for " + dateStr;
  const entry = getEntry(dateStr);
  document.getElementById("subjects-container").innerHTML = "";
  document.getElementById("general-notes").value = entry?.notes || "";
  (entry?.subjects || []).forEach(sub => addSubject(sub.name, sub.topic, sub.hours));
}

function addSubject(name = "", topic = "", hours = "") {
  const container = document.getElementById("subjects-container");
  const div = document.createElement("div");
  div.className = "subject-entry";
  div.innerHTML = \`
    <label>Subject: 
      <select>
        \${subjects.map(s => \`<option value="\${s}" \${s===name?"selected":""}>\${s}</option>\`).join("")}
      </select>
      <input type="text" placeholder="Custom" value="\${name && !subjects.includes(name) ? name : ""}" />
    </label>
    <label>Topic: <input type="text" value="\${topic}" /></label>
    <label>Hours: <input type="number" value="\${hours}" /></label>
  \`;
  container.appendChild(div);
}

document.getElementById("study-form").onsubmit = (e) => {
  e.preventDefault();
  if (!currentDate) return alert("Select a date first.");
  const subjectsData = [];
  document.querySelectorAll(".subject-entry").forEach(div => {
    const select = div.querySelector("select");
    const custom = div.querySelector("input[type='text']");
    const topic = div.querySelectorAll("input")[1].value;
    const hours = parseFloat(div.querySelectorAll("input")[2].value);
    const name = select.value === "Other" ? (custom.value || "Other") : select.value;
    if (!isNaN(hours)) subjectsData.push({ name, topic, hours });
  });
  const notes = document.getElementById("general-notes").value;
  saveEntry(currentDate, { subjects: subjectsData, notes });
  renderCalendar();
  showStats();
  alert("Saved!");
}

function deleteEntry() {
  if (!currentDate) return;
  localStorage.removeItem("entry_" + currentDate);
  document.getElementById("subjects-container").innerHTML = "";
  document.getElementById("general-notes").value = "";
  renderCalendar();
  showStats();
}