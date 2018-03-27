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
  if(oldURL == undefined || oldURL == "" || /\s/g.test(oldURL) || !/.\../g.test(oldURL)) res.send({'error': "INVALID URL"});
  else {
    var wasHTTPS = false;
    if(!/.\..+\./g.test(oldURL) && oldURL.substring(0,4) == "http"){
      if(oldURL.split("//")[0] == "https:") wasHTTPS = true;
      oldURL = oldURL.split("//")[1];
      oldURL = "www." + oldURL;
    }
    else if(!/.\..+\./g.test(oldURL) && oldURL.substring(0,4) != "http") oldURL = "www." + oldURL;
    if(oldURL.substring(0,4) != "http" && !wasHTTPS) oldURL = "http://" + oldURL;
    if(oldURL.substring(0,4) != "http" && wasHTTPS) oldURL = "https://" + oldURL;
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

app.get('/:id', function(req, res){
  var id = req.params.id;
  console.log(id);
  if(isNaN(id)){
    if(!/.\..+\./g.test(id)) id = "www." + id;
    if(id.substring(0,4) != "http") id = "http://" + id; 
    res.status(301).redirect(id);
  } else {
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
