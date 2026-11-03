import express from "express";

const app = express();
const PORT = 3000;
const students = [
  {
    id: 101,
    name: "Rahul sharma",
    Email: "rahul@gmail.com",
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

app.get("/api/students/:id", (req, res) => {
  const studentId = Number(req.params.id);

  if (!Number.isInteger(studentId)) {
    return res.status(400).json({ message: "Student id must be an integer." });
  }

  const student = students.find((record) => record.id === studentId);

  if (!student) {
    return res.status(404).json({ message: `Student with id ${studentId} not found.` });
  }

  return res.json({ student });
});

app.put(["/api/student/:id", "/api/students/:id"], (req, res) => {
  const studentId = Number(req.params.id);

  if (!Number.isInteger(studentId)) {
    return res.status(400).json({ message: "Student id must be an integer." });
  }

  const studentIndex = students.findIndex((record) => record.id === studentId);

  if (studentIndex === -1) {
    return res.status(404).json({ message: `Student with id ${studentId} not found.` });
  }

  const student = req.body;

  if (!student || typeof student !== "object" || Array.isArray(student)) {
    return res.status(400).json({ message: "Student details are required." });
  }

  const { name, email, age, course } = student;

  if (
    name === undefined ||
    email === undefined ||
    age === undefined ||
    course === undefined
  ) {
    return res.status(400).json({
      message: "Mandatory fields: name, email, age, course are required.",
    });
  }

  if (student.id !== undefined && Number(student.id) !== studentId) {
    return res.status(400).json({
      message: "Student id in the request body must match the URL id.",
    });
  }

  const updatedStudent = { id: studentId, name, email, age, course };
  students[studentIndex] = updatedStudent;

  return res.json({
    message: "Student record updated successfully",
    student: updatedStudent,
  });
});

app.delete(["/api/student/:id", "/api/students/:id"], (req, res) => {
  const studentId = Number(req.params.id);

  if (!Number.isInteger(studentId)) {
    return res.status(400).json({ message: "Student id must be an integer." });
  }

  const studentIndex = students.findIndex((record) => record.id === studentId);

  if (studentIndex === -1) {
    return res.status(404).json({ message: `Student with id ${studentId} not found.` });
  }

  const [deletedStudent] = students.splice(studentIndex, 1);

  return res.status(200).json({
    message: `Student with id ${studentId} deleted successfully.`,
    student: deletedStudent,
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});