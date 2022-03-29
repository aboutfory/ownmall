var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var multipart=require('multiparty');
var path=require('path');
var fs= require('fs');
var Goods = require('../model/goods');
var Users = require('../model/users');
var Roots = require('../model/roots');


/*管理员登陆*/
router.post('/', function(req, res, next) {
  let rootName = req.body.rootName;
  let rootPassword = req.body.rootPassword;

  Roots.findOne({
  	"rootName" : rootName,
  },function (err, doc) {
		if (err) {
			res.json({
				status : '1',
				msg : err.message,
				result : ''
			});
		} else {
			if (doc) {
				if (doc.rootPassword == rootPassword) {
					res.cookie("rootName",doc.rootName,{
						path:'/',
						maxAge:1000*60*60
					});
					res.json({
						status : '0',
						msg : '',
						result : doc
					});
				} else {
					res.json({
						status : '1',
						msg : '管理员账户或密码不正确',
						result : ''
					});
				}
			} else {
				res.json({
					status : '1',
					msg : '管理员账户或密码不正确',
					result : ''
				});
			}
		}
	});
});

/*商品管理页面检测是否登陆*/
router.post('/checkIf', function(req, res, next) {
	if (req.cookies.rootName) {
		let rootName = req.cookies.rootName;
		Roots.findOne({"rootName":rootName},function (err, doc) {
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

/*管理员注销*/
router.post('/register', function(req, res, next) {
	res.cookie("rootName","",{
		path:"/",
		maxAge:-1
	});
	res.json({
		status:'0',
		msg:'注销成功',
		result:''
	});
});

/*全部商品的展示*/
router.get('/allGoods', function(req, res, next) {
	if (req.cookies.rootName) {
		Goods.find({}, function (err, doc) {
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
				result : doc
			});
		}
		});
	}
});

/*搜索商品*/
router.get('/serch', function(req, res, next) {
	if (req.cookies.rootName) {
		let productSerchKey = req.param("productSerchKey");
		let pa;
		if (productSerchKey == '') {
			pa = {};
		} else {
			pa = {"productSerchKey" : productSerchKey}
		}
		Goods.find(pa, function (err, doc) {
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
					result : doc
				});
			}
		});
	}
});

/*删除商品*/
router.post('/del', function(req, res, next) {
	let productId = req.body.productId;
	let productImage = req.body.productImage;
	if (req.cookies.rootName) {
		Goods.remove({
			"productId":productId
		}, function (err, doc) {
			if (err) {
				res.json({
					status : '1',
					msg : err.message,
					result : ''
				});
			} else {
				var filepath = '../../static/picture/'+productImage;
				fs.unlink(filepath, function(err){
				 if(err){
				  throw err;
				 }
				 console.log('文件:'+filepath+'删除成功！');
				})
				Goods.find({},function (err1, doc1) {
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
							result:doc1
						});
					}
				});
			}
		});
	}
});

/*改名并存储图片*/
router.post('/addGoodImg', function(req, res, next) {
	if (req.cookies.rootName) {
	    let form=new multipart.Form({uploadDir:'../../static/picture'});
	    form.parse(req,function (err,filds,files) {
	        if(err){
	            res.json({
					status : '1',
					msg : err.message,
					result : ''
				});
	        }
	        else{
	            let inputFile=files.avatar[0];
	            let extname= path.extname(inputFile.originalFilename);
	            let oldname=inputFile.path;
	            var newExtName = Number(Math.random().toString().substr(3,7) + Date.now()).toString(36);
	            let resName = newExtName+extname;

	            let newname = '../../static/picture/'+newExtName+extname; 
	            fs.rename(oldname,newname,(err1)=>{
                if(err1){
                    res.json({
						status : '1',
						msg : err1.message,
						result : ''
					});
                }
                else{
                    res.json({
						status : '0',
						msg : '',
						result : resName
					});
                }
            });
	        }
	    });
	}
});

/*像数据库存储添加商品信息*/
router.post('/addGood', function(req, res, next) {
	let productName = req.body.productName;
	let productSerchKey = req.body.productSerchKey;
	let salePrice = parseInt(req.body.salePrice);
	let productImage = req.body.productImage;
	let productMessage = req.body.productMessage;
	let nowHave = false;

	if (req.cookies.rootName) {
	    Goods.find({},function (err, doc) {
			if (err) {
				res.json({
					status : '1',
					msg : err.message,
					result : ''
				});
			} else {
				if (doc) {
					doc.forEach(function (item) {
						if (item.productName == productName) {
							nowHave = true;
						}
					})

					if (nowHave) {
						res.json({
							status : '1',
							msg : '当前商品已经存在',
							result : ''
						});
					} else {
						var newProId = Number(Math.random().toString().substr(3,7) + Date.now()).toString(36);
						var newGood = new Goods({
							"productId" : newProId,
							"productName" : productName,
							"productSerchKey" : productSerchKey,
							"salePrice" : salePrice,
							"productImage" : productImage,
							"productMessage" : productMessage
						});
						newGood.save(function (err2, doc2) {
							if (err2) {
								res.json({
									status : '1',
									msg : err2.message,
									result : ''
								});
							} else {
								res.json({
									status : '0',
									msg : '商品添加成功',
									result : ''
								});
							}
						});
					}
				}
			}
		});
	}
});

/*点取消删除已经存在文件夹的图片*/
router.post('/delImg', function(req, res, next) {
	let productImage = req.body.productImage;

	if (req.cookies.rootName) {
	    var filepath = '../../static/picture/'+productImage;
		fs.unlink(filepath, function(err){
		if(err){
		  throw err;
		}
		 console.log('文件:'+filepath+'删除成功！');
		})
	}
});

/*修改商品信息*/
router.post('/changeGood', function(req, res, next) {
	let productId = req.body.productId;
	let productName = req.body.productName;
	let productSerchKey = req.body.productSerchKey;
	let salePrice = parseInt(req.body.salePrice);
	let productImage = req.body.productImage;
	let productMessage = req.body.productMessage;
	if (req.cookies.rootName) {
	    Goods.findOne({
			"productId":productId
		}, function (err, doc) {
			if (err) {
				res.json({
					status : '1',
					msg : err.message,
					result : ''
				});
			} else {
				if (productImage) {
					var filepath = '../../static/picture/'+doc.productImage;
					fs.unlink(filepath, function(err){
					if(err){
					  throw err;
					  return;
					}
					 console.log('原图片文件:'+filepath+'删除成功！');
					})
				}

				productName = productName?productName:doc.productName;
				productSerchKey = productSerchKey?productSerchKey:doc.productSerchKey;
				salePrice = salePrice?salePrice:doc.salePrice;
				productImage = productImage?productImage:doc.productImage;
				productMessage = productMessage?productMessage:doc.productMessage;
				
				doc.productName = productName;
				doc.productSerchKey = productSerchKey;
				doc.salePrice = salePrice;
				doc.productImage = productImage;
				doc.productMessage = productMessage;
				doc.save(function (err2, doc2) {
					if (err2) {
						res.json({
							status : '1',
							msg : err2.message,
							result : ''
						});
					} else {
						Goods.find({}, function (err3, doc3) {
							if (err3) {
								res.json({
									status : '1',
									msg : err3.message,
									result : ''
								});
							} else {
								res.json({
									status : '0',
									msg : '修改成功',
									result : doc3
								});
							}
						});
					}
				});
			}
		});
	}
});

module.exports = router;
