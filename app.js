import itemRoutes from './routes/items.js';
import userRoutes from './routes/users.js';
import tagRoutes from './routes//tags.js';
import express from 'express';
import session from 'express-session'
import path from 'path';
import middleware from './middleware.js';
import configRoutes from './routes/index.js'
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
    session({
        name: 'FinalProject',
        secret: "This is a secret",
        saveUninitialized: false,
        resave: false,
        cookie: { maxAge: 1800000 }
    })
);
app.use(middleware.logger);

app.use('/public', express.static('public'));
app.use('/static', express.static('static'));

configRoutes(app);
app.listen(3000, () => {
    console.log("We've now got a server!");
    console.log('Your routes will be running on http://localhost:3000');
});