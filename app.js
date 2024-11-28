// import itemRoutes from './routes/items.js';
// import express from 'express';
// const app = express();

// app.use('/public', express.static('public'));
// app.use('/item', itemRoutes);
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use('*', (req, res) => {
//     res.status(404).json({ error: '404 Not found' });
// });
// app.listen(3000, () => {
//     console.log("We've now got a server!");
//     console.log('Your routes will be running on http://localhost:3000');
// });

import * as itemData from './data/items.js';
import {closeConnection} from './config/mongoConnection.js';
const items = await itemData.getAllItems();
console.log(items);
const _item = await itemData.getItemById(items[0]._id);
console.log(_item);
console.log("Done!");
closeConnection();