const sql = require('mssql');

// Create a SQL Server configuration object with your database connection details
const config = {
    user:"sk",
    password:"1234",
    server: 'SK\\SQLEXPRESS',
    database: 'nodejs1',
    options: {
      trustedConnection: false,
      port: 1433,
      encrypt: false
    },
    driver: 'tedious'
};

sql.connect(config)
  .then(() => {
    console.log('Connected to SQL Server database');
  })
  .catch((err) => {
    console.log(`Error connecting to SQL Server database: ${err}`);
  });
  
