
/*
  Class Attendance Dashboard
  - No Generate Data button
  - No random student generation
  - Fixed sample student list
  - Attendance status stays saved after refresh
*/

const students = [
  { roll: "ME001", name: "Aarav Sharma", status: "Present", attendance: 96 },
  { roll: "ME002", name: "Aditi Verma", status: "Present", attendance: 94 },
  { roll: "ME003", name: "Arjun Singh", status: "Absent", attendance: 82 },
  { roll: "ME004", name: "Ananya Gupta", status: "Present", attendance: 98 },
  { roll: "ME005", name: "Dev Patel", status: "Present", attendance: 91 },
  { roll: "ME006", name: "Diya Agarwal", status: "Present", attendance: 95 },
  { roll: "ME007", name: "Ishaan Kumar", status: "Absent", attendance: 79 },
  { roll: "ME008", name: "Kavya Mishra", status: "Present", attendance: 93 },
  { roll: "ME009", name: "Krishna Yadav", status: "Present", attendance: 89 },
  { roll: "ME010", name: "Meera Joshi", status: "Present", attendance: 97 },
  { roll: "ME011", name: "Mohit Chauhan", status: "Present", attendance: 88 },
  { roll: "ME012", name: "Neha Saxena", status: "Absent", attendance: 76 },
  { roll: "ME013", name: "Priya Tiwari", status: "Present", attendance: 92 },
  { roll: "ME014", name: "Rahul Kumar", status: "Present", attendance: 90 },
  { roll: "ME015", name: "Riya Sharma", status: "Present", attendance: 99 },
  { roll: "ME016", name: "Rohan Das", status: "Absent", attendance: 81 },
  { roll: "ME017", name: "Sana Khan", status: "Present", attendance: 94 },
  { roll: "ME018", name: "Vivek Jain", status: "Present", attendance: 87 }
];

const weeklyAttendance = [
  { day: "Mon", percent: 89 },
  { day: "Tue", percent: 94 },
  { day: "Wed", percent: 83 },
  { day: "Thu", percent: 96 },
  { day: "Fri", percent: 91 },
  { day: "Sat", percent: 86 }
];

const STORAGE_KEY = "attendly-attendance-v1";

let savedStatuses = {};

try {
  savedStatuses = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");

  if (
    !savedStatuses ||
    typeof savedStatuses !== "object" ||
    Array.isArray(savedStatuses)
  ) {
    savedStatuses = {};
  }
} catch (error) {
  savedStatuses = {};
}

function getStatus(student) {
  return savedStatuses[student.roll] || student.status;
}

function getInitials(name) {
  return name
    .split(" ")
    .map(part => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function renderDate() {
  const today = new Date();

  document.getElementById("todayDate").textContent =
    today.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric"
    });
}

function renderSummary() {
  const total = students.length;

  const present = students.filter(
    student => getStatus(student) === "Present"
  ).length;

  const absent = total - present;

  const rate = total
    ? Math.round((present / total) * 100)
    : 0;

  document.getElementById("totalStudents").textContent = total;
  document.getElementById("presentCount").textContent = present;
  document.getElementById("absentCount").textContent = absent;
  document.getElementById("attendanceRate").textContent = rate + "%";

  document.getElementById("donutPercent").textContent = rate + "%";
  document.getElementById("legendPresent").textContent = present;
  document.getElementById("legendAbsent").textContent = absent;

  document.getElementById("attendanceDonut").style.background =
    `conic-gradient(var(--green) ${rate * 3.6}deg, #f0f1f6 ${rate * 3.6}deg)`;
}

function renderWeeklyChart() {
  const chart = document.getElementById("weeklyChart");

  chart.innerHTML = weeklyAttendance.map(day => `
    <div class="bar-item" title="${day.day}: ${day.percent}%">
      <div class="bar-track">
        <div class="bar-fill" style="height: ${day.percent}%"></div>
      </div>
      <span class="bar-day">${day.day}</span>
    </div>
  `).join("");

  const highest = weeklyAttendance.reduce(
    (best, day) => day.percent > best.percent ? day : best,
    weeklyAttendance[0]
  );

  document.getElementById("highestDay").textContent =
    `${highest.day} · ${highest.percent}%`;

  document.getElementById("highestDetail").textContent =
    "Highest recorded attendance this week";
}

function renderStudents() {
  const query = document
    .getElementById("searchInput")
    .value
    .trim()
    .toLowerCase();

  const filter = document.getElementById("statusFilter").value;

  const filteredStudents = students.filter(student => {
    const matchesSearch =
      student.name.toLowerCase().includes(query) ||
      student.roll.toLowerCase().includes(query);

    const matchesStatus =
      filter === "All" || getStatus(student) === filter;

    return matchesSearch && matchesStatus;
  });

  const table = document.getElementById("studentTable");

  table.innerHTML = filteredStudents.map(student => {
    const status = getStatus(student);

    return `
      <tr>
        <td>${student.roll}</td>

        <td>
          <div class="student-name">
            <span class="student-avatar">${getInitials(student.name)}</span>
            ${student.name}
          </div>
        </td>

        <td>
          <span class="status-pill ${status.toLowerCase()}">
            ${status}
          </span>
        </td>

        <td>
          <div class="attendance-cell">
            <div class="progress">
              <span style="width: ${student.attendance}%"></span>
            </div>
            <span class="attendance-number">${student.attendance}%</span>
          </div>
        </td>
      </tr>
    `;
  }).join("");

  document.getElementById("emptyState").hidden =
    filteredStudents.length !== 0;

  document.getElementById("showingCount").textContent =
    `Showing ${filteredStudents.length} of ${students.length} students`;
}

document.getElementById("searchInput").addEventListener(
  "input",
  renderStudents
);

document.getElementById("statusFilter").addEventListener(
  "change",
  renderStudents
);

// Render the dashboard using fixed data.
renderDate();
renderSummary();
renderWeeklyChart();
renderStudents();
