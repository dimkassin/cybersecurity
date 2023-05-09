const express = require('express');
const mongoose = require('mongoose');
const User = require('./models/User');
const port = process.env.PORT || 3002;

const app = express();
app.use(express.json());

// Enable CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

async function createTestUsers() {
  const userCount = 20;
  const users = [];
  /*
  for (let i = 1; i <= userCount; i++) {
    users.push({
      username: `User${i}`,
      category1: Math.floor(Math.random() * 40) + 1,
      category2: Math.floor(Math.random() * 40) + 1,
      category3: Math.floor(Math.random() * 40) + 1,
    });
  }

  for (const userData of users) {
    try {
      const newUser = new User(userData);
      await newUser.save();
      console.log(`Created user: ${newUser.username}`);
    } catch (error) {
      console.log(`Error creating user: ${userData.username}`, error);
    }
  }
  */
}

// Подключение к MongoDB с увеличенным таймаутом подключения
mongoose.connect('mongodb+srv://tester:12345@cybersecurity.xtladon.mongodb.net/cybersecurity?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true, serverSelectionTimeoutMS: 60000 });

mongoose.connection.once('open', () => {
  console.log('Connected to MongoDB');
  createTestUsers(); // Вызов функции createTestUsers
});

// Получение рейтинга всех пользователей
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find().sort({ category1: -1, category2: -1, category3: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Получение информации о конкретном пользователе
app.get('/api/users/:username', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Создание нового пользователя
app.post('/api/users', async (req, res) => {
  try {
    const newUser = new User(req.body);
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Запуск сервера на порту 3002
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});