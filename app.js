// Allow Block-scoped declarations for Heroku.
'use strict';

// Base Node requirements

var bodyParser = require('body-parser');
var cors = require('cors');
var express = require('express');
var mongoose = require('mongoose');
var app = express();
var searchString = require('./modules/searchString');

// Bing API requirement
// Obtain an account key here: azure.microsoft.com/en-us/try/cognitive-services/my-apis/
var Bing = require('node-bing-api')({ accKey: 'df51a062662b471287c21b0b13894972' });

mongoose.connect(process.env.MONGO_URI ||'mongodb://localhost/searchString');

app.use(bodyParser.json());
app.use(cors());

// Fix Deprecation warning
mongoose.Promise = require('bluebird');

// Basic Html App Routing.
app.use(express.static('public'));

app.get("/", function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

// Access stored search terms in the DB.
app.get('/api/searchHistory', function(req, res, next) {
    searchString.find({}, (error, data) => {
      res.json(data); 
    });
});



// Items in the DB per exercise.
app.get('/api/imagesearch/:searchValue*', function(req, res) {
    
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

app.listen(process.env.PORT || 3000, function () {
  console.log('App is running!');
});