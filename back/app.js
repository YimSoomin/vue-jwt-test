var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var bodyParser = require('body-parser')
var morgan = require('morgan')

var config = require('./config')


var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");

var app = express();

// app.use(
//   express.urlencoded({
//     extended: true,
//   })
// );
app.use(bodyParser.urlencoded({
  extended: false
}))


// json으로 바꿔줘야 함
// app.use(express.json());
app.use(bodyParser.json())

app.use(morgan('dev'))
app.set('jwt-secret', config.secret)
app.get('/', (req, res) => {
  res.send('asdsa')
})
// app.listen(3000, () => {
//     console.log(`Express is running on port 3000`)
// })

 

var usersRouter = require("./routes/users");
app.use("/api/users", usersRouter);

var mysql = require("mysql");
const { secret } = require("./config");
var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "6431",
  database: "vuestagram",
});
connection.connect(function (err) {
  if (err) {
    console.error("mysql connetion error");
    console.error(err);
    throw err;
  }
});

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;