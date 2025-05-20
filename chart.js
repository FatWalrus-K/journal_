function showStats() {
  const data = getAllEntries();
  const dailyHours = {};
  const subjectHours = {};
  data.forEach(entry => {
    const total = entry.subjects.reduce((sum, s) => sum + s.hours, 0);
    dailyHours[entry.date] = total;
    entry.subjects.forEach(s => {
      subjectHours[s.name] = (subjectHours[s.name] || 0) + s.hours;
    });
  });

  const labels = Object.keys(subjectHours);
  const values = labels.map(k => subjectHours[k]);

  const ctx = document.getElementById("statsChart").getContext("2d");
  if (window.myChart) window.myChart.destroy();
  window.myChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [{ label: 'Total Hours', data: values, backgroundColor: '#4B352A' }]
    }
  });

  const table = document.getElementById("statsTable");
  table.innerHTML = "<table><tr><th>Date</th><th>Total Hours</th></tr>" + Object.entries(dailyHours)
    .map(([d, h]) => \`<tr><td>\${d}</td><td>\${h}</td></tr>\`).join("") + "</table>";
}