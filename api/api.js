const express = require('express');
const now = new Date();


var router = express.Router()
let commonService = require("./commonService")

var fs = require("fs");
var path = require("path");

sequelize.sync({ alter: true })

router.post("/status", asyncHandling(async (req, res) => {
    res.json({ status: "ok" })
}))

router.post("/login", asyncHandling(async (req, res) => {
    console.log(req.session.user)
    //로그인시 비밀번호가 틀렸을 경우
    var tmpUser = await User.findOne({
        where: {
            email: req.body.email,
            password: password.getHashPassword(req.body.password)
        }
    })
    if (tmpUser == "") {
        console.log("비밀번호 틀림")
        res.send({ status: "fail" })
    } else {
        console.log("로그인 성공")
        req.session.user = tmpUser
        res.send({ status: "ok", user: tmpUser })
        // res.setHeader('Set-Cookie', 'a-cookie = apple; HttpOnly', 's-cookie = ')
    }
    console.log(tmpUser)
}))

router.post("/join", asyncHandling(async (req, res) => {
    console.log(req.body)
    //TODO 회원 디비에 넣기
    var tmpUser = await User.findOne({
        where: {
            email: req.body.email
        }
    })
    if (tmpUser == null) {
        await User.create(req.body)
        console.log("이메일 사용가능");
        res.send({ status: "ok" })
    } else {
        console.log("이메일 중복");
        res.send({ status: "fail" })
    }
    console.log(tmpUser)
}))

router.post("/userinfo", asyncHandling(async (req, res) => {
    //로그인 됬을때
    if (req.session.user) {
        res.json({
            status: "ok",
            user: req.session.user
        })
        await User.update({
            connecttime: new Date()
        }, {
            where: {
                email: req.session.user.email
            }
        })
    }


    //로그인 안됬을때
    else {
        res.json({
            status: "fail"
        })
    }
}))

router.post("/logout", asyncHandling(async (req, res) => {
    req.session.destroy()
    res.json({
        res: true
    })
}))

module.exports = router;

