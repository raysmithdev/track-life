const DATABASE_URL = process.env.DATABASE_URL || 
                    global.DATABASE_URL ||
                    'mongodb://localhost/track-life-test2';

const TEST_DATABASE_URL = process.env.TEST_DATABASE_URL ||
                          'mongodb://localhost/test-track-life2';

const PORT = process.env.PORT || 8080;
const JWT_SECRET = 'trackyolife';
const JWT_EXPIRY = process.env.JWT_EXPIRY || '3d';

const demoUser = {
  userName: process.env.userName,
  password: process.env.password
}

module.exports = {DATABASE_URL, JWT_EXPIRY, JWT_SECRET, PORT, TEST_DATABASE_URL, demoUser};