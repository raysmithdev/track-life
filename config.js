'use strict';

const DATABASE_URL = process.env.DATABASE_URL || 
                    global.DATABASE_URL ||
                    'mongodb://localhost/track-life';

exports.PORT = process.env.PORT || 8080;
