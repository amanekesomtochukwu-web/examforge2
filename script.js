let quizzes = [];

// FETCH DATA FROM GOOGLE SHEETS
async function fetchQuizzes() {
  const url = "https://opensheet.elk.sh/1Sstdi4QFwhHR8PnQOTIz1V_HPD9LNtZKJX5k9qAYhTU/Sheet1";

  try {
    const res = await fetch(url);
    const data = await res.json();

    quizzes = data.map(item => ({
      subject: item.Subject,
      title: item.Title,
      link: item.Link,
      date: item.Date
    }));

    loadNewQuizzes();
    loadSubjects();

  } catch (err) {
    console.error("Error:", err);
  }
}

// NEW QUIZZES
function loadNewQuizzes() {
  const container = document.getElementById("newQuizzes");
  container.innerHTML = "";

  const sorted = [...quizzes].sort((a, b) => new Date(b.date) - new Date(a.date));

  sorted.slice(0, 3).forEach(q => {
    container.innerHTML += `
      <div class="quiz-card">
        <span>${q.title} (${q.subject})</span>
        <a href="${q.link}" target="_blank">Start</a>
      </div>
    `;
  });
}

// SUBJECT DROPDOWN
function loadSubjects() {
  const container = document.getElementById("subjectsContainer");
  container.innerHTML = "";

  const subjects = [...new Set(quizzes.map(q => q.subject))];

  subjects.forEach(subject => {
    const subjectDiv = document.createElement("div");
    subjectDiv.className = "subject";

    const filtered = quizzes.filter(q => q.subject === subject);

    subjectDiv.innerHTML = `
      <div class="subject-header" onclick="toggleDropdown(this)">
        ${subject} ▼
      </div>

      <div class="dropdown">
        ${filtered.map(q => `
          <div class="quiz-card">
            <span>${q.title}</span>
            <a href="${q.link}" target="_blank">Start</a>
          </div>
        `).join("")}
      </div>
    `;

    container.appendChild(subjectDiv);
  });
}

// TOGGLE
function toggleDropdown(el) {
  const drop = el.nextElementSibling;

  document.querySelectorAll(".dropdown").forEach(d => {
    if (d !== drop) d.style.display = "none";
  });

  drop.style.display = drop.style.display === "block" ? "none" : "block";
}

// START APP
fetchQuizzes();