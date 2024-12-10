import itemRoutes from './routes/items.js';
import userRoutes from './routes/users.js';
import tagRoutes from './routes//tags.js';
import express from 'express';
import session from 'express-session'
import path from 'path';
import middleware from './middleware.js';
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
app.get('/login.html', middleware.checkNotAuthenticated, (req, res) => {
    res.sendFile(path.resolve('./static/login.html'));
});
app.get('/signup.html', middleware.checkNotAuthenticated, (req, res) => {
    res.sendFile(path.resolve('./static/signup.html'));
});
app.get('/index.html', middleware.checkAuthenticated, (req, res) => {
    res.sendFile(path.resolve('./static/index.html'));
});
app.get('/search.html', middleware.checkAuthenticated, (req, res) => {
    res.sendFile(path.resolve('./static/search.html'));
});
app.get('/tags.html', middleware.checkAuthenticated, (req, res) => {
    res.sendFile(path.resolve('./static/tags.html'));
});
app.get('/item.html', middleware.checkAuthenticated, (req, res) => {
    res.sendFile(path.resolve('./static/item.html'));
});
app.get('/listing.html', middleware.checkAuthenticated, (req, res) => {
    res.sendFile(path.resolve('./static/listing.html'));
});

app.use('/item', itemRoutes);
app.use('/user', userRoutes);
app.use('/tag', tagRoutes);

app.get('/login.html', middleware.checkNotAuthenticated, (req, res) => {
    res.redirect('/');
});

app.get('/logout', middleware.checkAuthenticated, (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.log(err);
        }
        res.redirect('/');
    });
});

app.use('/', (req, res) => {
    res.sendFile(path.resolve('./static/index.html'));
});

app.use('*', (req, res) => {
    res.status(404).json({ error: '404 Not found' });
});
app.listen(3000, () => {
    console.log("We've now got a server!");
    console.log('Your routes will be running on http://localhost:3000');
});