const db = require("../../models/index");
const userModel = db.user;
const crypto = require('crypto');//import crypto
require('dotenv').config();
const encrypt = require('../../utils/encryptDecrypt');
const { uploadProjectImages } = require('../../middleware/ImageUpload');


exports.getUserByName = async (req, res) => {
    try {
        const { name } = req.body;
        
        if (!name) {
            return res.status(400).send({
                message: "Name parameter is required"
            });
        }
        
        const upperName = name.toUpperCase();

        const dataUser = await userModel.findOne({ name: upperName });
        if (dataUser) {
            res.status(200).send({
                message: "Success get user by name",
                data: dataUser
            });
        } else {
            res.status(404).send({
                message: "User not found"
            });
        }
    } catch (error) {
        res.status(500).send({
            message: error.message || "Some error occurred while getting user by name."
        });
    }
};


exports.getPaginateUser = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        const dataUser = await userModel.find()
            .limit(limit)
            .skip((page - 1) * limit);


        const dataTotal = await userModel.countDocuments();

        res.status(200).send({
            message: "Success get all user",
            data: dataUser,
            page: page,
            limit: limit,
            totalDocument: dataTotal
        });

    } catch (error) {
        console.log('Error while handling GET request to /api/v1/user/get:', error);
        res.status(500).send({
            message: error.message || "Some error occurred while get all user."
        });
    }
}

exports.getAllUser = async (req, res) => {
    try {

        const dataUser = await userModel.find();

        const dataTotal = await userModel.countDocuments();

        res.status(200).send({
            message: "Success get all user",
            data: dataUser,
            totalDocument: dataTotal
        });

    } catch (error) {
        console.log('Error while handling GET request to /api/v1/user/get:', error);
        res.status(500).send({
            message: error.message || "Some error occurred while get all user."
        });
    }
}


exports.getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const dataUser = await userModel.findById(id);
        res.status(200).send({
            message: "Success get user by id",
            data: dataUser
        });

    } catch (error) {
        res.status(500).send({
            message: error.message || "Some error occurred while get user by id."
        });
    }
}

exports.getUserByIdDecrypt = async (req, res) => {
    try {
        const { id } = req.params;
        const aesKey = crypto.scryptSync(process.env.encrypt_key_one, process.env.encrypt_key_two, 32);
        const user = await userModel.findById(id);
        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }

        try {
            const decryptedNik = encrypt.dekripsi(user.nik, aesKey, user.iv);
            const decryptedAlamat = encrypt.dekripsi(user.alamat, aesKey, user.iv);
            const decryptedNohp = encrypt.dekripsi(user.nohp, aesKey, user.iv);
            res.status(200).send({
                message: "Success get user",
                data: {
                    name: user.name,
                    nik: decryptedNik,
                    alamat: decryptedAlamat,
                    nohp: decryptedNohp,
                    statusPerkawinan: user.statusPerkawinan,
                    domisili: user.domisili
                }
            });
        } catch (decryptionError) {
            res.status(500).send({ message: decryptionError.message });
        }
    } catch (error) {
        res.status(500).send({ message: error.message || "Some error occurred while getting user." });
    }
};



exports.postUser = async (req, res) => {
    try {
        const { name, nik, alamat, nohp, statusPerkawinan, domisili } = req.body;

        const aesKey = crypto.scryptSync(
            process.env.encrypt_key_one,
            process.env.encrypt_key_two,
            32
        );
        const iv = crypto.randomBytes(16);
        console.log("------------------------------------------------------------------")
        console.log('IV:', iv.toString('hex'));
        console.log('AES Key:', aesKey.toString('hex'));
        console.log('IV Length:', iv.toString('hex').length);
        console.log("------------------------------------------------------------------")

        const encryptedNik = encrypt.enkripsi(nik, aesKey, iv).encryptedData;
        const encryptedAlamat = encrypt.enkripsi(alamat, aesKey, iv).encryptedData;
        const encryptedNohp = encrypt.enkripsi(nohp, aesKey, iv).encryptedData;

        const newUser = await userModel.create({
            name: name.toUpperCase(),
            nik: encryptedNik,
            alamat: encryptedAlamat,
            nohp: encryptedNohp,
            statusPerkawinan: statusPerkawinan.toUpperCase(),
            domisili: domisili.map((dom) => dom.toUpperCase()),
            iv: iv.toString('hex')
        });

        res.status(200).send({
            message: "Success create user",
            data: newUser
        });
    } catch (error) {
        res.status(500).send({
            message: error.message || "Some error occurred while creating user."
        });
    }
};



