//Here you will import route files and export the constructor method as shown in lecture code and worked in previous labs.

import itemRoutes from './items.js';
import userRoutes from './users.js';
import tagRoutes from './tags.js';
import path from 'path';
import middleware from '../middleware.js';

const constructorMethod = (app) => {

  app.use('/item', itemRoutes);
  app.use('/user', userRoutes);
  app.use('/tag', tagRoutes);

  app.get('/login.html', (req, res) => {
    res.sendFile(path.resolve('./static/login.html'));
  });
  app.get('/signup.html', (req, res) => {
    res.sendFile(path.resolve('./static/signup.html'));
  });
  app.get('/index.html', (req, res) => {
    res.sendFile(path.resolve('./static/index.html'));
  });
  app.get('/search.html', (req, res) => {
    res.sendFile(path.resolve('./static/search.html'));
  });
  app.get('/tags.html', (req, res) => {
    res.sendFile(path.resolve('./static/tags.html'));
  });
  app.get('/item.html', (req, res) => {
    res.sendFile(path.resolve('./static/item.html'));
  });
  app.get('/listing.html', (req, res) => {
    res.sendFile(path.resolve('./static/listing.html'));
  });
  app.get('/addItem.html', (req, res) => {
    res.sendFile(path.resolve('./static/addItem.html'));
  });
  app.get('/login.html', (req, res) => {
    res.redirect('/');
  });
  app.get('/wishlist.html', (req, res) => {
    res.sendFile(path.resolve('./static/wishlist.html'));
  });

  app.get('/logout', (req, res) => {
    req.session.destroy(err => {
      if (err) {
        console.log(err);
      }
      res.redirect('/');
    });
  });



  // app.get('/login.html', middleware.checkNotAuthenticated, (req, res) => {
  //   res.sendFile(path.resolve('./static/login.html'));
  // });
  // app.get('/signup.html', middleware.checkNotAuthenticated, (req, res) => {
  //   res.sendFile(path.resolve('./static/signup.html'));
  // });
  // app.get('/index.html', middleware.checkAuthenticated, (req, res) => {
  //   res.sendFile(path.resolve('./static/index.html'));
  // });
  // app.get('/search.html', middleware.checkAuthenticated, (req, res) => {
  //   res.sendFile(path.resolve('./static/search.html'));
  // });
  // app.get('/tags.html', middleware.checkAuthenticated, (req, res) => {
  //   res.sendFile(path.resolve('./static/tags.html'));
  // });
  // app.get('/item.html', middleware.checkAuthenticated, (req, res) => {
  //   res.sendFile(path.resolve('./static/item.html'));
  // });
  // app.get('/listing.html', middleware.checkAuthenticated, (req, res) => {
  //   res.sendFile(path.resolve('./static/listing.html'));
  // });
  // app.get('/login.html', middleware.checkNotAuthenticated, (req, res) => {
  //   res.redirect('/');
  // });

  // app.get('/logout', middleware.checkAuthenticated, (req, res) => {
  //   req.session.destroy(err => {
  //     if (err) {
  //       console.log(err);
  //     }
  //     res.redirect('/');
  //   });
  // });

  app.use('/', (req, res) => {
    res.sendFile(path.resolve('./static/index.html'));
  });

  app.use('*', (req, res) => {
    res.status(404).json({ error: '404 Not found' });
  });
};




export default constructorMethod;