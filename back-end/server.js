const express = require('express');
const app = express();

// 📌 Middleware để xử lý JSON
app.use(express.json());

// 📌 Kết nối MongoDB
const connectDB = require('./config/db');
connectDB();

const cors = require('cors');
app.use(cors());


const userRoutes = require('./src/routers/user.router');
app.use('/api/users', userRoutes);


const captchaRoutes = require('./src/routers/captcha.router');
app.use('/api', captchaRoutes);


app.get('/', async(req, res)=>{
    try {
        res.send({message: 'Welcome to Practical Exam!'});
    } catch (error) {
        res.send({error: error.message});
    }
});

const PORT = process.env.PORT || 9999;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));