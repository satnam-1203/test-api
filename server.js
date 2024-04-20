const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors({
  origin: 'https://cookie-testing.netlify.app',
    allowedHeaders: [
        'Content-Type',
        'Authorization',
        'Accept',
        'X-Requested-With',
        'X-API-Key',
        'X-HTTP-Method-Override',
        'Access-Control-Allow-Origin',
        'Access-Control-Allow-Methods',
        'Access-Control-Allow-Credentials',
        'Cookie',
    ],
    exposedHeaders: ["Set-Cookie"],
    credentials: true,
    optionsSuccessStatus: 200, // Ensure successful response for OPTIONS preflight
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Add the HTTP methods you want to allow
}));


app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    maxAge: 1000 * 60 * 60 * 24
  }
}));

// Dummy user data (replace with real database)
const users = [
  { id: 1, username: 'user', password: '123' },
  { id: 2, username: 'user2', password: 'password2' },
];

// Login route
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);
  if (user) {
    req.session.user = user;
    console.log(req.session.user);
    res.json({ success: true, message: 'Login successful' });
    console.log("ok");
  } else {
    res.status(401).json({ success: false, message: 'Invalid username or password' });
  }
});

// Logout route
app.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error('Error destroying session:', err);
      res.status(500).json({ success: false, message: 'Failed to logout' });
    } else {
      res.clearCookie('connect.sid', { path: '/' });
      res.json({ success: true, message: 'Logout successful' });
    }
  });
});

// Profile route (protected)
app.get('/profile', (req, res) => {
  if (req.session.user) {
    res.json({ success: true, user: req.session.user });
  } else {
    res.status(401).json({ success: false, message: 'Unauthorized' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
