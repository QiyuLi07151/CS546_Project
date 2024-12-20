import { Router } from "express";
const router = Router();
import bcrypt from 'bcryptjs'
import session from 'express-session'
import * as userData from "../data/users.js";
import * as itemData from "../data/items.js"
import * as adData from "../data/ads.js"
import { ObjectId } from "mongodb";
import * as validation from "../helpers.js";
import xss from "xss";
/*
XIAO
Completed
/user/ : id
Method : get
@param Id(String)
@return JSON Object{}
*/
router.get("/userId", async (req, res) => {

  try {
    //pre check
    let userId = req.query.userId;
    validation.isProvided(userId);
    userId = validation.isValidString(userId);
    validation.isValidObjectId(userId);

    // get user 
    const user = await userData.getUserById(userId);

    // return
    return res.status(200).json(user);
  } catch (error) {
    const errorMessage = error.message || error;
    if (errorMessage.includes("No user found with the given userId")) {
      return res.status(404).json({ error: "No user found with the given userId" });
    } else {
      return res.status(400).json({ error: errorMessage });
    }
  }
});



// /*
// XIAO
// Completed
// /user/ : id
// Method : get
// @param Id(String)
// @return JSON Object{}
// */
// router.get("/userId", async (req, res) => {

//   try {
//     //pre check
//     let userId = req.query.userId;
//     validation.isProvided(userId);
//     userId = validation.isValidString(userId);
//     validation.isValidObjectId(userId);

//     // get user 
//     const user = await userData.getUserById(userId);

//     // return
//     return res.status(200).json(user);
//   } catch (error) {
//     const errorMessage = error.message || error;
//     if (errorMessage.includes("No user found with the given userId")) {
//       return res.status(404).json({ error: "No user found with the given userId" });
//     } else {
//       return res.status(400).json({ error: errorMessage });
//     }
//   }
// });

// router.post('/login', async (req, res) => {
//   const { Name, Password } = req.body;
//   try {
//     const user = await userData.getUserByName(Name);

//     if (!user) {
//       throw 'Invalid username or password';
//     }

//     const isValidPassword = await bcrypt.compare(Password, user.Password);

//     if (!isValidPassword) {
//       throw 'Invalid username or password';
//     }

//     req.session.user = {
//       _id: user._id,
//       IsOwner: user.IsOwner
//     };
//     const role = user.IsOwner ? 'Seller' : 'Buyer';
//     res.status(200).json({ message: 'Login Successful-' + role, role: role });
//   } catch (e) {
//     res.status(400).json({ error: e });
//   }
// });

// router.post('/register', async (req, res) => {
//   const { Name, Password, IsOwner } = req.body;

//   try {
//     const user = await userData.getUserByName(Name);

//     if (user) {
//       throw 'User already exists';
//     }

//     const hashedPassword = await bcrypt.hash(Password, 10);

//     await userData.addUser(Name, hashedPassword, IsOwner);

//     res.status(200).json({ message: 'User Registration Successful' });
//   } catch (e) {
//     res.status(400).json({ error: e });
//   }
// });



// router.route("/login")
//   .get(async (req, res) => {
//     res.render('login', { title: 'Login' });
//   })
//   .post(async (req, res) => {
//     const { username, password } = req.body;
//     try {
//       const user = await userData.getUserByName(username);

//       if (!user) {
//         throw 'Invalid username or password';
//       }

//       const isValidPassword = await bcrypt.compare(password, user.Password);

//       if (!isValidPassword) {
//         throw 'Invalid username or password';
//       }

//       req.session.user = user;
//       res.redirect('/user');
//     } catch (e) {
//       res.status(400).render('login', { title: 'Login', error: e });
//     }
//   });


// router.route('/register')
//   .get(async (req, res) => {
//     res.render('signup', { title: 'Register' });
//   })
//   .post(async (req, res) => {
//     const { username, password, IsOwner } = req.body;

//     try {
//       let user = await userData.getUserByName(username);

//       if (user) {
//         throw 'User already exists';
//       }

//       const hashedPassword = await bcrypt.hash(password, 10);

//       await userData.addUser(username, hashedPassword, IsOwner);

//       user = await userData.getUserByName(username);
//       req.session.user = user;
//       res.redirect('/user');
//     } catch (e) {
//       res.status(400).render('signup', { title: 'Register', error: e });
//     }
//   });



router.post('/login', async (req, res) => {
  const { Name, Password } = req.body;

  try {
    const user = await userData.getUserByName(Name);

    if (!user) {
      throw 'Invalid username or password';
    }

    const isValidPassword = await bcrypt.compare(Password, user.Password);

    if (!isValidPassword) {
      throw 'Invalid username or password';
    }

    req.session.user = {
      _id: user._id,
      IsOwner: user.IsOwner
    };
    const role = user.IsOwner ? 'Seller' : 'Buyer';
    res.status(200).json({ message: 'Login Successful-' + role, role: role });
  } catch (e) {
    res.status(400).json({ error: e });
  }
});

