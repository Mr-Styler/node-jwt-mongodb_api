const express = require('express');
const app = express();
const compression = require('compression');
const cors = require('cors');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');


const AppError = require('./utils/appError');
const { errorHandler } = require('./controllers/errorController');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const blogRoutes = require('./routes/blog');
const viewsRoutes = require('./routes/views');

app.use(compression());
app.use(cors({
  origin: 'http://localhost:3000'
}))
app.use(morgan("dev"));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'ejs');

app.use('/api/v1/auth', authRoutes)
app.use('/api/v1/users', userRoutes)
app.use('/api/v1/blogs', blogRoutes)
app.use('/', viewsRoutes)

app.all('*', (req, res, next) => {
    next(new AppError(`Cannot find ${req.originalUrl} on this server`, 404));
});

app.use(errorHandler)

module.exports = app;