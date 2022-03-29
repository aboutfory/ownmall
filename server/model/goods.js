var mongoose = require('mongoose')
var Schema = mongoose.Schema;

var productSchema = new Schema({
	"productId":String,
	"productName":String,
	"productSerchKey":String,
	"salePrice":Number,
	"productImage":String,
	"checked":String,
	"productNumber":Number,
	"productMessage":String
});

module.exports = mongoose.model('Good',productSchema);