const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();
dotenv.config();

const orderRoutes = require('./Routes/orderRoutes');


app.use(cors());
app.use(express.json());

app.use('/api/orders', orderRoutes);

connectDB();

const PORT = process.env.ORDER_SERVICE_PORT || 5005;

app.listen(PORT, () => console.log(`Order Service started on port http://localhost:${PORT}`));
