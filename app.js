// Base Node requirements

var bodyParser = require('body-parser');
var cors = require('cors');
var express = require('express');
var mongoose = require('mongoose');
var routes = express();
var searchString = require('./node_modules/searchString');

// Bing API requirement
// Obtain an 'account key' here: azure.microsoft.com/en-us/try/cognitive-services/my-apis/
var Bing = require('node-bing-api')({ accKey: 'your-account-key' });

routes.use(bodyParser.json());
routes.use(cors());

mongoose.connect('mongodb://localhost/searchString');

// Fix Deprecation warning
mongoose.Promise = require('bluebird');

// Search terms in the DB.
routes.get('/api/searchHistory', function(req, res, next) {
    searchString.find({}, (error, data) => {
      res.json(data); 
    });
});

//Items in the DB per exercise.
routes.get('/api/imagesearch/:searchValue', function(req, res) {
    
    // Constructors
    var { searchValue } = req.params;
    var { offset } = req.query;
    
    
    var data = new searchString({
        searchValue,//: query,
        searchDate: new Date()
    });
    
    // Get items in the DB.
    data.save, function(err) {
        if (err) {
            return res.send('Error saving to DB.');
         }
        //res.json(data);
     };
    
    // Bing Node API
    Bing.images(searchValue, {
        count: 5, // Pagination limit of 5 results.
        offset: 2 // Skip first 2 results.
        },
        function(error, rez, body) {
            var searchData = [];
            for (var i=0; i<5; i++){
                searchData.push({
                    url: body.value[i].webSearchUrl,
                    snippet: body.value[i].name,
                    thumbnail: body.value[i].thumbnailUrl,
                    context: body.value[i].hostPageUrl
            });
                
            }
             res.json(searchData);
            
          });
    
 });

routes.listen(process.env.PORT || 3000, ()=>{
  console.log('App is running!');
});