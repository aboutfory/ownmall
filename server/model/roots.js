var mongoose = require('mongoose')
var Schema = mongoose.Schema;

var rootSchema = new Schema({
	"rootName":String,
	"rootPassword":String
});

module.exports = mongoose.model('Root',rootSchema);