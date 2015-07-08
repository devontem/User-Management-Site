//configuration information
module.exports = {
    'port': process.env.PORT || 8000,
    'database': 'mongodb://admin:admin1@ds047682.mongolab.com:47682/heroku_jnwcdmrc',
    'superSecret': 'coLLecTionOFcharsRS' //for bcrypt
}