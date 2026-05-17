const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const documentRoutes = require('./routes/documentRoutes');
const aiRoutes = require('./routes/aiRoutes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true }));

// Routes
app.use('/api', documentRoutes);
app.use('/api/ai', aiRoutes);

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('Global error handler:', err);
  
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ error: 'File too large. Maximum limit is 100MB.' });
  }
  
  res.status(err.status || 500).json({ 
    error: err.message || 'Internal Server Error' 
  });
});

// Root route
app.get('/', (req, res) => {
  res.send('Document Cloud API is running...');
});

const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

server.timeout = 300000; // 5 minutes
