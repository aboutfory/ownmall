var mongoose = require('mongoose')
var Schema = mongoose.Schema;

var userSchema = new Schema({
	"userId":String,
	"userName":String,
	"userPwd":String,
	"orderList":[
		{
			"orderId":String,
			"orderTotal":Number,
			"orderTime":String,
			"addressInfo":{
				"addressId":String,
				"addressMsg":String,
				"addressUserName":String,
				"postCode":String,
				"tel":String
		  	},
			"orderGoodsList":[
				{
					"productId":String,
					"productName":String,
					"salePrice":Number,
					"productImage":String,
					"productNumber":Number
				}
			]
		}
	],
	"cartList":[
		{
			"productId":String,
			"productName":String,
			"productSerchKey":String,
			"salePrice":Number,
			"productImage":String,
			"productMessage":String,
			"productNumber":Number,
			"checked":String
		}
	],
	"addressList":[
		{
			"addressId":String,
			"addressUserName":String,
			"addressMsg":String,
			"postCode":Number,
			"tel":String,
			"ifChecked":String,
		}
	]
});

module.exports = mongoose.model('User',userSchema);