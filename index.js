const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'users.json');

app.use(express.json());

function readUsers() {
  const data = fs.readFileSync(DATA_FILE, 'utf-8');
  return JSON.parse(data);
}

function writeUsers(users) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(users, null, 2));
}

app.get('/', (req, res) => {
  res.json({ message: 'Simple User API is running' });
});

app.get('/users', (req, res) => {
  const users = readUsers();
  res.status(200).json({
    success: true,
    data: users
  });
});

app.get('/users/:id', (req, res) => {
  const users = readUsers();
  const user = users.find(u => u.id === parseInt(req.params.id));

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  res.status(200).json({
    success: true,
    data: user
  });
});

app.post('/users', (req, res) => {
  const { name, email } = req.body;

  if (!name || typeof name !== 'string' || name.trim() === '') {
    return res.status(400).json({
      success: false,
      message: 'Name is required and must be a non-empty string'
    });
  }

  if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({
      success: false,
      message: 'A valid email is required'
    });
  }

  const users = readUsers();
  const newUser = {
    id: users.length > 0 ? users[users.length - 1].id + 1 : 1,
    name: name.trim(),
    email: email.trim()
  };

  users.push(newUser);
  writeUsers(users);

  res.status(201).json({
    success: true,
    data: newUser
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});