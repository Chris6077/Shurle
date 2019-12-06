var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const AutoIncrement = require('mongoose-sequence')(mongoose);
var hashids = require('hashids');

var urlSchema = new Schema({
  oldUrl: String,
  tcID: String,
  createdAt: Date
});

urlSchema.pre('save', function(next){
  var newLink = this;
  newLink.createdAt = new Date();
  newLink.tcID = "" + new hashids().encode(new Date().getMilliseconds() + (newLink.oldUrl.length * 1000));
  next();
});

urlSchema.plugin(AutoIncrement, {inc_field: 'id'});

var Url = mongoose.model('Url', urlSchema);
module.exports = Url;