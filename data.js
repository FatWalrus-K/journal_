function getEntry(date) {
  const json = localStorage.getItem("entry_" + date);
  return json ? JSON.parse(json) : null;
}
function saveEntry(date, data) {
  localStorage.setItem("entry_" + date, JSON.stringify(data));
}
function getAllEntries() {
  const data = [];
  for (let key in localStorage) {
    if (key.startsWith("entry_")) {
      data.push({ date: key.replace("entry_", ""), ...JSON.parse(localStorage[key]) });
    }
  }
  return data;
}