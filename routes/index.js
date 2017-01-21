var express = require('express');
var router = express.Router();
const {ObjectID} = require("mongodb");

const _ = require('lodash');
const {Poll} = require('./../models/polls');
const {authenticate} = require('./../middleware/authenticate');

/* GET home page. */
router.get('/', (req,res)=> {

  let isLoggedIn = req.session.xAuth ? true : false;
  Poll.find().then((polls)=>{  
    let chartList = polls.map((elem)=>{
      return _.pick(elem,['title','numVotes','_id','createdAt']);
    });
 
    res.render('index', { 
      title: 'Polling Station' ,
      isLoggedIn:isLoggedIn,
      chartT:chartList
    });
  },(err)=>{
    console.log(err);
  });

});

router.get('/userLogged',authenticate, (req,res)=> {
  const name = req.user.name;
  Poll.find({_creator:name}).then((polls)=>{  
    let chartList = polls.map((elem)=>{
      return _.pick(elem,['title','numVotes','_id','createdAt']);
    });
    if(chartList.length < 1){chartList = undefined;}

    res.render('indexUser', { 
      title: 'Logged in' ,
      name:req.user.name,
      isLoggedIn:true,
      chartT:chartList
    });

   }); 
});

router.get('/userLogged/newPoll',authenticate, (req,res)=> {
    res.render('newPoll', { 
      title: 'Logged in' ,
      name:req.user.name,
      isLoggedIn:true,
    });   

});

router.post('/userLogged/newPoll',authenticate, (req,res)=> {
    let title = req.body.title;
    let optList = req.body.option.map((opt)=>{
      return {option:opt};
    });
    const poll = new Poll({
      title:title,
      options:optList,
        _creator:req.user.name
    });

    poll.save().then((doc)=>{
        console.log(doc);
        res.status(200).send(doc)
    },(err)=>{
        console.log(err);
        res.status(400).send();
    });

});

router.get('/poll/:id', (req,res)=> {
  let pollId = req.params.id;

  if(!ObjectID.isValid(pollId)){
    return res.status(404).send(e);
  }
  let isLoggedIn = req.session.xAuth ? true : false;
  
  Poll.findOne({_id:pollId}).then((poll)=>{  

    let options = poll.options.map((elem)=>{
      return elem.option;
    });
    let data = poll.options.map((elem)=>{
      return  elem.voteCount;
    });
    let owner = req.session.name === poll._creator;

    res.render('singlePoll', { 
      isLoggedIn:isLoggedIn,
      chartData:data,
      chartOptions:options,
      chartName:poll.title,
      id:pollId,
      isOwner: owner
    });
  },(err)=>{
    console.log(err);
  });

});
router.post('/poll/:id',authenticate, (req,res)=> {
  let pollId = req.params.id;
  if(!ObjectID.isValid(pollId)){
    return res.status(404).send(e);
  }
  let newOpt = req.body;
  Poll.findOneAndUpdate( {
        _id: pollId
      }, {
        $push: {options:newOpt},
      }, function(err, raw) {
        if (err) return res.status(400).send();
        res.status(200).send();
      });

});

router.patch('/poll/:id', (req,res)=> {
  let pollId = req.params.id;
  if(!ObjectID.isValid(pollId)){
    return res.status(404).send(e);
  }

  let toUpdate = req.body.inp;

  Poll.update( {
        _id: pollId,
        "options.option": toUpdate
      }, {
        $inc: {"options.$.voteCount": 1,"numVotes":1},
      }, function(err, raw) {
        if (err) return console.log(err);
        res.status(200).send();
      });
});

router.delete('/poll/:id',authenticate, (req,res)=> {
  let pollId = req.params.id;
  if(!ObjectID.isValid(pollId)){
    return res.status(404).send(e);
  }
    Poll.findOneAndRemove({
        _id:pollId,
        _creator:req.session.name
    }).then((poll)=>{
        if(!poll){
            return res.status(404).send();
        }
        res.status(200).send({poll});
    }).catch((e)=> res.status(404).send(e));
});






module.exports = router;
