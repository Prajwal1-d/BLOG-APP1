const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const connectDB = require('./db')
const PORT = 5000;
const Router = require('./routes/route.js')

dotenv.config()





const app = express();
// const PORT = process.env.PORT || 5000;;
app.use(cors());
app.use(express.json());
app.use('/', Router);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
//register
app.get('/register', (req, res) => {
    res.send('Register');
})
//login
app.get('/login', (req, res) => {
    res.send('Login');
})

connectDB();
