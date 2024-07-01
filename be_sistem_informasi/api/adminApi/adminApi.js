const {
    getadminByid,
    postadmin,
    LoginAdmin,
    logOutAdmin
} = require('../../controllers/adminController/adminController');

const express = require('express');

const Router = express.Router();

Router.get('/get-admin/:id', getadminByid); 
Router.post('/post-admin', postadmin);
Router.post('/login-admin', LoginAdmin);
Router.post('/logout-admin/:id', logOutAdmin);



//note :
//http://localhost:3556/api/v1/admin/get-admin/:id
//post admin = http://localhost:3556/api/v1/admin/post-admin
//login admin = http://localhost:3556/api/v1/admin/login-admin
//logout admin = http://localhost:3556/api/v1/admin/logout-admin

module.exports = Router;
