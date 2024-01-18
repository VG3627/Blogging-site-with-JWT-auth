const Blog = require('../models/blog.js') ;
const User = require('../models/user.js') ;

const jwt = require('jsonwebtoken') ;




module.exports.blogs_get = (req,res) =>{
    Blog.find().sort({createdAt:-1})
    .then((result)=>{
        
        res.render('blogs',{title:'All blogs',blogs:result}) ;
    })
    .catch((error)=>{
        console.log(error) ;
    })
} ;


module.exports.blogs_post = (req,res) =>{

    const {title,snippet,body} = req.body ;

    const token = req.cookies.jwt ;
    
    if(token)
    {
        jwt.verify(token,'Key Secret',async (err,decodedToken) => {
        if(err)
        {
            console.log(err) ;
            res.redirect('/login') ;
        }
        else
        {
            let user = await User.findById(decodedToken.id) ;
            const userId = user.email ;
            console.log(userId) ;
            const blog = new Blog({
                title,
                snippet,
                body,
                authorMail: userId
            }) ;
            blog.save()
            .then((result)=>{
                res.redirect('/blogs') ;
            })
            .catch((error) =>{
                console.log(error) ;
            })
        }

       })
    }
    else
    {
        res.redirect('/login') ;
    }

    // console.log(req.body) ;
    
};

module.exports.about_get = (req,res) =>{
    res.render('about',{title:'About'}) 
};


module.exports.create_get = (req,res) =>{
    res.render('create',{title:'Create a blog'})
};


module.exports.blogsid_get = (req,res) =>{
    const id = req.params.id ;
    Blog.findById(id)
    .then((result) =>{
       
        res.render('details',{blog:result,title:'Blog Details'}) ;
    })
    .catch((error)=>{
        console.log(error) ;
    })
};


module.exports.blogs_delete = (req,res) =>{
    const id = req.params.id;
    
    Blog.findByIdAndDelete(id)
      .then(result => {
        res.json({ redirect: '/blogs' });
    })
      .catch(err => {
        console.log(err);
    });
};