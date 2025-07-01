// Navigation section switching
document.querySelectorAll('nav ul li a').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    document.querySelectorAll('.content-section').forEach(sec => sec.classList.remove('active'));
    const sectionId = e.target.getAttribute('data-section');
    document.getElementById(sectionId).classList.add('active');
  });
});

// Fetch result by student ID
document.getElementById('resultForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const studentId = document.getElementById('studentId').value;
  const resultContainer = document.getElementById('result');
  try {
    const response = await fetch(`/api/result/${studentId}`);
    const data = await response.json();
    if (response.ok) {
      let html = `
        <h2>📋 Exam Results</h2>
        <p><strong>Name:</strong> ${data.name}</p>
        <p><strong>ID:</strong> ${data.studentId}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Overall Grade:</strong> ${data.overallGrade}</p>
        <h3>Subjects:</h3>
        <ul>
      `;
      data.subjects.forEach(subject => {
        html += `<li>${subject.name}: ${subject.marks ?? 'N/A'} (Grade: ${subject.grade})</li>`;
      });
      html += '</ul>';
      resultContainer.innerHTML = html;
    } else {
      resultContainer.innerHTML = `<p style="color:red;"><strong>${data.error}</strong></p>`;
    }
  } catch (err) {
    resultContainer.innerHTML = `<p style="color:red;"><strong>Error fetching result.</strong></p>`;
  }
});

// Add new subject fields
document.getElementById('addSubjectBtn').addEventListener('click', () => {
  const container = document.getElementById('subjectFields');
  const div = document.createElement('div');
  div.className = 'subject-entry';
  div.innerHTML = `
    <input type="text" class="subject-name" placeholder="Subject Name" required />
    <input type="number" class="subject-marks" placeholder="Marks (optional)" />
  `;
  container.appendChild(div);
});

// Register student
document.getElementById('registrationForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const studentId = parseInt(document.getElementById('regStudentId').value);
  const name = document.getElementById('regName').value;
  const email = document.getElementById('regEmail').value;

  const subjectEntries = document.querySelectorAll('.subject-entry');
  const subjects = [];
  subjectEntries.forEach(entry => {
    const name = entry.querySelector('.subject-name').value;
    const marks = entry.querySelector('.subject-marks').value;
    subjects.push({
      name,
      marks: marks ? parseInt(marks) : null
    });
  });

  try {
    const response = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ studentId, name, email, subjects })
    });
    const result = await response.json();
    const messageContainer = document.getElementById('registerMessage');
    if (response.ok) {
      messageContainer.innerHTML = `<p style="color:green;"><strong>${result.message}</strong></p>`;
      document.getElementById('registrationForm').reset();
      document.getElementById('subjectFields').innerHTML = `
        <div class="subject-entry">
          <input type="text" class="subject-name" placeholder="Subject Name" required />
          <input type="number" class="subject-marks" placeholder="Marks (optional)" />
        </div>
      `;
    } else {
      messageContainer.innerHTML = `<p style="color:red;"><strong>${result.error}</strong></p>`;
    }
  } catch (error) {
    console.error('Registration Error:', error);
  }
});