router.post('/register', async (req, res) => {
  const { Name, Password, IsOwner } = req.body;

  try {
    const user = await userData.getUserByName(Name);

    if (user) {
      throw 'User already exists';
    }

    const hashedPassword = await bcrypt.hash(Password, 10);

    await userData.addUser(Name, hashedPassword, IsOwner);

    res.status(200).json({ message: 'User Registration Successful' });
  } catch (e) {
    res.status(400).json({ error: e });
  }
});

router.post("/updateFavoriteItem", async (req, res) => {
  const { userId, itemId } = req.body;
  try {
    validation.isProvided(userId);
    validation.isProvided(itemId);
    validation.isValidString(userId);
    validation.isValidObjectId(itemId);
    // userId = validation.isValidString(userId);
    // validation.isValidObjectId(userId);
    // itemId = validation.isValidString(itemId);
    // validation.isValidObjectId(itemId);
    const result = await userData.updateFavoriteItem(userId, itemId);
    if (!result) return res.status(404).json({ error: "Either userId or itemId not found." });
    return res.status(200).json(result);
  } catch (error) {
    return res.status(400).json({ error: error });
  }
});

router.post("/currentFavorite", async (req, res) => {
  const { userId, itemId } = req.body;
  try {
    validation.isProvided(userId);
    validation.isProvided(itemId);
    validation.isValidString(userId);
    validation.isValidObjectId(itemId);
    // userId = validation.isValidString(userId);
    // validation.isValidObjectId(userId);
    // itemId = validation.isValidString(itemId);
    // validation.isValidObjectId(itemId);
    const result = await userData.currentFavorite(userId, itemId);
    if (!result) return res.status(404).json({ error: "Either userId or itemId not found." });
    return res.status(200).json(result);
  } catch (error) {
    return res.status(400).json({ error: error });
  }
});

router.get("/wishlist", async (req, res) => {
  try {
    if (!req.session.user) {
      return res.status(400).json({ error: "Not logged in" });
    }
    let wishlistItems = [];
    let user = await userData.getUserById(req.session.user._id);
    if (!user.Wishlist) {
      res.status(200).json([]);
    } else {
      for (const itemId of user.Wishlist) {
        const item = await itemData.getItemById(itemId);
        if (item) {
          wishlistItems.push(item);
        }
      }
      res.status(200).json(wishlistItems);
    }
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to fetch wishlist" });
  }
});


router.get('/currentUserId', (req, res) => {
  if (req.session.user) {
    res.json({ userId: req.session.user._id.toString() });
  } else {
    res.status(401).json({ error: 'not logged in' });
  }
});

router.get('/currentUserIsOwner', (req, res) => {
  if (req.session.user) {
    res.json({ isOwner: req.session.user.IsOwner });
  } else {
    res.status(401).json({ error: 'not logged in' });
  }
});

router.get('/isMadeReview', async (req, res) => {
  const { itemId, userName } = req.query;
  try {
    validation.isProvided(itemId);
    validation.isValidString(itemId);
    validation.isValidObjectId(itemId);
    validation.isProvided(userName);
    validation.isValidString(userName);
  } catch (e) {
    return res.status(400).json({ error: e });
  }
  try {
    const user = await userData.getUserByName(userName);
    const userId = user._id;
    const item = await itemData.getItemById(itemId);
    const hasReviewed = item.Reviews.some(review => review.UserId.equals(userId));

    return res.status(200).json({ isMadeReview: hasReviewed });
  } catch (e) {
    return res.status(404).json({ error: e });
  }
})
router.get('/getUserIdByName', async (req, res) => {
  const userName = req.query.userName;
  try {
    validation.isProvided(userName);
    validation.isValidString(userName);
  } catch (e) {
    return res.status(400).json({ error: e });
  }
  try {
    const user = await userData.getUserByName(userName);
    const userId = user._id;


    return res.status(200).json({ userId: userId.toString() });
  } catch (e) {
    return res.status(404).json({ error: e });
  }
})



router.get("/advertisements", async(req, res) => {
  try {
    let advertisements = await adData.getAd(3);
      res.status(200).json({ advertisements });
  } catch (error) {
      console.error("Error fetching advertisements:", error);
      res.status(500).json({ error: "Failed to fetch advertisements" });
  }
});


router.post("/advertisements", async(req, res) => {
  try {
      const { Image, ItemName, Title, Description } = req.body;

      if (!Image || !ItemName || !Title || !Description) {
          return res.status(400).json({ error: "All fields are required" });
      }
      //Image = xss(Image);
      //ItemName = xss(ItemName);
      //Title = xss(Title);
      //Description = xss(Description);
      const newAd = { Image, ItemName, Title, Description };
      console.log(newAd)
      await adData.addAd(newAd);
      res.status(201).json({ message: "Advertisement added successfully!" });
  } catch (error) {
      console.error("Error adding advertisement:", error);
      res.status(500).json({ error: "Failed to add advertisement" });
  }
});


export default router;