exports.postManyUser = async (req, res) => {
    try {
        const { data } = req.body;
        const newUser = await userModel.insertMany(data);
        res.status(200).send({
            message: "Success create user",
            data: newUser
        });

    } catch (error) {
        res.status(500).send({
            message: error.message || "Some error occurred while creating warga."
        });
    }
}


// untuk melengkapi data user
exports.updateuserById = async (req, res) => {
    uploadProjectImages(req, res, async (error) => {
        if (error) {
            console.error(error);
            console.error(error.message);
            res.status(500).send({
                message: error.message || "Some error occurred while updating user by id."
            });
            return;
        }
        try {
            const id = req.params.id;
            const updateData = req.body;
            
            // Uppercase conversion
            if (updateData.name) updateData.name = updateData.name.toUpperCase();
            if (updateData.alamat) updateData.alamat = updateData.alamat.toUpperCase();
            if (updateData.statusPerkawinan) updateData.statusPerkawinan = updateData.statusPerkawinan.toUpperCase();
            if (updateData.tempatlahir) updateData.tempatlahir = updateData.tempatlahir.toUpperCase();
            if (updateData.tanggallahir) updateData.tanggallahir = updateData.tanggallahir.toUpperCase();
            if (updateData.agama) updateData.agama = updateData.agama.toUpperCase();
            if (updateData.jenisKelamin) updateData.jenisKelamin = updateData.jenisKelamin.toUpperCase();
            if (updateData.pekerjaan) updateData.pekerjaan = updateData.pekerjaan.toUpperCase();
            if (updateData.nik) updateData.nik = updateData.nik.toUpperCase();
            if (updateData.nohp) updateData.nohp = updateData.nohp.toUpperCase();
            if (updateData.domisili) updateData.domisili = updateData.domisili.map((domisili) => domisili.toUpperCase());

            // Enkripsi data
            const aesKey = crypto.scryptSync(process.env.encrypt_key_one, process.env.encrypt_key_two, 32);
            const iv = crypto.randomBytes(16);
            const encryptedNik = updateData.nik ? encrypt.enkripsi(updateData.nik, aesKey, iv).encryptedData : undefined;
            const encryptedAlamat = updateData.alamat ? encrypt.enkripsi(updateData.alamat, aesKey, iv).encryptedData : undefined;
            const encryptedNohp = updateData.nohp ? encrypt.enkripsi(updateData.nohp, aesKey, iv).encryptedData : undefined;

            const dataUpdatedValid = {
                name: updateData.name,
                nik: encryptedNik,
                alamat: encryptedAlamat,
                nohp: encryptedNohp,
                statusPerkawinan: updateData.statusPerkawinan,
                jenisKelamin: updateData.jenisKelamin,
                tempatlahir: updateData.tempatlahir,
                tanggallahir: updateData.tanggallahir,
                agama: updateData.agama,
                pekerjaan: updateData.pekerjaan,
                domisili: updateData.domisili,
                iv: iv.toString('hex'),
                img: updateData.img
            };

            if (req.files && req.files.length > 0) {
                const newImages = req.files.map((file) => file.filename);
                dataUpdatedValid.img = newImages;
            } else {
                dataUpdatedValid.img = dataUpdatedValid.img;
            }

            const user = await userModel.findByIdAndUpdate(id, dataUpdatedValid, { new: true });
            if (!user) {
                return res.status(404).send({
                    message: "User not found with id " + id
                });
            }

            res.status(200).send({
                message: "Success update user by id",
                data: user
            });
        } catch (error) {
            res.status(500).send({
                message: error.message || "Some error occurred while updating user by id."
            });
        }
    });
};


// use by admin
exports.deleteUserById = async (req, res) => {
    const id = req.params.id;
    try {
        const user = await userModel.findByIdAndDelete(id);
        if (!user) {
            return res.status(404).send({
                message: "user not found with id " + id
            });
        }

        res.status(200).send({
            message: "Success delete user by id",
            data: user

        });
    } catch (error) {
        res.status(500).send({
            message: error.message || "Some error occurred while delete user by id."
        });
    }
}


module.exports = exports;
