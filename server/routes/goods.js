var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Goods = require('../model/goods');
var Users = require('../model/users');
var Roots = require('../model/roots');

/*连接MongoDB数据库*/
mongoose.connect('mongodb://120.76.132.108:27017/ownmall');

mongoose.connection.on("connected", function () {
	// 初始化一个管理员
	Roots.find({}, function (err, doc) {
		if (!doc || doc.length === 0) {
			Roots.create({
				"rootName": "root",
				"rootPassword": "123456"
			})
		}
	})
	// 初始化一个商品
	Goods.find({}, function (err, doc) {
		if (!doc || doc.length === 0) {
			Goods.create({
				"productId" : "7cwylvodgzo00", 
				"productName" : "烟台红富士山东苹果新鲜水果", 
				"productSerchKey" : "苹果", 
				"salePrice" : 10, 
				"productImage" : "default.jpeg", 
				"productMessage" : "烟台红富士山东苹果新鲜水果",
			})
		}
	})
	console.log("MongoDB connected success.");
});

mongoose.connection.on("error", function () {
	console.log("MongoDB connected fail.");
});

mongoose.connection.on("disconnected", function () {
	console.log("MongoDB connected disconnected.");
});

/* GET users listing. */

/*获取单页商品信息的接口*/
router.get('/', function(req, res, next) {
	var page = req.param("page"),
		pageSize = req.param("pageSize");

	var skip = (parseInt(page) - 1)*10;
	var limit = parseInt(pageSize);
	var priceGt = '';
	var priceLt = '';

	/*判断是否有搜索字段或者价格筛选字段*/
	if (req.param("productSerchKey")) {
		var params = {
			"productSerchKey" : req.param("productSerchKey")
		};
	}else if(req.param("productPriceKey")) {
		switch(req.param("productPriceKey"))
			{
				case '0':
				  priceGt = 0;
				  priceLt = 100000;
				  break;
				case '1':
				  priceGt = 0;
				  priceLt = 50;
				  break;
				case '2':
				  priceGt = 50;
				  priceLt = 100;
				  break;
				case '3':
				  priceGt = 100;
				  priceLt = 200;
				  break;
				case '4':
				  priceGt = 200;
				  priceLt = 500;
				  break;
				case '5':
				  priceGt = 500;
				  priceLt = 100000;
				  break;
			}
		var params = {
			salePrice : {
				$gt : priceGt,
				$lte : priceLt
			}
		};
	}else {
		var params = {};
	}

	Goods.find(params).skip(skip).limit(limit).exec(function (err, doc) {
		if (err) {
			res.json({
				status : '1',
				msg : err.message,
				result : ''
			});
		} else {
			res.json({
				status : '0',
				msg : '',
				result : {
					count : doc.length,
					list : doc
				}
			});
		}
	});
});

/*获取符合条件的全部商品信息的接口*/
router.get('/all', function(req, res, next) {
	var priceGt = '';
	var priceLt = '';

	/*判断是否有搜索字段或者价格筛选字段*/
	if (req.param("productSerchKey")) {
		var params = {
			"productSerchKey" : req.param("productSerchKey")
		};
	}else if(req.param("productPriceKey")) {
		switch(req.param("productPriceKey"))
			{
				case '0':
				  priceGt = 0;
				  priceLt = 100000;
				  break;
				case '1':
				  priceGt = 0;
				  priceLt = 50;
				  break;
				case '2':
				  priceGt = 50;
				  priceLt = 100;
				  break;
				case '3':
				  priceGt = 100;
				  priceLt = 200;
				  break;
				case '4':
				  priceGt = 200;
				  priceLt = 500;
				  break;
				case '5':
				  priceGt = 500;
				  priceLt = 100000;
				  break;
			}
		var params = {
			salePrice : {
				$gt : priceGt,
				$lte : priceLt
			}
		};
	}else {
		var params = {};
	}

	Goods.find(params, function (err1, doc1) {
		if (err1) {
			res.json({
				status : '1',
				msg : err1.message,
				result : ''
			});
		} else {
			res.json({
				status : '0',
				msg : '',
				result : {
					count : doc1.length
				}
			});
		}
	});
});

/*加入购物车的接口*/
router.post('/addCart', function(req, res, next) {
	let userId = req.cookies.userId;
	let productId = req.body.productId;

	Users.findOne({"userId":userId}, function (err, userDoc) {
		if (err) {
			res.json({
				status : '1',
				msg : err.message
			});
		} else {
			if (userDoc) {
				let ifGoodsInCartList = '';
				let nowNumber = 0;
				userDoc.cartList.forEach(function (item) {
					if (item.productId == productId) {
						ifGoodsInCartList = item;
						nowNumber = item.productNumber + 1;
					}
				});
			
				if (ifGoodsInCartList) {
					/*购物车已有商品就加数量*/
					Users.update({
						"userId":userId,
						"cartList.productId":productId
					},{
						"cartList.$.productNumber":nowNumber
					}, function (err, doc) {
						if (err) {
							res.json({
								status : '1',
								msg : err.message,
								result : ''
							});
						}else {
							res.json({
								status : '0',
								msg : '',
								result : ''
							});
						}
					})
				} else {
					/*购物车没有商品就加新商品进去*/
					Goods.findOne({"productId":productId}, function (err1, doc) {
						if (err1) {
							res.json({
								status : '1',
								msg : err1.message
							});
						} else {
							if (doc) {
								doc.productNumber = 1;
								doc.checked = 1;
								userDoc.cartList.push(doc);
								userDoc.save(function (err2, doc2) {
									if (err2) {
										res.json({
											status : '1',
											msg : err2.message
										});
									} else {
										res.json({
											status : '0',
											msg : '',
											result : 'suc' 
										});
									}
								});
							}
						}
					});
				}
			}
		}
	})
});

module.exports = router;
