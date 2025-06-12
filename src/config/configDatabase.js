const mongoose = require('mongoose');
require('../models/User');
require('../models/Data');//TODO import real data model


async function configDatabase() {
    //TODO set database name
    const connectionsString = 'mongodb://localhost:27017/exam-db';

    await mongoose.connect(connectionsString, {
        useUnifiedTopology: true
    });

    console.log('Database connected');
};

module.exports = { configDatabase };