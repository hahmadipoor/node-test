const express=require('express');
const mongoose=require('mongoose');
const { MONGO_USER, MONGO_PASSWORD, MONGO_IP, MONGO_PORT,REDIS_URL,REDIS_PORT,SESSION_SECRET} = require('./config/config');
const postRouter=require("./routes/postRoutes");
const userRouter=require("./routes/userRoutes");
const app=express();
const mongoURL=`mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_IP}:${MONGO_PORT}/?authSource=admin`;
const os=require('os');
const session = require("express-session");
const redis = require("redis");
let RedisStore = require("connect-redis")(session);
const cors=require('cors');

let redisClient = redis.createClient({
    host: REDIS_URL,
    port: REDIS_PORT,
  });

const connectWithRetry=()=>{
    mongoose
    .connect(mongoURL,{
        useNewUrlParser:true,
        useUnifiedTopology:true
    })
    .then(()=>console.log("Successfully connected to database"))
    .catch((e)=>{
        console.log(e);
        setTimeout(connectWithRetry,5000);
    })       
}

connectWithRetry();

const port=process.env.PORT || 3000;

app.enable('trust proxy');
app.use(cors());
app.use(
    session({
      store: new RedisStore({ client: redisClient }),
      secret: SESSION_SECRET,
      cookie: {
        secure: false,
        resave: true,
        saveUninitialized: true,
        httpOnly: true,
        maxAge: 60000,
      },
    })
  );
app.use(express.json());

app.get("/api",(req,res)=>{
    console.log("hello from "+os.hostname());
    res.send("<h2>Hi There<h2>")
})

app.use("/api/v1/posts",postRouter);
app.use("/api/v1/users",userRouter);

app.listen(port,()=>{
    console.log(`listening on port ${port}`);
});



