const {getKegiatanWithSearch,getKegiatan,postKegiatan,getKegiatanById,putKegiatan,deleteKegiatan}=
require('../../controllers/informasiController/kegiatanController');
const express = require('express');
const Router = express.Router();

Router.get('/get-kegiatan/:name/:date',getKegiatanWithSearch);
Router.get('/get-kegiatan',getKegiatan);
Router.post('/post-kegiatan',postKegiatan);
Router.get('/get-kegiatan/:id',getKegiatanById);
Router.put('/update-kegiatan/:id',putKegiatan);
Router.delete('/delete-kegiatan/:id',deleteKegiatan);

module.exports = Router;