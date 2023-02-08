const express = require('express');
var router = express.Router()
var fs = require("fs")
var path = require("path");
var multer = require('multer')
var sharp = require("sharp");
const { Storage } = require('@google-cloud/storage');

const storage = new Storage({ keyFilename: path.join(__dirname, "file_gcp.json") });
const bucket = storage.bucket(config.aws.s3.bucket);


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

router.post("/upload/multiple", upload.array("file"), asyncHandling(async (req, res) => {
    var images = []
    await asyncForEach(req.files, async file => {
        let image = await File.create(file)
        await bucket.upload(file.path, {
            destination: config.aws.s3.path + '/' + image.id,
        })

        // var param = {
        //     Bucket: config.aws.s3.bucket,
        //     Key: config.aws.s3.path + '/' + image.id,
        //     Body: fs.createReadStream(file.path)
        // }
        // await s3.putObject(param).promise();
        fs.unlinkSync(file.path)
        images.push(image)
    })
    res.json({
        res: true,
        images
    })
}))
router.post("/upload", upload.single("file"), asyncHandling(async (req, res) => {
    if (!req.file) {
        // if (!req.file) {
        return res.json({
            res: false,
            msg: "파일을 선택해주세요"
        })
    }
    var fileData = await File.create(req.file)
    await bucket.upload(req.file.path, {
        destination: config.aws.s3.path + '/' + fileData.id,
    })
    // var param = {
    //     Bucket: config.aws.s3.bucket,
    //     Key: config.aws.s3.path + '/' + fileData.id,
    //     Body: fs.createReadStream(req.file.path),
    // }
    // await s3.putObject(param).promise();
    fs.unlinkSync(req.file.path)

    res.json({
        res: true,
        file: fileData
    })
}))
router.get("/:id", asyncHandling(async (req, res) => {
    var id = req.params.id
    console.log(id)


    var file = await File.findOne({
        where: {
            id: id
        }
    })
    console.log(file)
    if (!file) {
        return res.json({
            res: false
        })
    }

    res.setHeader('Content-type', file.mimetype);
    res.setHeader('Access-Control-Allow-Origin', '*');

    res.setHeader('Content-Disposition', 'attachment; filename=' + encodeURI(file.originalname));
    // res.setHeader('Content-disposition', `attachment; filename=${file.originalname}`);
    var exists = false
    // try {

    //     // await s3.headObject(param).promise();
    //     exists = true
    // } catch (err) {
    //     console.error(err)
    // }

    // if (!exists) {
    //     return res.json({ res: false })
    //     // return Service.responseNoImage(res)
    // }
    // var stream = await s3.getObject(param).createReadStream();
    await bucket
        .file(config.aws.s3.path + '/' + id)
        .createReadStream()
        .pipe(res)
    // .download()

    // res.end(result)
    // console.log(result)
    // .createReadStream() //stream is created


    // stream.pipe(res)
}))

router.get("/resize/:size/:id", asyncHandling(async (req, res) => {

    var id = req.params.id
    console.log(id)
    var size = Number(req.params.size || 500)

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 'max-age=36000000');
    try {
        var stream = await bucket
            .file(config.aws.s3.path + '/' + id)
            .download()
        console.log(stream)

        // stream.pipe(res)
        stream = await sharp(stream[0])
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

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 'max-age=36000000');
    try {
        var stream = await bucket
            .file(config.aws.s3.path + '/' + id)
            .download()
        // stream.pipe(res)
        stream = await sharp(stream[0])
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
router.get("/kakao/thumb/:id", asyncHandling(async (req, res) => {
    var id = req.params.id

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 'max-age=36000000');
    try {
        var stream = await bucket
            .file(config.aws.s3.path + '/' + id)
            .download()
        // stream.pipe(res)
        stream = await sharp(stream[0])
            .resize(400, 200, {
                kernel: sharp.kernel.nearest,
                fit: 'contain',
                // position: 'right top',
                background: { r: 255, g: 255, b: 255, alpha: 1 }
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
        Key: config.aws.s3.path + '/' + id
    }
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 'max-age=36000000');
    try {
        var stream = await bucket
            .file(config.aws.s3.path + '/' + id)
            .download()

        // stream.pipe(res)
        stream = await sharp(stream[0])
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




module.exports = router