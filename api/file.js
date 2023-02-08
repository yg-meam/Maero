const express = require('express');
var router = express.Router()
var fs = require("fs")
var path = require("path");
var multer = require('multer')
const sharp = require("sharp");
var sizeOf = require('image-size');

var uploadPath = path.join(__dirname, '../tmp/')
if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath)
}
var upload = multer({
    dest: uploadPath,
    limits: {
        fieldSize: 30 * 7 * 1024 * 1024
    }
})


router.post("/upload", upload.single("file"), asyncHandling(async (req, res) => {
    if (!req.file) {
        // if (!req.file) {
        return res.json({
            res: false,
            msg: "파일을 선택해주세요"
        })
    }
    var size = await new Promise((resolve) => {
        sizeOf(req.file.path, function (err, size) {
            resolve(size)
        })
    })
    console.log(size)
    req.file.width = size.width
    req.file.height = size.height

    var fileData = await File.create(req.file)
    var param = {
        Bucket: config.aws.s3.bucket,
        Key: 'crowd/' + fileData.id,
        Body: fs.createReadStream(req.file.path),
    }

    await s3.putObject(param).promise();
    fs.unlinkSync(req.file.path)

    res.json({
        res: true,
        file: fileData
    })
}))
router.post("/upload/multiple", upload.array("file"), asyncHandling(async (req, res) => {
    var images = []
    await asyncForEach(req.files, async file => {
        let image = await File.create(file)
        var param = {
            Bucket: config.aws.s3.bucket,
            Key: 'crowd/' + image.id,
            Body: fs.createReadStream(file.path)
        }
        await s3.putObject(param).promise();
        fs.unlinkSync(file.path)
        images.push(image)
    })
    res.json({
        res: true,
        images
    })
}))
router.get("/:id", asyncHandling(async (req, res) => {
    var id = req.params.id


    var param = {
        Bucket: config.aws.s3.bucket,
        Key: 'crowd/' + id
    }
    var file = await File.findOne({
        where: {
            id: id
        }
    })

    res.setHeader('Content-type', file.mimetype);
    res.setHeader('Access-Control-Allow-Origin', '*');

    res.setHeader('Content-Disposition', 'attachment; filename=' + encodeURI(file.originalname));
    // res.setHeader('Content-disposition', `attachment; filename=${file.originalname}`);
    var exists = false
    try {
        await s3.headObject(param).promise();
        exists = true

        if (!exists) {
            return res.json({ res: false })
            // return Service.responseNoImage(res)
        }
        var stream = await s3.getObject(param).createReadStream();

        stream.pipe(res)
    } catch (err) {
        console.error(err)
        try {

            fs.createReadStream(path.join(__dirname, '../static/img/empty.png')).pipe(res)
        } catch (err) { }

    }


}))
router.get("/resize/:size/:id", asyncHandling(async (req, res) => {
    var id = req.params.id
    var size = Number(req.params.size || 500)
    var param = {
        Bucket: config.aws.s3.bucket,
        Key: 'crowd/' + id
    }
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 'max-age=36000000');
    try {
        var stream = await s3.getObject(param).promise();

        // stream.pipe(res)
        stream = await sharp(stream.Body)
            .rotate()
            .resize(size, size, {
                kernel: sharp.kernel.nearest,
                fit: 'inside',
                position: 'left top',
                background: { r: 255, g: 255, b: 255, alpha: 0 }
            })
            .webp({ lossless: true })
            .toBuffer()
        res.end(stream)
    } catch (err) {
        console.log(err)
        return res.json({
            res: false
        })
    }
}))
router.get("/thumb/:id", asyncHandling(async (req, res) => {
    var id = req.params.id
    var param = {
        Bucket: config.aws.s3.bucket,
        Key: 'crowd/' + id
    }
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 'max-age=36000000');
    try {
        var stream = await s3.getObject(param).promise();

        // stream.pipe(res)
        stream = await sharp(stream.Body)
            .rotate()
            .resize(1000, 1000, {
                kernel: sharp.kernel.nearest,
                fit: 'cover',
                // position: 'right top',
                // background: { r: 255, g: 255, b: 255, alpha: 0.5 }
            })
            .webp({ lossless: true })
            .toBuffer()
        res.end(stream)
    } catch (err) {
        console.log(err)
        return res.json({
            res: false
        })
    }
}))
router.get("/thumb/:size/:id", asyncHandling(async (req, res) => {
    var id = req.params.id
    var param = {
        Bucket: config.aws.s3.bucket,
        Key: 'crowd/' + id
    }
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 'max-age=36000000');
    try {
        var stream = await s3.getObject(param).promise();

        // stream.pipe(res)
        stream = await sharp(stream.Body)
            .rotate()
            .resize(Number(req.params.size), Number(req.params.size), {
                kernel: sharp.kernel.nearest,
                fit: 'cover',
                // position: 'right top',
                // background: { r: 255, g: 255, b: 255, alpha: 0.5 }
            })
            .webp({ lossless: true })
            .toBuffer()
        res.end(stream)
    } catch (err) {
        console.log(err)
        return res.json({
            res: false
        })
    }
}))


router.get("/watermark/:id", asyncHandling(async (req, res) => {
    var id = req.params.id
    var param = {
        Bucket: config.aws.s3.bucket,
        Key: 'crowd/' + id
    }
    res.setHeader('Access-Control-Allow-Origin', '*');
    try {
        var stream = await s3.getObject(param).promise();

        // stream.pipe(res)
        stream = await sharp(stream.Body)
            .rotate()
            .resize(1000, 1000, {
                kernel: sharp.kernel.nearest,
                fit: 'cover',
                // position: 'right top',
                // background: { r: 255, g: 255, b: 255, alpha: 0.5 }
            })
            .composite([{
                input: path.join(__dirname, '../static/img/watermark.png'),
                gravity: 'center',
                raw: {
                    width: 50,
                    height: 50,
                    channels: 4
                }
            }])
            .webp({ lossless: true })
            .toBuffer()
        res.end(stream)
    } catch (err) {
        console.log(err)
        return res.json({
            res: false
        })
    }
}))





module.exports = router