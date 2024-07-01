const {getAspirasiAll,postAspirasi,getAspirasiByWarga,getAspirasiById,deleteAspirasi,getAspirasiKades,getAspirasiAdmin,getAspirasiApproved,putAspirasi}=require('../../controllers/aspirasiController/aspirasiController');
const express = require('express');
const Router = express.Router();

Router.post('/postAspirasi/:wargaId', postAspirasi);
Router.get('/getAspirasi', getAspirasiAll);
Router.get('/getAspirasi/my/:id', getAspirasiByWarga);
Router.delete('/deleteAspirasi/:aspirasiId', deleteAspirasi);
Router.put('/updateAspirasi/:aspirasiId', putAspirasi);


Router.get('/getAspirasiKades', getAspirasiKades);
Router.get('/getAspirasiAdmin', getAspirasiAdmin);
Router.get('/getAspirasiApproved', getAspirasiApproved);





// test
Router.get('/getAspirasi/:id', getAspirasiById); //http://localhost:3557/api/v1/aspirasi/getAspirasi


module.exports = Router


//note endpoint aspirasi
//putAspirasi : http://localhost:3557/api/v1/aspirasi/updateAspirasi/:wargaId
//postAspirasi : http://localhost:3557/api/v1/aspirasi/postAspirasi/:wargaId
//getAspirasi : http://localhost:3557/api/v1/aspirasi/getAspirasi
//getAspirasiById : http://localhost:3557/api/v1/aspirasi/getAspirasi/:id
//deleteAspirasi : http://localhost:3557/api/v1/aspirasi/deleteAspirasi/:aspirasiId
//getAspirasiKades : http://localhost:3557/api/v1/aspirasi/getAspirasiKades
//getAspirasiAdmin : http://localhost:3557/api/v1/aspirasi/getAspirasiAdmin
//getAspirasiApproved : http://localhost:3557/api/v1/aspirasi/getAspirasiApproved
