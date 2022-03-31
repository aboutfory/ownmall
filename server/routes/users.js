var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Goods = require('../model/goods');
var Users = require('../model/users');


/* GET users listing. */
/*登陆接口*/
router.post('/login', function(req, res, next) {
	var userName = req.body.userName,
  		userPwd = req.body.userPwd;
  	var nowMossion = false;
  	var nowDoc;

	Users.find({},function (err, doc) {
		if (err) {
			res.json({
				status : '1',
				msg : err.message,
				result : ''
			});
		} else {
			if (doc) {
				doc.forEach(function (item) {
					if (item.userName == userName && item.userPwd == userPwd) {
						nowMossion = true;
						nowDoc = item;
					}
				})

				if (nowMossion) {
					res.cookie("userId",nowDoc.userId,{
						path:'/',
						maxAge:1000*60*60,
					});
					res.json({
						status : '0',
						msg : '',
						result : {
							userName : nowDoc.userName,
							userId : nowDoc.userId
						}
					});
				} else {
					res.json({
						status : '1',
						msg : '用户名或密码不正确',
						result : ''
					});
				}
			}
		}
	});
});

/*注销接口*/
router.post('/logout', function(req, res, next) {
	res.cookie("userId","",{
		path:"/",
		maxAge:-1
	});
	res.json({
		status:'0',
		msg:'注销成功',
		result:''
	});
});

/*页面初始化检测是否已经登陆接口*/
router.post('/checkIfLogin', function(req, res, next) {
	if (req.cookies.userId) {
		let userId = req.cookies.userId;
		Users.findOne({"userId":userId},function (err, doc) {
			if (err) {
				res.json({
					status:'1',
					msg:err.message,
					result:''
				});
			} else {
				res.json({
					status:'0',
					msg:'',
					result:doc
				});
			}
		});
	}
});

/*注册接口*/
router.post('/register', function(req, res, next) {
	let userRegisterName = req.body.userRegisterName,
  		userRegisterPwd = req.body.userRegisterPwd;
  	let nowLen = 0,newLen = 0,nowHave = false;

  	Users.find({},function (err, doc) {
		if (err) {
			res.json({
				status : '1',
				msg : err.message,
				result : ''
			});
		} else {
			if (doc) {
				nowLen = doc.length;
				doc.forEach(function (item) {
					if (item.userName == userRegisterName) {
						nowHave = true;
					}
				})

				if (nowHave) {
					res.json({
						status : '1',
						msg : '当前用户已经存在',
						result : ''
					});
				} else {
					newLen = "'" + (10000000 + nowLen + 1) + "'"
					var addUser = new Users({
						"userId" : newLen,
						"userName" : userRegisterName,
						"userPwd" : userRegisterPwd,
						"orderList" : [],
						"cartList" : [],
						"addressList" : []
					});
					addUser.save(function (err2, doc2) {
						if (err2) {
							res.json({
								status : '1',
								msg : err2.message,
								result : ''
							});
						} else {
							res.json({
								status : '0',
								msg : '注册成功',
								result : ''
							});
						}
					});
				}
			}
		}
	});
});

/*查询购物车商品接口*/
router.get('/cartShow', function(req, res, next) {
	if (req.cookies.userId) {
		let userId = req.cookies.userId;
		Users.findOne({"userId":userId},function (err, doc) {
			if (err) {
				res.json({
					status:'1',
					msg:err.message,
					result:''
				});
			} else {
				var cartList = doc.cartList;
				var ifAllChecked = '1';
				doc.cartList.forEach((item)=>{
					if (item.checked == '0') {
						ifAllChecked = '0';
					}
				});
				res.json({
					status:'0',
					msg:'',
					result:{
						cartList,
						ifAllChecked
					}
				});
			}
		});
	}
});

/*点击按钮改变购物车商品数量接口*/
router.post('/changeProductNumber', function(req, res, next) {
	let met = req.body.met;
	let productId = req.body.productId;
	let num = req.body.num;
	let newNum = 0;

	if (req.cookies.userId) {
		let userId = req.cookies.userId;

		if (met == 'pre') {
			newNum = num - 1;
			if (newNum <= 1) {
				newNum = 1;
			}
		} else {
			newNum = num + 1;
		}
		
		Users.update({
			"userId":userId,
			"cartList.productId":productId
		},{
			"cartList.$.productNumber":newNum
		}, function (err, doc) {
			if (err) {
				res.json({
					status : '1',
					msg : err.message,
					result : ''
				});
			} else {
				Users.findOne({"userId":userId},function (err, doc) {
					if (err) {
						res.json({
							status:'1',
							msg:err.message,
							result:''
						});
					} else {
						res.json({
							status:'0',
							msg:'',
							result:doc.cartList
						});
					}
				});
			}
		});
	}
});

