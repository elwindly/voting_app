var express = require('express');

const {Poll} = require('./../models/polls');
const {ObjectID} = require("mongodb");

function SinglePollController() {
    this.checkParams = function(req, res, next) {

        let pollId = req.params.id;
        if(!ObjectID.isValid(pollId)){
        return res.status(404).send();
        }
        req.id = pollId;
        req.isLoggedIn = req.session.xAuth ? true : false;
        next();
    };

    this.getPoll = function(req, res) {

        Poll.findOne({_id:req.id}).then((poll)=>{  
            let options = poll.options.map((elem)=>{
                return elem.option;
            });
            let data = poll.options.map((elem)=>{
                return  elem.voteCount;
            });
            let owner = req.session.name === poll._creator;

            res.render('singlePoll', { 
                isLoggedIn:req.isLoggedIn,
                chartData:data,
                chartOptions:options,
                chartName:poll.title,
                id:req.id,
                isOwner: owner
            });
        }).catch((e) => res.status(404).send())
    };

    this.newPollOption = function(req, res) {
        let newOpt = req.body;
            Poll.findOneAndUpdate( {
                _id: req.id
                }, {
                $push: {options:newOpt},
                $inc: {"numVotes":1},
            }).then(()=> res.status(200).send())
              .catch((e)=> res.status(400).send());
    };

    this.updatePollOption = function(req, res) {
        let toUpdate = req.body.inp;

        Poll.update( {
            _id: req.id,
            "options.option": toUpdate
            }, {
            $inc: {"options.$.voteCount": 1,"numVotes":1},
        })
        .then(()=> res.status(200).send())
        .catch((e)=> res.status(400).send());
    };

    this.deletePoll = function(req, res) {
        Poll.findOneAndRemove({
            _id:req.id,
            _creator:req.session.name
        }).then((poll)=>{
            if(!poll){
                return res.status(404).send();
            }
            res.status(200).send({poll});
        }).catch((e)=> res.status(404).send(e));
    };
}


module.exports = SinglePollController;