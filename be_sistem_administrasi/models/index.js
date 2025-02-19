const express = require('express');

//import models
const warga = require('./userModels/warga/wargaModel');
const user = require('./userModels/warga/userModel'); // user diimport di sini
const suratAcara = require('./suratIzinModel/suratAcaraModels');
const PerangkatDesaModel = require('./userModels/perangkatDesa/PerangkatDesaModel')                                                                                  
const rt = require('./userModels/rt/rtModels')
const rw = require('./userModels/rw/rwModels')
const pimpinanDesa = require('./userModels/pimpinanDesa/pimpinanDesaModels')
const admin = require('./adminModels/adminModels')
const konter = require('./konterModel/KonterModel')
const pelayanan = require('./konterModel/PelayananModels')

//db object
const db = {
    pimpinanDesa,
    rw,
    rt,
    warga,
    user, // user di letakkan di sini
    konter,

    suratAcara,
    PerangkatDesaModel,
    admin
}

module.exports = db;
