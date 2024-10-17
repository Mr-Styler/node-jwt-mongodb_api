require("dotenv").config({ path: './config.env'})
const mongoose = require("mongoose")
const server = require('./app');

const DBI = process.env.MONGO_URI || "mongodb://localhost:27017/testDB"
const port = process.env.PORT || 3000;


mongoose.connect(DBI)
    .then(() => server.listen(port, () => console.log('API is active...')))
    .catch(err => console.error(err));


// Optional: Close the connection when done
process.on('SIGINT', async () => {
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
    process.exit(0);
  });
