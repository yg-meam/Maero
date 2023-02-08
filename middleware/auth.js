module.exports = function (auth) {
    return function (req, res, next) {

        if (req.session && req.session.user && req.session.user.auth >= auth) {
            next()
        }
        else {
            res.json({
                res: false,
                code: 404,
                msg: "사용할수 없는 권한입니다"
            })
        }
    }
}
