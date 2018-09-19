var express = require('express');
const mongoose = require('mongoose');
const moment = require('moment');

var router = express.Router();
const Post = require('../models/Post');

router.get('/', function(req, res, next) {
    Post.find()
          .select()
          .exec()
          .then( docs => {
              const response = {
                  count: docs.length,
                  posts: docs
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
    Post.find()
    .select()
    .exec()
    .then((docs) => {
        const post = new Post({
            ...req.body,
            id: ++docs.length,
            _id: new mongoose.Types.ObjectId(),
        });
        post
        .save()
        .then( result => {
            console.log(result);
            res.status(200).json({
                message: "Post Created",
                Post:result
            });
        }).catch( error => {
            console.log(error);
            res.status(500).json({
                error: error
            });
        });
    })

  

  });

  
module.exports = router;
