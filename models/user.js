const mongoose = require('mongoose') 
const {isEmail} = require('validator')
const bcrypt = require('bcrypt')
mongoose.pluralize(null) ;
const userSchema = mongoose.Schema({

    email:{
        type: String,
        unique:true,
        required:[true,'Please enter an Email ID'],
        validate:[isEmail,'Please enter a valid Email ID']
    },
    password:{
        type: String,
        required:[true,'Please enter a password'],
        minlength:[6,'Minimum length of password should be 6 characters']
    }
});

// fire a function after doc saved to db
userSchema.post('save',function (doc,next) {
    console.log('new user was created and saved',doc);
    next();
});

// fire a function before doc saved to db
userSchema.pre('save',async function (next) {
    
    const salt = await bcrypt.genSalt() ;
    this.password = await bcrypt.hash(this.password,salt)
    next();
});


userSchema.statics.login = async function(email,password)
{

    const user = await this.findOne({email}) ;
    
    if(user)
    {
        const auth = await bcrypt.compare(password,user.password) ;
        
        if(auth)
        {
            return user ;
        }
        throw Error("Incorrect Password") ;
    }
    throw Error("Incorrect Email") ;
    
}

const User = mongoose.model('users',userSchema)



module.exports = User ;

