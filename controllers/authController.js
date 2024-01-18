const User = require('../models/user.js')
const jwt = require('jsonwebtoken') 

// handle errors
const ErrorHandler = (err) => {
    console.log(err.message, err.code);
    let errors = { email: '', password: '' };
    
    // incorrect email
    if(err.message === 'Incorrect Email')
    {
      errors.email = 'Email entered is not registered' ;
    }
    // incorrect password
    if(err.message === 'Incorrect Password')
    {
      errors.password = 'Incorrect Password' ;
    }
    // duplicate email error
    if (err.code === 11000) {
      errors.email = 'Email is already registered';
      return errors;
    }
  
    // validation errors
    if (err.message.includes('users validation failed')) {
      // console.log(err);
      Object.values(err.errors).forEach(({ properties }) => {
        // console.log(val);
        // console.log(properties);
        errors[properties.path] = properties.message;
      });
    }
  
    return errors;
  }

  const maxAge = 60 * 60 ;
  const createToken = (id) => {
    return jwt.sign({id},'Key Secret',{expiresIn : maxAge}) ;
  }

module.exports.signup_get = (req,res) => {

    res.render('signup')
}

module.exports.login_get = (req,res) => {

    res.render('login')
}

module.exports.signup_post = async (req,res) => {
    
 
    console.log(req.body) ;
    const user = new User(req.body) ;

    // user.save()
    // .then((result)=>{
    //     console.log('User created Successfully');
    //     // res.status(201).json(user);
    //     res.redirect('/blogs')
    // })
    // .catch((error) =>{
    //      console.log(error) 
    //     const err = ErrorHandler(error);
    //     res.status(400).json({err}) ;
    // })

    try {
      const result = await user.save() ;
      // console.log(user.email) ;
      const token = createToken(user._id) ;
      res.cookie('jwt',token,{HttpOnly:true , maxAge:maxAge * 1000}) ;
       res.status(201).json({user:user._id})
      //  res.redirect('/blogs') ;

    } catch (error) {
       const err = ErrorHandler(error) ;
        res.status(400).json({err}) ;
    }
    
}

module.exports.login_post = async (req,res) => {
   
     const { email,password }  = req.body ;

     try {

      const user = await User.login(email, password) ;
      
      const token = createToken(user._id) ;
      res.cookie('jwt',token,{HttpOnly:true , maxAge:maxAge * 1000}) ;
     
      res.status(200).json({user:user._id}) ;

      
     } catch (error) {

      const err = ErrorHandler(error) ;
      res.status(400).json({err}) ;
     }
}

module.exports.logout_get = (req,res) => {
      
    res.cookie('jwt','',{maxAge : 1}) ;
    res.redirect('/') ;
}