/*删除该项购物车商品*/
router.post('/delCartItem', function(req, res, next) {
	let productId = req.body.productId;

	if (req.cookies.userId) {
		let userId = req.cookies.userId;

		Users.update({
			"userId":userId
		},{
			$pull:{
				"cartList":{"productId":productId}
			}
		}, function (err, doc) {
			if (err) {
				res.json({
					status : '1',
					msg : err.message,
					result : ''
				});
			} else {
				Users.findOne({"userId":userId},function (err, doc) {
					if (err) {
						res.json({
							status:'1',
							msg:err.message,
							result:''
						});
					} else {
						res.json({
							status:'0',
							msg:'',
							result:doc.cartList
						});
					}
				});
			}
		});
	}
});

/*点击切换是否全选*/
router.post('/ifAllChecked', function(req, res, next) {
	let userId = req.cookies.userId;
	let checkAll = req.body.checkAll;

	Users.findOne({"userId":userId},function (err, user) {
		if (err) {
			res.json({
				status:'1',
				msg:err.message,
				result:''
			});
		} else {
			user.cartList.forEach(function (item) {
				item.checked = checkAll;
			});
			user.save(function (err1, doc1) {
				if (err1) {
					res.json({
						status:'1',
						msg:err1.message,
						result:''
					});
				} else {
					res.json({
						status:'0',
						msg:'',
						result:'suc'
					});
				}
			})
		}
	});
});

/*商品单项点击是否选中并修改数据库值*/
router.post('/ifItemChecked', function(req, res, next) {
	let userId = req.cookies.userId;
	let checkItem = req.body.checkItem;
	let index = req.body.index;

	Users.findOne({"userId":userId},function (err, user) {
		if (err) {
			res.json({
				status:'1',
				msg:err.message,
				result:''
			});
		} else {
			user.cartList[index].checked = checkItem;
			user.save(function (err1, doc1) {
				if (err1) {
					res.json({
						status:'1',
						msg:err1.message,
						result:''
					});
				} else {
					res.json({
						status:'0',
						msg:'',
						result:'suc'
					});
				}
			})
		}
	});
});

/*添加收货地址接口*/
router.post('/addAddress', function(req, res, next) {
	let souHuoName = req.body.souHuoName;
	let souHuoAddress = req.body.souHuoAddress;
	let souHuoPostCode = req.body.souHuoPostCode;
	let souHuoTel = req.body.souHuoTel;
	let nowLen = 0;

	if (req.cookies.userId) {
		let userId = req.cookies.userId;

		Users.findOne({"userId":userId},function (err, user) {
			if (err) {
				res.json({
					status:'1',
					msg:err.message,
					result:''
				});
			} else {
				var newId = Number(Math.random().toString().substr(3,7) + Date.now()).toString(36);

				var addAddress = {
					"addressId" : newId,
					"addressUserName" : souHuoName,
					"addressMsg" : souHuoAddress,
					"postCode" : souHuoPostCode,
					"tel" : souHuoTel,
					"ifChecked" : '0'
					};
				user.addressList.push(addAddress);
				user.save(function (err2, doc2) {
					if (err2) {
						res.json({
							status : '1',
							msg : err2.message,
							result : ''
						});
					} else {
						res.json({
							status : '0',
							msg : '收货地址添加成功',
							result : ''
						});
					}
				});
			}
		});
	}
});

/*删除收货地址接口*/
router.post('/delAddress', function(req, res, next) {
	let addressId = req.body.addressId;

	if (req.cookies.userId) {
		let userId = req.cookies.userId;

		Users.update({
			"userId":userId
		},{
			$pull:{
				"addressList":{"addressId":addressId}
			}
		}, function (err, doc) {
			if (err) {
				res.json({
					status : '1',
					msg : err.message,
					result : ''
				});
			} else {
				Users.findOne({"userId":userId},function (err, doc) {
					if (err) {
						res.json({
							status:'1',
							msg:err.message,
							result:''
						});
					} else {
						res.json({
							status:'0',
							msg:'',
							result:doc
						});
					}
				});
			}
		});
	}
});

