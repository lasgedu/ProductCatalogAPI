Product Catalog API
Overview
This is a RESTful API for managing a product catalog, designed to support an e-commerce platform. The API allows users to perform CRUD operations on products, organize them into categories, search for products, track inventory, and apply pricing and discounts.
Features

* User authentication and authorization (JWT-based)
* CRUD operations for products and categories
* Role-based access control (Admin/Customer)
* Search and filtering functionality
* Product variants (e.g., size, color)
* Inventory tracking
* Error handling and validation

Technologies Used

* Node.js
* Express.js
* MongoDB (with Mongoose ORM)
* JSON for data exchange
* Postman for API testing
* JWT for authentication

Installation

1. 
Clone this repository:
shDownloadCopy code Wrapgit clone https://github.com/ayadeleke/ProductCatalogAPI.git
cd ProductCatalogAPI

2. 
Install dependencies (refer to package.json for the full list):
shDownloadCopy code Wrapnpm install

3. 
Set up a .env file for environment variables:
MONGO_URI=mongodb://localhost:27017/product_catalog
PORT=3000
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development


4. 
Start the server:
shDownloadCopy code Wrapnpm start
Or for development with auto-restart:
shDownloadCopy code Wrapnpx nodemon server.js
The API will run on http://localhost:3000.


API Endpoints
All endpoints are prefixed with /api/ for consistency (e.g., /api/products).
1. Authentication & User Management

* 
Register a new user:
httpDownloadCopy code WrapPOST http://localhost:3000/api/auth/register
Request Body:
jsonDownloadCopy code Wrap{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword",
  "role": "admin"
}

* 
Login user:
httpDownloadCopy code WrapPOST http://localhost:3000/api/auth/login
Request Body:
jsonDownloadCopy code Wrap{
  "email": "john@example.com",
  "password": "securepassword"
}

* 
Get all users (Admin Only):
httpDownloadCopy code WrapGET http://localhost:3000/api/users
Authorization: Bearer <jwt-token>


2. Product Management


Create a product (Admin Only):
httpDownloadCopy code WrapPOST http://localhost:3000/api/products
Content-Type: application/json
Authorization: Bearer <jwt-token>
Request Body:
jsonDownloadCopy code Wrap{
  "name": "Nike Shoes",
  "description": "Some Nike shoes Descriptions",
  "category": "Shoes",
  "price": 99.99,
  "stock": 50,
  "image": "null",
  "variants": [
      { "size": "M", "color": "Red", "quantity": 5 },
      { "size": "L", "color": "Blue", "quantity": 10 }
  ]
}

* 
Get all products:
httpDownloadCopy code WrapGET http://localhost:3000/api/products
Response Body (Example):
jsonDownloadCopy code Wrap{
  "success": true,
  "data": [
    {
      "name": "Nike Shoes",
      "description": "Comfortable running shoes",
      "category": "Shoes",
      "price": 99.99,
      "stock": 50,
      "image": "null",
      "variants": [
        { "size": "M", "color": "Red", "quantity": 5 },
        { "size": "L", "color": "Blue", "quantity": 10 }
      ]
    }
  ]
}

* 
Get a specific product:
httpDownloadCopy code WrapGET http://localhost:3000/api/products/:id

* 
Update a product (Admin Only):
httpDownloadCopy code WrapPUT http://localhost:3000/api/products/:id
Content-Type: application/json
Authorization: Bearer <jwt-token>

* 
Delete a product (Admin Only):
httpDownloadCopy code WrapDELETE http://localhost:3000/api/products/:id
Authorization: Bearer <jwt-token>


3. Category Management

* 
Create a category (Admin Only):
httpDownloadCopy code WrapPOST http://localhost:3000/api/categories
Content-Type: application/json
Authorization: Bearer <jwt-token>
Request Body:
jsonDownloadCopy code Wrap{
  "name": "Electronics",
  "description": "Electronic devices and gadgets"
}

* 
Get all categories:
httpDownloadCopy code WrapGET http://localhost:3000/api/categories

* 
Get a specific category:
httpDownloadCopy code WrapGET http://localhost:3000/api/categories/:id

* 
Update a category (Admin Only):
httpDownloadCopy code WrapPUT http://localhost:3000/api/categories/:id
Authorization: Bearer <jwt-token>

* 
Delete a category (Admin Only):
httpDownloadCopy code WrapDELETE http://localhost:3000/api/categories/:id
Authorization: Bearer <jwt-token>


4. Search and Filtering

* 
Search by name or description:
httpDownloadCopy code WrapGET http://localhost:3000/api/products?search=nike

* 
Filter by price range:
httpDownloadCopy code WrapGET http://localhost:3000/api/products?minPrice=50&maxPrice=200

* 
Filter by stock availability:
httpDownloadCopy code WrapGET http://localhost:3000/api/products?inStock=true


Error Handling
The API returns structured error messages. Example:
jsonDownloadCopy code Wrap{
  "success": false,
  "message": "Product not found"
}
Testing

* Use Postman or cURL for API testing.
* Examples:

curl -X GET http://localhost:3000/api/categories
curl -X GET http://localhost:3000/api/products


* Run automated tests (if implemented):
shDownloadCopy code Wrapnpm test