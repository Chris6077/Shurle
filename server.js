// server.js
// where your node app starts

// init project
const express = require('express');
const app = express();
var path = require('path');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var config = require('./config');
var Url = require('./models/schemas');

mongoose.connect(config.db.host);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static('public'))

app.get("/", (request, response) => {
  response.sendFile(__dirname + '/views/index.html')
})

app.post('/new', function(req, res){
  var oldURL = req.body.url;
  if(oldURL == undefined || oldURL == "" || /\s/g.test(oldURL) || !/.\../g.test(oldURL) || /\.\./g.test(oldURL)) res.json({'error': "INVALID URL"});
  else {
    if(oldURL.substring(0,5) == "http:" || oldURL.substring(0,6) == "https:" || oldURL.substring(0,7) == "mailto:" || oldURL.substring(0,5) == "news:" || oldURL.substring(0,4) == "ftp:" || oldURL.substring(0,5) == "file:"){
      switch(oldURL.split(":")[0]){
        case "http":  if(!/.\..+\./g.test(oldURL.split("//")[1] )) oldURL = "http://www." + oldURL.split("://")[1];
                      break;
        case "https": if(!/.\..+\./g.test(oldURL.split("//")[1] )) oldURL = "https://www." + oldURL.split("://")[1];
                      break;
        case "mailto":  if(!/[A-Za-z0-9]+\:.+@.+\../g.test(oldURL)) res.json({'error': "INVALID URL"});
                        break;
      }
    } else {
      if(!/.\..+\./g.test(oldURL)) oldURL = "www." + oldURL;
      oldURL = "http://" + oldURL;
    }
    var shortUrl = '';
    Url.findOne({oldUrl: oldURL}, function (error, url){
      if (url){
        shortUrl = config.webhost + url.id;
        res.send({'shortUrl': shortUrl});
      } else {
        var newUrl = Url({
          oldUrl: oldURL
        });
        newUrl.save(function(error) {
          if (error){
            console.log(error);
          }
          shortUrl = config.webhost + newUrl.id;
          res.send({'shortUrl': shortUrl});
        });
      }
    });
  }
});

app.get('/new/:url*', function(req, res){
  var oldURL = req.url.slice(5);
  console.log(req);
  if(oldURL == undefined || oldURL == "" || /\s/g.test(oldURL) || !/.\../g.test(oldURL) || /\.\./g.test(oldURL)) res.json({'error': "INVALID URL"});
  else {
    if(oldURL.substring(0,5) == "http:" || oldURL.substring(0,6) == "https:" || oldURL.substring(0,7) == "mailto:" || oldURL.substring(0,5) == "news:" || oldURL.substring(0,4) == "ftp:" || oldURL.substring(0,5) == "file:"){
      switch(oldURL.split(":")[0]){
        case "http":  if(!/.\..+\./g.test(oldURL.split("//")[1] )) oldURL = "http://www." + oldURL.split("://")[1];
                      break;
        case "https": if(!/.\..+\./g.test(oldURL.split("//")[1] )) oldURL = "https://www." + oldURL.split("://")[1];
                      break;
        case "mailto":  if(!/[A-Za-z0-9]+\:.+@.+\../g.test(oldURL)) res.json({'error': "INVALID URL"});
                        break;
      }
    } else {
      if(!/.\..+\./g.test(oldURL)) oldURL = "www." + oldURL;
      oldURL = "http://" + oldURL;
    }
    var shortUrl = '';
    Url.findOne({oldUrl: oldURL}, function (error, url){
      if (url){
        shortUrl = config.webhost + url.id;
        res.json({'shortUrl': shortUrl});
      } else {
        var newUrl = Url({
          oldUrl: oldURL
        });
        newUrl.save(function(error) {
          if (error){
            console.log(error);
          }
          shortUrl = config.webhost + newUrl.id;
          res.json({'shortUrl': shortUrl});
        });
      }
    });
  }
});

app.get('/:id', function(req, res){
  var id = req.params.id;
  if(id != "favicon.ico") {
    console.log(id);
    Url.findOne({id: id}, function (error, url){
      if (url == undefined) {
        res.redirect(config.webhost);
      } else {
        res.status(301).redirect(url.oldUrl);
      }
    });
  }
});

// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log(`Your app is listening on port ${listener.address().port}`)
})
