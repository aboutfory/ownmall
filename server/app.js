var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var goodsRouter = require('./routes/goods');
var rootRouter = require('./routes/roots');

var app = express();

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
