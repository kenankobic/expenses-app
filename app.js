const express = require('express');
const createError = require('http-errors');
const morgan = require('morgan');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan('dev'));


/**
 * Import Routes
 */
const {
  usersRoutes,
  expensesRoutes,
  notesRoutes
} = require('./routes');

app.use('/notes', notesRoutes)
app.use('/expenses', expensesRoutes)
app.use(usersRoutes)


app.use((req, res, next) => {
  next(createError.NotFound());
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send({
    status: err.status || 500,
    message: err.message,
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 @ http://localhost:${PORT}`));
