const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors({
  origin: 'https://cookie-testing.netlify.app',
  credentials: true,
  allowedHeaders: [
    'Accept',
    'Accept-Encoding',
    'Accept-Language',
    'Connection',
    'Content-Length',
    'Content-Type',
    'Host',
    'Origin',
    'Referer',
    'User-Agent',
    'Authorization'
    // Add any other required headers here
  ],
  exposedHeaders: [
    'Content-Length',
    'X-Content-Type-Options',
    'X-Powered-By',
    'X-Frame-Options',
    'Content-Security-Policy',
    'Strict-Transport-Security',
    'Date',
    'Connection',
    'Keep-Alive',
    'Transfer-Encoding',
    'Set-Cookie'
    // Add any other custom headers you want to expose here
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
  { id: 1, username: 'user1', password: 'password1' },
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
