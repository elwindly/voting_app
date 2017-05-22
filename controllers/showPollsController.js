const express = require('express');
const _ = require('lodash');

const {Poll} = require('./../models/polls');

function ShowPollsController() {

    this.showPolls = function(req, res) {
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
        }).catch((e) =>res.status(400).send());
    };

    this.showUserPolls = function(req, res) {

        const name = req.user.name;

        Poll.find({_creator:name}).then((polls)=>{  
            let chartList = polls.map((elem)=>{
            return _.pick(elem,['title','numVotes','_id','createdAt']);
        });      
         res.render('index', { 
            title: 'Polling Station' ,
            isLoggedIn:true,
            chartT:chartList
        });
        }).catch((e) =>res.status(400).send());
    };    
}


module.exports = ShowPollsController;