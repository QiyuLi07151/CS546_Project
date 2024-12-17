# CS546_Project - ShopVista

This project is a Tag-Based Online Marketplace is a web-based platform designed for sellers to list specialized products and for buyers to browse products using a dynamic tag-based classification system. The platform will allow sellers to add products with multiple customizable tags, enabling buyers to find products based on relevant tags. Buyers can upvote tags they find useful, helping others find popular products more easily.

## Features

- Product Creation with Tags:
    Sellers can add products by filling out forms with fields for name, description, price, image, and tags. The system allows multiple tags for a single product, stored in a tags collection within MongoDB. 

- Dynamic Tag-Based Browsing: 
    Buyers can browse products by clicking on tags, which will dynamically filter the product list. We used asynchronous requests (AJAX) to update the product list without page reloads.

- Tag Feedback System: 
    Buyers can upvote tags to signal their usefulness. 

- Algorithm for Product Display: 
    The platform displays products based on the relevance of their tags.

- Recommendated Products Based On Tags: 
    The product details page has a list of recommendations which are products with similar tags to the product on the page. 

- Advertisement Carousel: 
    The home page has advertisement carousel listing products that the admin users put up for advertisement. 


## Tech Stack

This project is built using the following technologies:

- Node.js: Server-side JavaScript runtime
- Express.js: Web application framework
- MongoDB: Database for data storage
- Frontend Stack: HTML, CSS, JavaScript

## Installation

1. Clone the repository:  
   [git clone https://github.com/QiyuLi07151/CS546_Project](https://github.com/QiyuLi07151/CS546_Project.git)
   cd CS546_Project

2. Install dependencies:
    npm install

3. Run the project:
    npm start

4. Open your browser and visit:
    http://localhost:3000


## Project Structure

```
CS546_Project
├─ app.js
├─ config
│  ├─ mongoCollections.js
│  └─ mongoConnection.js
├─ data
│  ├─ ads.js
│  ├─ items.js
│  ├─ tags.js
│  └─ users.js
├─ helpers.js
├─ middleware.js
├─ package.json
├─ public
│  ├─ css
│  │  ├─ addItem.css
│  │  ├─ base.css
│  │  ├─ item.css
│  │  ├─ listing.css
│  │  ├─ login.css
│  │  ├─ main.css
│  │  ├─ signup.css
│  │  ├─ tags.css
│  │  └─ wishlist.css
│  ├─ images
│  │  ├─ 1.jpeg
│  │  ├─ 1.jpg
│  │  ├─ 2.jpeg
│  │  ├─ 2.jpg
│  │  ├─ ad1.jpg
│  │  ├─ ad2.jpg
│  │  ├─ ad3.jpg
│  │  └─ no_image.jpeg
│  └─ js
│     ├─ adCarousel.js
│     ├─ addAdvertisement.js
│     ├─ addItem.js
│     ├─ item.js
│     ├─ listing.js
│     ├─ login.js
│     ├─ main.js
│     ├─ search.js
│     ├─ signup.js
│     ├─ tags.js
│     └─ wishlist.js
├─ README.md
├─ routes
│  ├─ index.js
│  ├─ items.js
│  ├─ tags.js
│  └─ users.js
├─ static
│  ├─ addItem.html
│  ├─ advertisement.html
│  ├─ index.html
│  ├─ item.html
│  ├─ listing.html
│  ├─ login.html
│  ├─ search.html
│  ├─ signup.html
│  ├─ tags.html
│  └─ wishlist.html
```


## Developers: 

Hangming Zhang, Huyou Wei,  Bin Xiao, Xiaorui Guo, Qiyu Li