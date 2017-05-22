const {mongoose} = require('./../db/mongoose');
const {ObjectID} = require('mongodb');
const {Poll} = require('./polls');
const user = new ObjectID();
const user2 ="5863f9d42766682f7850c898"
// const firstPoll = new Poll({
//     title:"User 2 second testPoll",
//     options:[
//         {
//             option:"tester"
//         },
//         {
//             option:"testerin"
//         }
//     ],
//     _creator:user2
// });

// firstPoll.save().then((doc)=>{
//     console.log(doc);
// },(err)=>{
//     console.log(err);
// });

//var id = "5865407c8d578438c0bd2099";
//var opId = "5865407c8d578438c0bd209b";

// Pool.findById(id).then((pool)=>{
//     if(!pool){
//         return console.log('pool Id was not found');
//     }
//     console.log(pool);
// }).catch((e)=>console.log(e))

const body = {
    title:"New title"

}

// Poll.update( {
//       _id: id,
//       "options._id": opId
//     }, {
//       $inc: {"options.$.voteCount": 1,"numVotes":1},
//     }, function(err, raw) {
//       if (err) return console.log(err);
//       console.log("ok");
//     });
const id = "5865407c8d578438c0bd2099"
            Poll.findOneAndUpdate( {
                _id: id
                }, {
                $push: {options:{option:"Another fantastic option", voteCount:1 }},
                $inc: {"numVotes":1},
            }).then(() => Poll.findById(id))
              .then((doc)=> console.log(doc))
              .catch((e)=> console.log(e));

// Poll.findOneAndUpdate( {
//       _id: id
//     }, {
//       $push: {options:{option:"New option jeah"}},
//     }, function(err, raw) {
//       if (err) console.log(err);
//       console.log(raw);
//     });
// Poll.findOneAndUpdate( {
//       _id: id
//     }, {
//       $pull: {options:{option:"New option jeah"}},
//     }, function(err, raw) {
//       if (err) console.log(err);
//       console.log(raw);
//     });
// Poll.count({},(err,count)=>{
//   console.log(count);
// });
// Poll.findOneAndUpdate({_id:id},{$inc:{options[0].voteCount:1}},{new:true}).then((pool)=>{
//         if(!pool){
//             return console.log('Something went wrong');
//         }

//         console.log(pool);
//     }).catch((e)=>console.log(e))



// Poll.findOne({_id:id}, function (err, doc){

//   doc.options[0].voteCount.$inc();

//   doc.save();
// });

// Poll.findOne({_id:id}).then((doc) => {
//     doc.options[0].voteCount++;
//     doc.options.push({
//         option:"new option22333"
//     });
//     //doc.options.shift();
//     doc.save();
// });
//let id = "587695aa9098a82f8000957f";
// let creator = "tester";

// Poll.findOneAndRemove({
//         _id:id,
//         _creator:creator
//     }).then((poll)=>{
//         console.log(poll);

//     }).catch((e)=> console.log(e));




