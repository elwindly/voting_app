var express = require('express');
var router = express.Router();
const {ObjectID} = require("mongodb");

const _ = require('lodash');
const {Poll} = require('./../models/polls');
const {authenticate} = require('./../middleware/authenticate');
const SinglePollController = require('./../controllers/singlePollController');
const NewPollController = require('./../controllers/newPollController');
const ShowPollsController = require('./../controllers/showPollsController');
const CommonController = require('./../controllers/commonController');

const singlePollController = new SinglePollController();
const newPollController = new NewPollController();
const showPollsController = new ShowPollsController();
const commonController = new CommonController();

/* GET home page. */
router.get('/', commonController.welcome);

//get all polls
router.get('/allpolls', showPollsController.showPolls);

// User route after login
router.get('/userLogged',authenticate, showPollsController.showUserPolls);

//User createnew poll
router.route('/userLogged/newPoll')
  .get(authenticate, newPollController.newPollTemplate)
  .post(authenticate, newPollController.createNewPoll)


//handling existing polls
router.route('/poll/:id')
  .all(singlePollController.checkParams)
  .get(singlePollController.getPoll)
  .post(singlePollController.newPollOption)
  .patch(singlePollController.updatePollOption)
  .delete(authenticate, singlePollController.deletePoll);


module.exports = router;
