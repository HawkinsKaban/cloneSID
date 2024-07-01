const db = require('../../models');
const response = require('../../res/response');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const crypto = require('crypto');


exports.getadminByid = async (req, res) => {
    try{
        const {id} = req.params;
        const admin = await db.admin.findById(id);
        if(!admin) return response(404, res, 'error', 'admin not found');
        response(200, res, admin, 'Success get admin');

    }catch(err){
        response(500, res, 'error', err.message || 'Some error occurred while get admin.');
    }
};

const encrypt = (text, key, iv) => {
    let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return iv.toString('hex') + ':' + encrypted.toString('hex');
};

exports.postadmin = async (req, res) => {
    try{
        const {name, nik, nohp, userName, password} = req.body;
        const countadmin = await db.admin.countDocuments();
        if(countadmin >= 2){
            return response(400, res, 'error', 'admin already full');
        }
            // initiate crypto aes encryption
            const iv = crypto.randomBytes(16);
            const aesKey = crypto.randomBytes(32); // Ensure the AES key is 32 bytes (256 bits)
            const encryptedPassword = encrypt(password, aesKey, iv);
            
        const newadmin = new db.admin({
            name : name.toUpperCase(),
            nik,
            nohp,
            password : encryptedPassword,
        });
        await newadmin.save();
        return response(200, res, newadmin, 'Success post admin');
    }catch(err){
        response(500, res, 'error', err.message || 'Some error occurred while post admin.');
    }
}



exports.LoginAdmin = async (req,res) => {
    const {name,password} = req.body;
    try{
        const dataNama = name.toUpperCase();
        const dataAdmin = await db.admin.findOne({name: dataNama});
        if (!dataAdmin) {
            throw new Error('user not found with name :  ' + name);
        }
        const comparePassword = bcrypt.compare(password, dataAdmin.password);
        if (!comparePassword) {
            return res.status(400).send({
                message: "Invalid Password!"
            });
        }
        const token = jwt.sign({id: dataAdmin._id}, process.env.LOGIN_TOKEN, {expiresIn: '1d'});
        dataAdmin.token = token;
        await dataAdmin.save();
        res.status(200).send({
            status: 'success',
            message: "Success login warga",
            data: dataAdmin
        });
    }catch(error){
        console.log('Error:', error);
        res.status(500).send({
            message: error.message || "Some error occurred while login warga."
        });
    }
};


exports.logOutAdmin = async (req, res) => {
    try{
        const {id} = req.params;
        const dataAdmin = await db.admin.findById(id);
        if (!dataAdmin) {
            return res.status(404).send({
                message: "admin not found"
            });
        }
        dataAdmin.token = '';
        await dataAdmin.save();

        res.status(200).send({
            status: 'success',
            message: "Success logout"
        });

    }catch(error){
        console.log('Error:', error);
        res.status(500).send({
            message: error.message || "Some error occurred while logout."
        });
    }
}
