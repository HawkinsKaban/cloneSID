const db = require('../../models');
const kegiatanModel = require('../../models/informasiModels/kegiatanModel');
const { uploadProjectImages } = require('../../middleware/imageUpload');
const response = require('../../res/response');


exports.getKegiatanWithSearch = async (req, res) => {
    try {
        const { name, date } = req.params;
        let result;

        let searchQuery = {};

        if (name && name !== '-1') {
            searchQuery.title = { $regex: name, $options: 'i' };
        }

        if (date && date !== '-1') {
            const searchDate = new Date(date);
            const nextDay = new Date(searchDate);
            nextDay.setDate(searchDate.getDate() + 1);
            searchQuery.date = { $gte: searchDate, $lt: nextDay };
        }

        result = await kegiatanModel.find(searchQuery);

        response(200, res, result, 'Success get kegiatan');
    } catch (err) {
        console.error(err);
        response(500, res, 'error', err.message || 'Some error occurred while get informasi.');
    }
}


exports.getKegiatan = async (req, res) => {
    const { page = 1, limit = 10 } = req.query; // Default page is 1 and limit is 10
    try {
        const content = await kegiatanModel.find()
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        const totalItems = await kegiatanModel.countDocuments();
        const totalPages = Math.ceil(totalItems / limit);

        response(200, res, {
            data: content,
            currentPage: parseInt(page),
            totalPages: totalPages,
            totalItems: totalItems,
            itemsPerPage: parseInt(limit)
        }, 'Success get kegiatan');
    } catch (err) {
        response(500, res, 'error', err.message || 'Some error occurred while getting kegiatan.');
    }
};


exports.getKegiatanById = async (req, res) => {
    try {
        const id = req.params.id;
        const content = await kegiatanModel.findById(id);
        response(200, res, content, 'Success get kegiatan');
    } catch (err) {
        response(500, res, 'error', err.message || 'Some error occurred while get informasi.');
    }
}

exports.postKegiatan = async (req, res) => {
    uploadProjectImages(req, res, async (error) => {
        if (error) {
            console.error(error);
            console.error(error.message);
            response(500, res, 'error', error.message || 'Internal Server Error');
            return;
        }

        try {
            const { title, content, date, location } = req.body;
            const imgs = req.files.map((file) => file.filename);
            const newKegiatan = new kegiatanModel({
                title,
                content,
                date,
                location,
                img: imgs,
            });

            const savedKegiatan = await newKegiatan.save();

            response(200, res, savedKegiatan, 'Success post kegiatan');

        } catch (error) {
            console.error(error.message);
            response(500, res, 'error', err.message || 'Some error occurred while post informasi.');
        }
    });
}

exports.putKegiatan = async (req, res) => {
    uploadProjectImages(req, res, async (error) => {
        if (error) {
            console.error(error.message);
            response(500, res, 'error', error.message || 'Internal Server Error');
            return;
        }

        try {
            const { id } = req.params;
            const { title, content, date, location, img } = req.body;

            let updateFields = { title, content, date, location, img };

            if (req.files && req.files.length > 0) {
                const newImages = req.files.map((file) => file.filename);
                if (img && Array.isArray(img)) {
                    updateFields.img = img.concat(newImages);
                } else {
                    updateFields.img = newImages;
                }
            } else {
                updateFields.img = img;
            }

            const updatedKegiatan = await kegiatanModel.findByIdAndUpdate(id, updateFields, { new: true });

            if (!updatedKegiatan) {
                return res.status(404).send({ message: "Kegiatan not found" });
            }

            response(200, res, updatedKegiatan, 'Success put kegiatan');

        } catch (error) {
            response(500, res, 'error', error.message || 'Some error occurred while put kegiatan.');
        }
    });
};



exports.deleteKegiatan = async (req, res) => {
    try {
        const id = req.params.id;
        const result = await kegiatanModel.findByIdAndDelete(id);
        response(200, res, savedKegiatan, 'Success delete kegiatan');
    } catch (error) {
        response(500, res, 'error', error.message || 'Some error occurred while delete informasi.');
    }
}