/*选中收货地址接口*/
router.post('/chooseAddress', function(req, res, next) {
	let addressId = req.body.addressId;

	if (req.cookies.userId) {
		let userId = req.cookies.userId;

		Users.findOne({"userId":userId},function (err, user) {
			if (err) {
				res.json({
					status:'1',
					msg:err.message,
					result:''
				});
			} else {
				user.addressList.forEach((item)=>{
					item.ifChecked = 0;
				});

				user.save(function (err2, doc2) {
					if (err2) {
						res.json({
							status : '1',
							msg : err2.message,
							result : ''
						});
					} else {
						Users.update({
							"userId":userId,
							"addressList.addressId":addressId
						},{
							"addressList.$.ifChecked":'1'
						}, function (err3, doc3) {
							if (err3) {
								res.json({
									status : '1',
									msg : err3.message,
									result : ''
								});
							} else {
								Users.findOne({"userId":userId},function (err4, doc4) {
									if (err4) {
										res.json({
											status:'1',
											msg:err4.message,
											result:''
										});
									} else {
										res.json({
											status:'0',
											msg:'',
											result:doc4
										});
									}
								});
							}
						});
					}
				});
			}
		});
	}
});

/*确认支付生成订单*/
router.post('/surePay', function(req, res, next) {
	let addMsg = [];

	if (req.cookies.userId) {
		let userId = req.cookies.userId;

		Users.findOne({"userId":userId},function (err, user) {
			if (err) {
				res.json({
					status:'1',
					msg:err.message,
					result:''
				});
			} else {
				let total = 0;
				let neworderGoodsList = [];
				let oneGood = {};

				user.cartList.forEach((item)=>{
					if (item.checked == '1') {
						total += item.salePrice*item.productNumber;
						oneGood = {
							"productId":item.productId,
							"productName":item.productName,
							"salePrice":item.salePrice,
							"productImage":item.productImage,
							"productNumber":item.productNumber
						};
						neworderGoodsList.push(oneGood);
					}
				});
				user.addressList.forEach((item)=>{
					if (item.ifChecked == '1') {
						addMsg = item;
					}
				});

				var newId = Number(Math.random().toString().substr(3,7) + Date.now()).toString(36);
				var time = new Date()
				var strTime = time.toLocaleString();
				var newOrder = {
					"orderId":newId,
					"orderTotal":total,
					"orderTime":strTime,
					"addressInfo":{
						"addressId":addMsg.addressId,
						"addressUserName":addMsg.addressUserName,
						"addressMsg":addMsg.addressMsg,
						"postCode":addMsg.postCode,
						"tel":addMsg.tel
				  	},
					"orderGoodsList":neworderGoodsList
				}
				user.orderList.push(newOrder);
				user.save(function (err2, doc2) {
					if (err2) {
						res.json({
							status : '1',
							msg : err2.message,
							result : ''
						});
					} else {
						res.json({
							status : '0',
							msg : '订单下达成功',
							result : addMsg
						});
					}
				});
			}
		});
	}
});

/*删除购物车中已经被下为订单的商品*/
router.post('/delCartIschecked', function(req, res, next) {
	if (req.cookies.userId) {
		let userId = req.cookies.userId;

		Users.update({
			"userId":userId
		},{
			$pull:{
				"cartList":{"checked":'1'}
			}
		}, function (err, doc) {
			if (err) {
				res.json({
					status : '1',
					msg : err.message,
					result : ''
				});
			} else {
				Users.findOne({"userId":userId},function (err, doc) {
					if (err) {
						res.json({
							status:'1',
							msg:err.message,
							result:''
						});
					} else {
						res.json({
							status:'0',
							msg:'',
							result:doc.cartList
						});
					}
				});
			}
		});
	}
});

/*渲染订单页面*/
router.get('/orderShow', function(req, res, next) {
	if (req.cookies.userId) {
		let userId = req.cookies.userId;
		Users.findOne({"userId":userId},function (err, doc) {
			if (err) {
				res.json({
					status:'1',
					msg:err.message,
					result:''
				});
			} else {
				res.json({
					status:'0',
					msg:'',
					result:doc.orderList
				});
			}
		});
	}
});

/*确认收货*/
router.post('/sureReceivedGoods', function(req, res, next) {
	let orderId = req.body.orderId;

	if (req.cookies.userId) {
		let userId = req.cookies.userId;
		
		Users.update({
			"userId":userId
		},{
			$pull:{
				"orderList":{"orderId":orderId}
			}
		}, function (err, doc) {
			if (err) {
				res.json({
					status : '1',
					msg : err.message,
					result : ''
				});
			} else {
				Users.findOne({"userId":userId},function (err, doc) {
					if (err) {
						res.json({
							status:'1',
							msg:err.message,
							result:''
						});
					} else {
						res.json({
							status:'0',
							msg:'',
							result:doc.orderList
						});
					}
				});
			}
		});
	}
});

module.exports = router;
