const express = require('express')
const app = express()
const connectDb = require('./config/database')
const cookieParser = require('cookie-parser')
const auth=require('./routes/auth')
const profile=require('./routes/profile')
const request=require('./routes/request')
const userRoute=require('./routes/user')
const chatRoute=require('./routes/chat')
const cors=require('cors')
const http=require('http')
const initializeSocket = require('./utils/socket')


require('dotenv').config()

app.use(cors({
    origin: process.env.FRONTEND_ORIGIN,
    credentials: true
}))
app.use(cookieParser())
// cookie parser is used to parse the cookies in the request
// it is used to access the cookies in the request object

app.use(express.json())
// express.json() is used to parse the json data in the request body
// it is used to access the json data in the request body


app.use('/',auth)
app.use('/',profile)
app.use('/',request)
app.use('/',userRoute)
app.use('/',chatRoute)


const server=http.createServer(app)
initializeSocket(server)


connectDb()
    .then(() => {
        console.log("Db connection successfull");
        server.listen(process.env.PORT, () => {
            console.log("Listening at PORT "+process.env.PORT);
        })

    })
    .catch((err) => {
        console.log("Db connection failed :", err);
    })
