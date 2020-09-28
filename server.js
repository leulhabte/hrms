const http = require('http');
const mongoose = require('mongoose');
const app = require('./app');
const dotenv = require('dotenv');

dotenv.config();

const PORT = process.env.PORT || 5000;

mongoose.connect(`mongodb+srv://hrms:${process.env.DB_PASS}@cluster0.d9gzm.mongodb.net/hr?retryWrites=true&w=majority`, {useUnifiedTopology: true, useNewUrlParser: true})
    .then(()=> console.log('connected...'))
    .catch((err)=> console.log(err.message));

const server = http.createServer(app);

server.listen(PORT, ()=>{console.log('Server running on port '+PORT)});