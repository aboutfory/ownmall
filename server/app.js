var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors')

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var goodsRouter = require('./routes/goods');
var rootRouter = require('./routes/roots');

var app = express();

app.use(cors({
	origin:true,//允许该域名下的请求
	methods:["GET","POST"],　　　　　　//　　允许接受的 请求类型
	alloweHeaders:['Conten-Type','Authorization','Accept','Origin'],　　//请求头
	exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
	credentials: true, // 发送cookie
}));

// app.all('*', function(req, res, next) {
// 	res.header("Access-Control-Allow-Origin", req.headers.origin);
// 	res.header('Access-Control-Allow-Credentials: true'); 　　//是否支持cookie跨域
// 	res.header("Access-Control-Allow-Headers", "X-Requested-With");
// 	res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
// 	res.header("X-Powered-By",' 3.2.1')
// 	res.header("Content-Type", "application/json;charset=utf-8");
// 	if(req.method=="OPTIONS") res.send(200);
// 	next();
// });

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

/*自定义拦截  未登陆不允许加入购物车*/
app.use(function (req,res,next) {
	if (req.cookies.userId) {
		next();
	}else {
		if (req.originalUrl=='/goods/addCart') {
			res.json({
				status:'100001',
				msg:'当前未登录',
				result:''
			});
		}else {
			next();
		}
	}
});

/*app.use('/goods/addCart',function (req,res,next) {
	if (req.cookies.userId) {
		next();
	}else {
		res.json({
			status:'100001',
			msg:'当前未登录',
			result:''
		});
}
});
*/

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/goods', goodsRouter);
app.use('/roots', rootRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
