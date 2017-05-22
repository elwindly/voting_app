var express = require('express');

const {Poll} = require('./../models/polls');
const {ObjectID} = require("mongodb");

function NewPollController() {

    this.newPollTemplate = function(req, res) {

        res.render('newPoll', { 
            title: 'Logged in' ,
            name:req.user.name,
            isLoggedIn:true,
        });   
    };

    this.createNewPoll = function(req, res) {
        let title = req.body.title;
        let optList = req.body.option.map((opt)=>{
            return {option:opt};
        });

        const poll = new Poll({
            title:title,
            options:optList,
            _creator:req.user.name
        });

        poll.save()
        .then((doc)=>res.status(200).send(doc))
        .catch((e) =>res.status(400).send());
    };

}


module.exports = NewPollController;