const {getUserByIdDecrypt,getAllUser,getPaginateUser,getUserById,postUser,postManyUser,updateuserById,deleteUserById,getUserByName} = 
require('../../controllers/userController/userController');
const express = require('express');
const Router = express.Router();

Router.get('/get',getAllUser);
Router.get('/get-name',getUserByName);
Router.get('/get/paginate',getPaginateUser);
Router.get('/get/:id',getUserById);

Router.get('/get/dec/:id',getUserByIdDecrypt);
Router.post('/get/name-user',getUserByName) // http://localhost:3555/api/v1/user/get/name-user;




Router.post('/post-user',postUser);
Router.post('/post-many-user',postManyUser);
Router.put('/update/:id',updateuserById); // untuk melengkapi data user
Router.delete('/delete/:id',deleteUserById);

module.exports = Router;


// note :
// get all user : http://localhost:3555/api/v1/user/get
// get user by id : http://localhost:3555/api/v1/user/get/:id
// get user by id decrypt : http://localhost:3555/api/v1/user/get/dec/:id
// post user : http://localhost:3555/api/v1/user/post-user
// post many user : http://localhost:3555/api/v1/user/post-many-user
// update user by id : http://localhost:3555/api/v1/user/update/:id
// delete user by id : http://localhost:3555/api/v1/user/delete/:id

// get user by name : http://localhost:3555/api/v1/user/get/name-user
