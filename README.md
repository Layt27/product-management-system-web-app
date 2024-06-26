<h1 align="center">
  <img src="https://github.com/Layt27/product-management-system-web-app/assets/122161035/d67e340f-11ff-4043-abbe-26f1ff90b4b9" alt="logo" width="25%" height="25%">
  <br>
  Product Management System
</h1>

## Description

Product Management System is a comprehensive web application that enables users to perform CRUD operations on products.


## Built with

The following frameworks and libraries were used to build our Automated Attendance System (AAS):

* [![Node][Node.js]][Node-url]
* [![Express][Express.js]][Express-url]
* [![React][React.js]][React-url]
* [![MongoDB][MongoDB]][MongoDB-url]
* [![JavaScript][JavaScript]][JavaScript-url]



[Node.js]: https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white
[Node-url]: https://nodejs.org/en
[Express.js]: https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB
[Express-url]: https://expressjs.com/
[React.js]: https://img.shields.io/badge/React-000000?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://reactjs.org/
[MongoDB]: https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white
[MongoDB-url]: https://www.mongodb.com/
[JavaScript]: https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E
[JavaScript-url]: https://developer.mozilla.org/en-US/docs/Web/JavaScript

## Features

- Log in
- Sign up
- Add a product
- Update a product
- Delete a product
- Search for a product
- Edit account details
- Log out



## Prerequisites
Before you begin, you will need to have the following installed and configured on your system:

* npm and Node.js: You can download and install these from the official website: https://nodejs.org/en/
* MongoDB Atlas: You will need to have a MongoDB Atlas account to create a cluster and view or manage the collections created. You can access MongoDB Atlas from the official website: https://www.mongodb.com/atlas.
* A backend .env file: You will need to create a .env file in `backend/` with the necessary configurations. You can use the provided .env file as a template.

    ```.env
        # Configuration Settings
        PORT = <custom-port-number>
        CONNECTION = <connection-string>
        JWT_KEY = <user-specified-key>
    ```
* A frontend .env file: You will need to create a .env file in `frontend/` with the necessary configurations. You can use the provided .env file as a template.

    ```.env
        # Backend URL
        REACT_APP_BACKEND_URL = <local-host-url>
    ```
## Getting Started

Clone the project
```shell
  git clone https://github.com/Layt27/product-management-system-web-app
```

Go to the project directory
```shell
  cd product-management-system-web-app
```



### Setting Up Manually

#### Setup API

Go to the backend directory
```shell
  cd backend
```

Install backend dependencies
```shell
  npm install
```

#### Setup Client

Go to the frontend directory
```shell
  cd frontend
```

Install frontend dependencies 
```shell
  npm install
```

## Running Locally

### Run API locally

In the `index.js` file within the `backend/` folder, replace:
```shell
  app.use(cors({
    origin: 'https://product-management-system-wa.vercel.app',
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
    optionsSuccessStatus: 200
  }));
```

with:
```shell
  app.use(cors({origin: '*'}));
```

Go to the project directory
```shell
  cd product-management-system-web-app
```

Go to the backend directory
```shell
  cd backend
```

Start API
```shell
  npm run start
```

### Run Client Locally

Go to the project directory
```shell
  cd product-management-system-web-app
```

Go to the frontend directory
```shell
  cd frontend
```

Start Client
```shell
  npm start
```

* API runs on http://localhost:3005
* Client runs on http://localhost:3000


### Landing / Log in Page
![login_page](https://github.com/Layt27/product-management-system-web-app/assets/122161035/f2bea69e-310c-41a7-b2e4-d234c59cc68e)

To log in, use these placeholder credentials:
```
Email: 'user123@abc.com'
Password: 'user123'
```

Alternate user:
```
Email: 'user456@abc.com'
Password: 'user456'
```


## Link to Deployed Web App
https://product-management-system-wa.vercel.app
