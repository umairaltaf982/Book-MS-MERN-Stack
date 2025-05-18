const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const userRoutes = require('./Routes/userRoutes');
const adminRoutes = require('./Routes/adminRoute');
const bookRoutes = require('./Routes/bookRoute');
const connectDB = require('./config/db');

const app = express();
dotenv.config();

app.use(cors());
app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/books', bookRoutes);

connectDB();

const PORT = process.env.PORT || 5005;

app.listen(PORT, () => console.log(`Server started on port http://localhost:${PORT}`));
