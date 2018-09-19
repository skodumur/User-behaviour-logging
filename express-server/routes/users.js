var express = require('express');
const mongoose = require('mongoose');
const moment = require('moment');

var router = express.Router();
const User = require('../models/User');
const LoginLogs = require('../models/LoginLogs');

/* GET users listing. */
router.get('/', function(req, res, next) {
  User.find()
        .select('name pass _id')
        .exec()
        .then( docs => {
            const response = {
                count: docs.length,
                users: docs.map( doc => {
                    return {
                        pass: doc.pass,
                        name: doc.name,
                        _id: doc._id,    
                    }
                })
            };
            //console.log(docs);
            res.status(200).json(response);
            
        })
        .catch( error => {
            console.log(error);
            res.status(500).json({
                error: error
            })
        });
});

router.post('/', (req, res, next) => {

  const user = new User({
      _id: new mongoose.Types.ObjectId(),
      name: req.body.name,
      pass: 'pwd'
  });

  user
      .save()
      .then( result => {
          console.log(result);
          res.status(200).json({
              message: "User Created",
              User:{
                  pass: result.pass,
                  name: result.name,
                  _id: result._id,
              }
          });
      }).catch( error => {
          console.log(error);
          res.status(500).json({
              error: error
          });
          
      });

 
});

router.post('/login', (req, res, next) => {
    console.log(req.body);
    User.find({name: req.body.name})
    .select('pass')
    .exec()
    .then( docs => {
        if ( docs.length && (docs[0].pass === req.body.pass)) {
            const log = new LoginLogs({
                _id: new mongoose.Types.ObjectId(),
                name: req.body.name,
                time: new Date()
            });
            log.save()
            .then( result => {
                res.status(200).json({'response': true});
            }).catch( error => {
                console.log(error);
                res.status(500).json({
                    error: error
                });
                
            });
        } else {
            res.status(200).json({'response': false});
        }
    })
    .catch( error => {
        console.log(error);
        res.status(500).json({
            error: error
        })
    });
   
  });

  router.get('/logs/:name', function(req, res, next) {
    User.find()
    .select('name pass _id')
    .exec()
    .then( docs => {
        const response = {
            count: docs.length,
            users: docs.map( doc => {
                return {
                    pass: doc.pass,
                    name: doc.name,
                    _id: doc._id,    
                }
            })
        };
        res.status(200).json(response);
    })
    .catch( error => {
        console.log(error);
        res.status(500).json({
            error: error
        })
    });
  });

module.exports = router;
