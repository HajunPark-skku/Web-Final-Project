const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const app = express();
const session = require('express-session');
const loginRouter = require('./routes/login');
const successRouter = require('./routes/success');
const signupRouter = require('./routes/signup');
const logoutRouter = require("./routes/logout");

const connect = require('./models');

app.set("port", process.env.PORT || 3000);


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(
    session({
        secret: 'mysecretkey3048', 
        resave: false,
        saveUninitialized: true,
        cookie: { maxAge: 10 * 60 * 1000 } 
    })
)
connect();

app.use((req, res, next) => {
    const timestamp = new Date().toISOString();
    console.log(`${timestamp}: ${req.method} ${req.url}`);
    next();
});

app.use("/", express.static(path.join(__dirname, "public")));
app.use(express.json({extended: true}));
app.use(express.urlencoded({extended: true}));

app.use("/login", loginRouter);
app.use("/success", successRouter);
app.use("/signup", signupRouter);

app.get("/", (req, res) => {
    res.redirect("/login");
});

app.use("/logout", logoutRouter);


const postsRouter = require("./routes/posts");
app.use("/main", postsRouter);  

// 서버 실행
app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
