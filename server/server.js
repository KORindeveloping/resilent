const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const documentRoutes = require('./routes/documentRoutes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', documentRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('Document Cloud API is running...');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
