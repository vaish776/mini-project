 Sreyas Exam Notifications Portal
A full-stack web application to register students, manage exam results, and allow students to check their results online. The portal also sends result summaries to students via email upon registration.
Tech Stack
•	Frontend: HTML, CSS, JavaScript
•	Backend: Node.js with Express
•	Database: MongoDB (using MongoDB native driver)
•	Email Integration: Nodemailer
•	Environment Configuration: dotenv
 Folder Structure
project/
├── public/
│   ├── index.html
│   ├── style.css
│   └── script.js
├── server.js
├── .env
└── README.md
 Installation & Setup
1. Clone the repository
git clone https://github.com/your-username/sreyas-exam-portal.git
cd sreyas-exam-portal
2. Install dependencies
npm install
3. Setup .env file
Create a .env file in the root with the following:
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_app_password
Make sure to use an app-specific password if using Gmail with 2FA.
Start the App
node server.js
Open in browser: http://localhost:3000
MongoDB Setup
•	Ensure MongoDB is running locally.
•	MongoDB URI used: mongodb://127.0.0.1:27017
•	Database: examSystem
•	Collections: students, results
Features
•	Register new students with subjects and optional marks.
•	Automatically calculates subject-wise and overall grades.
•	Stores data in MongoDB.
•	Sends result summary email on successful registration.
•	Allows students to check their results via student ID.
 Sample Registration Input
{
  "studentId": 123,
  "name": "John Doe",
  "email": "john@example.com",
  "subjects": [
    { "name": "Math", "marks": 85 },
    { "name": "Physics", "marks": 78 }
  ]
}
Sample Email Output
Hello John Doe,

You have been registered successfully.

Your Overall Grade: B+

Subjects:
- Math: 85 (Grade: A)
- Physics: 78 (Grade: B+)

Regards,
Sreyas Exam Office
 How to Use
Register Student
•	Go to Register section.
•	Enter student ID, name, email, and subjects.
•	Click Register Student.
•	On success, a message and confirmation email are sent.
View Results
•	Go to Results section.
•	Enter student ID and click Get Result.
•	View subject marks and overall grade.
Support
Email: examoffice@sreyas.edu
