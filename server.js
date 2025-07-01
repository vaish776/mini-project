const express = require('express');
const { MongoClient } = require('mongodb');
const path = require('path');
const app = express();
const PORT = 3000;

// MongoDB connection
const uri = 'mongodb://127.0.0.1:27017';
const client = new MongoClient(uri);
const dbName = 'examSystem';

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Grade calculation
function calculateGrade(marks) {
  if (marks == null) return 'N/A';
  if (marks >= 90) return 'A+';
  if (marks >= 80) return 'A';
  if (marks >= 70) return 'B+';
  if (marks >= 60) return 'B';
  if (marks >= 50) return 'C';
  if (marks >= 40) return 'D';
  return 'F';
}

function getOverallGrade(grades) {
  const weights = {
    'A+': 10, 'A': 9, 'B+': 8, 'B': 7,
    'C': 6, 'D': 5, 'F': 0
  };
  const total = grades.reduce((sum, g) => sum + (weights[g] || 0), 0);
  const avg = total / grades.length;
  if (avg >= 9.5) return 'A+';
  if (avg >= 8.5) return 'A';
  if (avg >= 7.5) return 'B+';
  if (avg >= 6.5) return 'B';
  if (avg >= 5.5) return 'C';
  if (avg >= 4.5) return 'D';
  return 'F';
}

// Get result by student ID
app.get('/api/result/:studentId', async (req, res) => {
  try {
    const studentId = parseInt(req.params.studentId);
    await client.connect();
    const db = client.db(dbName);
    const students = db.collection('students');

    const student = await students.findOne({ studentId });
    if (!student) {
      return res.status(404).json({ error: 'Student not found.' });
    }

    res.json(student);
  } catch (err) {
    console.error('Error fetching result:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Register a new student
app.post('/api/register', async (req, res) => {
  try {
    const { studentId, name, email, subjects } = req.body;

    if (!studentId || !name || !email || !Array.isArray(subjects)) {
      return res.status(400).json({ error: 'Student ID, name, email, and subjects are required.' });
    }

    await client.connect();
    const db = client.db(dbName);
    const students = db.collection('students');

    // Check if student already exists
    const existing = await students.findOne({ studentId });
    if (existing) {
      return res.status(400).json({ error: 'Student with this ID already exists.' });
    }

    // Process subjects
    const gradedSubjects = subjects.map(sub => {
      const marks = sub.marks !== '' && sub.marks != null ? Number(sub.marks) : null;
      const grade = calculateGrade(marks);
      return {
        name: sub.name || 'Unknown',
        marks,
        grade
      };
    });

    const validGrades = gradedSubjects
      .filter(s => s.grade !== 'N/A')
      .map(s => s.grade);

    const overallGrade = validGrades.length > 0
      ? getOverallGrade(validGrades)
      : 'N/A';

    // Save student
    await students.insertOne({
      studentId,
      name,
      email,
      subjects: gradedSubjects,
      overallGrade
    });

    res.json({ message: 'Student registered successfully' });
  } catch (err) {
    console.error('Error registering student:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
