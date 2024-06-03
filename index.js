const path = require('path');
const express = require('express') ;
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser')
require('dotenv').config();


const authRoutes = require('./routes/authRoutes');
const blogRoutes = require('./routes/blogRoutes');

const app = express() 

app.use(cookieParser()) 
// app.use(express.static('public'))
// // app.set('views', './views');
// app.set('view engine','ejs')

// app.use(express.static('public'))
app.use(express.static(path.join(__dirname, 'public')));
// app.set('views', './views');
app.set('views', path.join(__dirname, 'views'));
app.set('view engine','ejs')

app.use(express.urlencoded({extended:true})) ;
app.use(express.json());
// app.use(cookieParser);

// const dburl = 'mongodb+srv://vipul1:Test1234@nodetut.tqrfbx6.mongodb.net/Blog-auth?retryWrites=true&w=majority' ;
const dburl = process.env.MONGO_DB_URL ;
mongoose.set('strictQuery',true) ;

const port = process.env.PORT || 3069;
mongoose.connect(dburl) 
.then((result) => app.listen(3069)) // we want to listen for  after server is connected to mongodb
.catch((error) => console.log(error)) ;

app.get('/',(req,res)=>{
    res.redirect('/blogs') ;
})

app.use(blogRoutes);
app.use(authRoutes);


// app.get('/set-cookies',(req,res)=>{

//     // res.setHeader('Set-Cookie','newUser=true') ;
//     res.cookie('newUser',true,{httpOnly:true}) ;
//     // maxAge tells us age of the cookie
//     // secure - cookie is sent only with a secure connection like https
//     //
//     res.send('cookies sent') ;
// }) ;


// app.get('/read-cookies',(req,res)=>{
    
//     const cookies = req.cookies ;
//     console.log(cookies) ;
//     res.json(cookies) ;
// }) ;




