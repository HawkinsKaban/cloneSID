const express = require('express');
const mongoose = require('mongoose');
const app = express();
const cors = require('cors');
const axios = require('axios');

app.use(cors());

// env
require('dotenv').config();

app.use('/upload',express.static('upload')); 

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API
const api = require('./api/index');
app.use('/api/v1', api); 
mongoose.set('debug', true);

// connect to mongodb
mongoose.connect(process.env.DATABASE);

const db = mongoose.connection; 
db.on('error', (err) => {
  console.error('Kesalahan koneksi MongoDB BE ASPIRASI:', err);
});

db.once('open', () => {
  console.log('BE ASPIRASI Terkoneksi ke Database ....',);
});


// use static file
app.use('/assets', express.static('assets'));

module.exports = app;
