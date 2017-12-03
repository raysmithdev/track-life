const DATABASE_URL = process.env.DATABASE_URL || 
                    global.DATABASE_URL ||
                    'mongodb://localhost/track-life';

const TEST_DATABASE_URL = process.env.TEST_DATABASE_URL ||
                          'mongodb://localhost/test-track-life';

const PORT = process.env.PORT || 8080;
const JWT_SECRET = 'trackyolife';
const JWT_EXPIRY = process.env.JWT_EXPIRY || '3d';

module.exports = {DATABASE_URL, JWT_EXPIRY, JWT_SECRET, PORT, TEST_DATABASE_URL};