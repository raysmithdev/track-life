'use strict';

const DATABASE_URL = process.env.DATABASE_URL || 
                    global.DATABASE_URL ||
                    'mongodb://localhost/track-life';

const PORT = process.env.PORT || 8080;
const JWT_SECRET = 'trackyolife';
const JWT_EXPIRY = process.env.JWT_EXPIRY || '1d';

module.exports = {DATABASE_URL, PORT, JWT_EXPIRY, JWT_SECRET};