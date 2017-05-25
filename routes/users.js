require('./../config/config');
const express = require('express');
const router = express.Router();
const _ = require('lodash');
const {authenticate} = require('./../middleware/authenticate');

const {User} = require('./..//models/members');



//sign uo
router.post('/', (req,res)=> {
    var body = _.pick(req.body,['email','name','password']);

    User.findOne({email:body.email}).then((user)=>{
    if(user){
        return res.status(409).send('Email is already in use!');
    }else{
        User.findOne({name:body.name}).then((user)=>{
            if(user){
                res.status(409).send('Username is already in use!');     
            }else{
               var user = new User(body);

                user.save().then(()=>{
                    return user.generateAuthToken();
                }).then((token)=>{           
                    //res.header('x-auth', token).send(user);
                    req.session.xAuth = token;
                    req.session.name = body.name;
                    res.status(200).send();
                }).catch((e)=>{
                    res.status(400).send('Invalid data!');
                });
            }       
        });
    }
    });
});


router.post('/login',(req,res)=>{
    var body = _.pick(req.body,['emailLog','pwdLog']);

    User.findByCredentials(body.emailLog,body.pwdLog).then((user)=>{
        return user.generateAuthToken().then((token)=>{
            req.session.xAuth = token;
            req.session.name = user.name;
            res.redirect('/userLogged');
        });
    }).catch((e)=>{
        res.status(409).send({message: "Invalid Credentials"});
    });
});

router.delete('/me/token',authenticate,(req,res)=>{
    req.user.removeToken(req.session.xAuth).then(()=>{
        req.session.xAuth = null;
        req.session.name = null;
        req.session.destroy(function(err) {
           res.status(200).send();
        })
        
    },()=>{
        res.status(400).send();
    });
});

module.exports = router;
