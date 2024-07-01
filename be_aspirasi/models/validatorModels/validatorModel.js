const mongoose = require('mongoose');

const validator = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
    aspirasi: [{ type: mongoose.Schema.Types.ObjectId, ref: 'aspirasi' }],
},{timestamps: true});
