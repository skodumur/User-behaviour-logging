var express = require('express');
const mongoose = require('mongoose');

var router = express.Router();
const EventLog = require('../models/EventLog');

// router.get('/', function(req, res, next) {
//     EventLog.find()
//           .select()
//           .exec()
//           .then( docs => {
//               const response = {
//                   count: docs.length,
//                   posts: docs
//               };
//               //console.log(docs);
//               res.status(200).json(response);
              
//           })
//           .catch( error => {
//               console.log(error);
//               res.status(500).json({
//                   error: error
//               })
//           });
//   });

router.post('/', (req, res, next) => {
    try {
        (async function(){

            const insertMany = await EventLog.insertMany(req.body);
    
            res.status(200).send('Ok');
        })();
    } catch (e) {
        console.log(e)
    }
  });

  module.exports = router;