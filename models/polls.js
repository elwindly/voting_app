const mongoose = require('mongoose');

const commonRules ={
        type:String,
        required:true,
        trim:true,
        minlength:1    
}
var PollsSchema = new mongoose.Schema({
    title:commonRules,
    options:[{
        option:commonRules,
        voteCount:{
            type:Number,
            default:0
        }
    }],
    numVotes:{
            type:Number,
            default:0
        },
    createdAt:{
        type:Date,
        default:Date.now
    },
    _creator:{
        type:String,
        required:true,        
    }
});



var Poll = mongoose.model('Poll',PollsSchema);

module.exports = {Poll} 