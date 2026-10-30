const express = require('express');
// const app = express();
const dotenv = require('dotenv');
const connectDb = require('./config/db');
const authRouter = require('./routes/auth.routes');
const userRouter = require('./routes/user.routes')
const messageRouter = require('./routes/message.routes')
const cookieParser = require('cookie-parser');
dotenv.config()
const cors = require('cors');
const { app, server } = require('./socket/socket');
const port = process.env.PORT || 8000;
app.set('trust proxy', 1);

const allowedOrigins = [
    'http://localhost:5173',
    'https://chatnest-0tvr.onrender.com'
];
app.use(cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(cookieParser());
app.use('/api/auth', authRouter);
app.use('/api/user',userRouter);
app.use('/api/message',messageRouter)

server.listen(port, () => {
    connectDb();
    console.log(`Server is running on ${port}`)
})