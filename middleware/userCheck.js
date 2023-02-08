
module.exports = function (req, res, next) {

    if (req && req.session && req.session.user) {
        next()
    }
    else {
        res.json({
            res: false,
            code: 401,
            msg: "로그인이 필요한기능입니다 로그인페이지로 이동합니다"
        })
        // if (!nochange) {

        // }
        // else {
        //     res.json({
        //         res: false,
        //         msg: "로그인이 필요한기능입니다 로그인페이지로 이동합니다"
        //     })
        // }

    }
}
// }
