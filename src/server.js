const app = require('./app');
const connectDB = require('./config/database');
const dotenv = require('dotenv');

dotenv.config();

// Connect to Database
connectDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});
