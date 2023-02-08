module.exports = async function (req, res, next) {
    if (!req.session.user) {
        return res.json({
            res: false,
        })
    }
    if (req.session.user.auth < 10) {
        return res.json({
            res: false,
        })
    }
    console.log(req.body)
    var storeManager = await StoreManager.findOne({
        where: {
            StoreId: req.body.storeId,
            UserId: req.session.user.id
        }
    })
    if (!storeManager) {
        return res.json({
            res: false
        })
    }
    next()

}