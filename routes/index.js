const express = require('express');
const router = express.Router();
var bookModel =  require('../models/data');
const User = require('../models/user');
const { authorize } = require('../middleware/auth');

// default page load
router.get('/data', async (req,res, next)=>{
  const perPage = 4; // results per page
  const page = req.params.page || 1; // Page 

  try {
    // execute query with page and limit values
    bookModel.find()
      .skip((perPage * page) - perPage)
      .limit(perPage)
      .exec(function(err, data) {
        bookModel.countDocuments().exec(function(err, count) {
          if(err) return next(err)
          res.render(
            'pages/home',
            {data:data,
            current: page, 
            pages: Math.ceil(count / perPage)}
          );
        })
      })
    } catch (err) {
          console.error(err.message);
        }
});

router.get('/data/:page', async (req,res, next)=>{
  const perPage = 4; // results per page
  const page = req.params.page || 1; // Page 

  try {
    // execute query with page and limit values
    bookModel.find()
      .skip((perPage * page) - perPage)
      .limit(perPage)
      .exec(function(err, data) {
        bookModel.countDocuments().exec(function(err, count) {
          if(err) return next(err)
          res.render(
            'pages/home',
            {data:data,
            current: page, 
            pages: Math.ceil(count / perPage)}
          );
        })
      })
    } catch (err) {
          console.error(err.message);
        }
});

//search
router.get('/search', authorize('publisher'), (req,res)=>{
  try {
    bookModel.find({$or:[{author:{'$regex':req.query.dsearch}},{books:{'$regex':req.query.dsearch}}]},(err,data)=>{
      if(err){
          console.log(err);
      }else{
          res.render('pages/search',{data:data});
      }
    })
  } catch (error) {
      console.log(error);
  }
});

router.post('/', (req,res)=>{
  try {
         var books = new bookModel({
             author:req.body.author,
             books:req.body.book
         });
         books.save((err,data)=>{
             if(err){
                 console.log(err)
             }else{
                 res.redirect('/data/1');
             }
         })
  } catch (error) {
      console.log(error);
  }
});

module.exports = router;