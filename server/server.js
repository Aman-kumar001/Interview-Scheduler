require('dotenv').config();
const express = require('express');
const app = express();
const connectDB = require('./config/db');
const cors = require('cors');

// Accessing routes
const user = require('./routes/user_routes');
const interview = require('./routes/interview_routes');

// Connect database
connectDB();

// cors
app.use(cors({ origin: true, credentials: true }));

// Initialize middleware
app.use(express.json({ extended: false }));
app.get('/', (req, res) => res.send('Server up and running'));

// use routes
app.use('/api/user', user);
app.use('/api/interview', interview);

// setting up port
const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
	console.log(`server is running on http://localhost:${PORT}`);
});
