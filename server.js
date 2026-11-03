import express from "express";

const app = express();
const PORT = 3000;
const students = [
  {
    id: 101,
    name: "Rahul Sharma",
    email: "rahul@gmail.com",
    course: "CSE",
    age: 21,
  },
];

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Server is running on port 3000" });
});

app.post("/api/student", (req, res) => {
  const student = req.body;

  if (!student || typeof student !== "object" || Array.isArray(student)) {
    return res.status(400).json({ message: "Student details are required." });
  }

  const { id, name, email, age, course } = student;

  if (
    id === undefined ||
    id === null ||
    name === undefined ||
    email === undefined ||
    age === undefined ||
    course === undefined
  ) {
    return res.status(400).json({
      message: "Mandatory fields: id, name, email, age, course are required.",
    });
  }

  const studentId = Number(id);

  if (Number.isNaN(studentId)) {
    return res.status(400).json({ message: "Student id must be a number." });
  }

  const duplicateStudent = students.some((s) => Number(s.id) === studentId);

  if (duplicateStudent) {
    return res.status(409).json({ message: `Duplicate student id: ${studentId}` });
  }

  const newStudent = {
    id: studentId,
    name,
    email,
    age,
    course,
  };

  students.push(newStudent);

  return res.status(201).json({
    message: "Student record created successfully",
    student: newStudent,
    allStudents: students,
  });
});

app.get("/api/students", (req, res) => {
  res.json({ students });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});