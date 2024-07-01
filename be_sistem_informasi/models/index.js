const express = require('express');

//import models
const agenda = require('./informasiModels/agendaModel')
const informasi = require('./informasiModels/informasiModel')
const kegiatan = require('./informasiModels/kegiatanModel')
const visiMisi = require('./informasiModels/visiMisiModel')
const admin = require('./admin/admin')

//db object
const db = {
    agenda,
    informasi,
    kegiatan,
    visiMisi,
    admin
}


module.exports = db;
