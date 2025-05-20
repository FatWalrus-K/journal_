let data = JSON.parse(localStorage.getItem("studyData") || "{}");
let selectedDate = null;
const subjectsList = ["A Level", "TMUA", "Python", "R", "Other"];
const password = "keenan";

function checkPassword() {
  const input = document.getElementById("password-input").value;
  if (input === password) {
    document.getElementById("login-screen").style.display = "none";
    document.getElementById("main-app").style.display = "block";
    renderCalendar();
    renderStats();
  } else {
    alert("Incorrect password.");
  }
}

function renderCalendar() {
  const calendar = new FullCalendar.Calendar(document.getElementById("calendar"), {
    initialView: "dayGridMonth",
    dateClick: function(info) {
      selectedDate = info.dateStr;
      openForm();
    },
    events: Object.keys(data).map(date => ({
      title: `${data[date].subjects.length} subjects`,
      date: date
    }))
  });
  calendar.render();
}

function openForm() {
  document.getElementById("entry-form").style.display = "block";
  document.getElementById("entry-date").innerText = selectedDate;
  const container = document.getElementById("subjects-container");
  container.innerHTML = "";

  const entry = data[selectedDate] || { subjects: [], note: "" };
  document.getElementById("daily-note").value = entry.note;

  entry.subjects.forEach((subj, i) => addSubjectEntry(subj));
  if (entry.subjects.length === 0) addSubjectEntry();
}

function addSubjectEntry(existing = {}) {
  const container = document.getElementById("subjects-container");
  const div = document.createElement("div");

  const subjectSelect = document.createElement("select");
  subjectSelect.innerHTML = subjectsList.map(s =>
    `<option value="${s}" ${s === existing.subject ? "selected" : ""}>${s}</option>`).join("");
  subjectSelect.onchange = function() {
    input.style.display = this.value === "Other" ? "inline-block" : "none";
  };

  const input = document.createElement("input");
  input.placeholder = "Custom Subject (if Other)";
  input.style.display = existing.subject === "Other" ? "inline-block" : "none";
  input.value = existing.custom || "";

  const topicInput = document.createElement("input");
  topicInput.placeholder = "Topic";
  topicInput.value = existing.topic || "";

  const hoursInput = document.createElement("input");
  hoursInput.type = "number";
  hoursInput.placeholder = "Hours";
  hoursInput.value = existing.hours || "";

  div.appendChild(subjectSelect);
  div.appendChild(input);
  div.appendChild(topicInput);
  div.appendChild(hoursInput);
  container.appendChild(div);
}

document.getElementById("study-form").addEventListener("submit", function(e) {
  e.preventDefault();
  const subjectDivs = document.querySelectorAll("#subjects-container > div");
  const subjects = [];

  subjectDivs.forEach(div => {
    const [select, custom, topic, hours] = div.children;
    const subject = select.value;
    const entry = {
      subject: subject,
      custom: subject === "Other" ? custom.value : "",
      topic: topic.value,
      hours: parseFloat(hours.value) || 0
    };
    subjects.push(entry);
  });

  data[selectedDate] = {
    subjects,
    note: document.getElementById("daily-note").value
  };
  localStorage.setItem("studyData", JSON.stringify(data));
  closeForm();
  location.reload(); // refresh to update calendar events
});

function closeForm() {
  document.getElementById("entry-form").style.display = "none";
}

function renderStats() {
  const stats = {};
  Object.values(data).forEach(entry => {
    entry.subjects.forEach(s => {
      const name = s.subject === "Other" ? s.custom : s.subject;
      stats[name] = (stats[name] || 0) + s.hours;
    });
  });

  // Table
  const tbody = document.querySelector("#stats-table tbody");
  tbody.innerHTML = "";
  for (let subject in stats) {
    let row = `<tr><td>${subject}</td><td>${stats[subject].toFixed(1)}</td></tr>`;
    tbody.innerHTML += row;
  }

  // Chart
  const ctx = document.getElementById("chart").getContext("2d");
  new Chart(ctx, {
    type: "bar",
    data: {
      labels: Object.keys(stats),
      datasets: [{
        label: "Hours",
        data: Object.values(stats),
        backgroundColor: "#4CAF50"
      }]
    },
    options: {
      scales: {
        y: { beginAtZero: true }
      }
    }
  });
}
