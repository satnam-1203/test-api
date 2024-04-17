const express = require('express');
const session = require('express-session');
const cors = require('cors'); // Import the cors package

const app = express();
const PORT = 3000;

// Configure CORS middleware
// Customize the origin based on your app's origin
app.use(cors({
    origin: 'http://localhost:3000', // Replace with the origin of your React app
    credentials: true, // Allow sending of cookies and session data
}));

// Configure headers middleware
// Apply global headers to all routes
app.use((req, res, next) => {
    // Add custom headers
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000'); // Customize the origin
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    
    // Continue to the next middleware or route handler
    next();
});

// Configure the session middleware
app.use(session({
    secret: 'your_secret_key', // Use a secret key to sign the session ID cookie
    resave: false, // Prevents resaving the session if it hasn't changed
    saveUninitialized: false, // Prevents saving uninitialized sessions
    cookie: {
        maxAge: 1000 * 60 * 10, // Session will expire after 10 minutes of inactivity
        secure: false, // Set to true if using HTTPS
        httpOnly: true, // Only allow the cookie to be accessed by the server
        sameSite: 'strict' // Control the inclusion of cookies in cross-origin requests
    },
}));

// Route to set a session variable and create a cookie
app.get('/create-cookie', (req, res) => {
    req.session.user = {
        id: 1,
        name: 'Alice',
    };
    res.send('Cookie created and session variable set!');
});

// Route to get the session variable from the cookie
app.get('/get-cookie', (req, res) => {
    if (req.session.user) {
        res.send(`User: ${req.session.user.name}`);
    } else {
        res.send('No session data found.');
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
