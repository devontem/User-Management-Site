//configuration information
module.exports = {
    'port': process.env.PORT || 8000,
    'database': 'mongodb://localhost:27017/test',
    'superSecret': 'coLLecTionOFcharsRS' //for bcrypt
}