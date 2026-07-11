const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());
app.use(morgan('dev'));
app.use('/uploads', express.static('uploads'));
app.use('/api/realjobs', require('./routes/realjobs'));
// Routes
app.use('/api/auth',    require('./routes/auth'));
app.use('/api/jobs',    require('./routes/jobs'));
app.use('/api/screen',  require('./routes/screen'));
app.use('/api/apply',   require('./routes/applications'));

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok', message: 'TalentAI API running' }));

// Connect MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(process.env.PORT || 5000, () => {
      console.log(`🚀 Server running on port ${process.env.PORT || 5000}`);
    });
  })
  .catch(err => { console.error('❌ MongoDB error:', err); process.exit(1); });
