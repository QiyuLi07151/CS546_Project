/*
You can choose to define all your middleware functions here, 
export them and then import them into your app.js and attach them that that.
add.use(myMiddleWare()). you can also just define them in the app.js if you like as seen in lecture 10's lecture code example. If you choose to write them in the app.js, you do not have to use this file. 
*/
const logger = (req, res, next) => {
  const isAuthenticated = req.session.user ? 'Authenticated' : 'Non-Authenticated';
  const role = req.session.user?.role || 'N/A';
  console.log(
    `[${new Date().toUTCString()}]: ${req.method} ${req.originalUrl} (${isAuthenticated} - ${role})`
  );

  if (req.path === '/') {
    if (req.session.user) {
      const redirectPath = req.session.user.IsOwner === 'false' ? '/index.html' : '/index.html';
      return res.redirect(redirectPath);
    } else {
      return res.redirect('/login.html');
    }
  }
  next();
};

// const allowUnauthenticated = (req, res, next) => {
//   if (req.session.user) {
//     console.log("I am in allowUnauthenticated");

//     const redirectPath = req.session.user.IsOwner === 'admin' ? '/administrator' : '/user';
//     return res.redirect(redirectPath);
//   }
//   next();
// };

const checkAuthenticated = (req, res, next) => {
  if (req.session.user) {
      return next();
  }
  res.redirect('/login.html');
};


const checkNotAuthenticated = (req, res, next) => {
  if (req.session.user) {
      return res.redirect('/');
  }
  next();
};

// const isAdmin = (req, res, next) => {
//   if (!req.session.user) {
//     return res.redirect('/signinuser');
//   }
//   if (req.session.user.role !== 'admin') {
//     return res
//       .status(403)
//       .render('error', { error: 'Access Denied: Admins Only', redirectLink: '/user' });
//   }
//   next();
// };

export default { logger, checkAuthenticated, checkNotAuthenticated };
