const express= require('express');
const connectToMongo=require('./database');
const morgan=require('morgan');
const cors=require('cors');
const bodyParser=require('body-parser');
require('dotenv').config();

connectToMongo();

const app=express();

//import routes
const authRoutes=require('./routes/auth');
const userRoutes=require('./routes/user');

//app middlewares
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(cors());
if(process.env.NODE_ENV='development'){
    app.use(cors({origin:'http://localhost:3000'}))
}


//middlewares
app.use('/api',authRoutes);
app.use('/api',userRoutes);

const port =process.env.PORT|| 8000
app.listen(port,()=>{
    console.log(`API is running on port ${port}`);
});