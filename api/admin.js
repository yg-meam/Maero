const express = require('express');


var router = express.Router()
let commonService = require("./commonService")


//CSV 읽기위한 모듈
const AutoDetectDecoderStream = require('autodetect-decoder-stream');
const CsvReadableStream = require('csv-reader');

var fs = require("fs");
var path = require("path");
var multer = require('multer')

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


/**
 * 메인화면 데이터 조회 api
 */
router.post("/main", asyncHandling(async (req, res) => {

    var todayStart = moment().startOf("day").toDate()
    var todayEnd = moment().endOf("day").toDate()

    var type1status100 = await Order.count({
        where: {
            orderType: 1,
            status: 100

        }
    })
    var type2status100 = await Order.count({
        where: {
            orderType: 2,
            status: 100

        }
    })
    var type3status100 = await Order.count({
        where: {
            orderType: 3,
            status: 100

        }
    })

    var type1Expire = await Order.count({
        where: {
            orderType: 1,
            status: {
                [Op.lte]: 600
            },
            deliveryExpireDate: {
                [Op.lte]: moment().add(3, "day").toDate()
            }

        }
    })
    var type2Expire = await Order.count({
        where: {
            orderType: 2,
            status: {
                [Op.lte]: 600
            },
            deliveryExpireDate: {
                [Op.lte]: moment().add(3, "day").toDate()
            }

        }
    })
    var type3Expire = await Order.count({
        where: {
            orderType: 3,
            status: {
                [Op.lte]: 600
            },
            deliveryExpireDate: {
                [Op.lte]: moment().add(3, "day").toDate()
            }

        }
    })
    res.json({
        res: true,
        data: {
            type1status100,
            type2status100,
            type3status100,
            type1Expire,
            type2Expire,
            type3Expire

        }
    })
}))

/**
 * 주문 목록 조회 api
 */
router.post("/order/list", asyncHandling(async (req, res) => {
    var filter = req.body

    var todayStart = moment(filter.startDate).startOf("day").toDate()
    var todayEnd = moment(filter.endDate).endOf("day").toDate()
    var searchType = filter.searchType
    var keyword = filter.keyword

    var where = {
        createDate: {
            [Op.between]: [todayStart, todayEnd],
        }
    }

    //검색필드와 검색어가 있어야만 필터링되서 나오게 처리
    if (searchType && keyword) {

        //여러줄 일경우 or 로 필터링되도록 수정
        var keywordLine = keyword.split("\n")
        var keywordOr = _.chain(keywordLine)
            .map(keyword => {
                var obj = {}
                obj[searchType] = keyword
                return obj
            }).value()

        where[Op.or] = keywordOr

        //검색하려는 필드가 상품명일경우 like 검색
        if (searchType == "productName") {
            where[searchType] = {
                [Op.like]: "%" + keyword + "%"
            }
        }
    }

    // var data = await ChangeLog.findAll({
    //     attributes: ['UserId', 'changeField', 'changeValue', 'prevValue', 'createDate', 'orderKey'],
    //     order: [["createDate", "DESC"]]
    // })

    var list = await Order.findAll({
        //Order: [['createdAt', 'DESC']],
        where: where,
        include: [
            {
                model: Package,
                as: "package"
            },
            {
                model: Hscode,
                as: 'hscodes'
            },
            {
                model: Shop,
                as: 'shop'
            },

        ],
        order: [["createDate", "DESC"]]
    })

    res.json({
        res: true,
        orderList: list,
        // historyDataList: data
    })
}))

/**
 * 선택된 삭제 
 */
router.post("/order/remove", asyncHandling(async (req, res) => {
    var checkList = req.body

    await asyncForEach(checkList, async (checkItem) => {
        var checkId = checkItem.id


        await Order.destroy({
            where: {
                id: checkId
            }
        }, {
            where: {
                id: checkId
            }
        })
    })
    res.json({
        res: true
    })
}))

/**
 * 선택된 히스토리
 */
router.post("/order/history", asyncHandling(async (req, res) => {
    var checkList = req.body
    var checkedList = []

    await asyncForEach(checkList, async (checkItem) => {
        let id = checkItem.id
        delete checkItem.id

        var checkData = await ChangeLog.findAll({
            where: {
                OrderId: {
                    [Op.in]: [id]
                }
            },
            order: [["createDate", "DESC"]]
        })
        _.each(checkData, item => {
            checkedList.push(item)
        })
    })
    res.json({
        res: true,
        checkedList
    })
}))

router.post("/order/update", asyncHandling(async (req, res) => {
    console.log(req.body)
    var changeList = req.body
    var changedList = []

    await asyncForEach(changeList, async changeItem => {

        if (changeItem !== null) {
            var old = await Order.findOne({
                where: {
                    id: changeItem.id
                }
            })


            var changeField = _.keys(changeItem)[1]
            var prevValue = null
            if (changeField) {
                prevValue = old[changeField]
                tradeId = old.tradeId

                if (_.isDate(prevValue)) {
                    prevValue = moment(prevValue).format("YYYY-MM-DD")
                }
                else {
                    prevValue = String(prevValue)
                }
            }

            if (changeField == "hscode") {
                var newHs = await Hscode.findOne({
                    where: {
                        hscode: changeItem.hscode
                    }
                })
                var old = await Hscode.findOne({
                    where: {
                        hscode: prevValue
                    }
                })
                if (old) {
                    prevValue = old.kind
                }

                await ChangeLog.create({
                    UserId: req.session.user.email,
                    OrderId: changeItem.id,
                    changeField: _.keys(changeItem)[1],
                    changeValue: newHs.kind,
                    prevValue: prevValue,
                    orderKey: tradeId,
                })
            }
            // else if (changeField == "partnerShop") {
            //     var newShop = await Shop.findOne({
            //         where: {
            //             marketUrl: changeItem.partnerShop
            //         }
            //     })
            //     var old = await Shop.findOne({
            //         where: {
            //             marketUrl: prevValue
            //         }
            //     })
            //     if (old) {
            //         prevValue = old.market
            //     }

            //     await ChangeLog.create({
            //         UserId: req.session.user.email,
            //         OrderId: changeItem.id,
            //         changeField: _.keys(changeItem)[1],
            //         changeValue: newShop.market,
            //         prevValue: prevValue,
            //         orderKey: tradeId,
            //     })
            // }
            else {
                await ChangeLog.create({
                    UserId: req.session.user.email,
                    OrderId: changeItem.id,
                    changeField: _.keys(changeItem)[1],
                    changeValue: _.values(changeItem)[1],
                    prevValue: String(prevValue),
                    orderKey: tradeId,
                })
            }

        }
    })

    await asyncForEach(changeList, async (changeItem, key) => {
        let id = changeItem.id
        console.log(id)
        delete changeItem.id


        var key = _.chain(changeItem)
            .keys()
            .first()
            .value()

        //주문일 변경할경우 주문일의 +18일이 발송기한이되게 설정
        console.log(key, changeItem.orderDate)
        if (key == "orderDate" && changeItem.orderDate) {
            changeItem.deliveryExpireDate = moment(changeItem.orderDate).add(18, "days").toDate()

        }
        //주문일 삭제할 경우 발송기한도 삭제
        if (key == "orderDate" && !changeItem.orderDate) {
            changeItem.orderDate = null
            changeItem.deliveryExpireDate = null
        }

        if (key == "colorSize") {
            changeItem.isColorSizeChange = true
        }
        if (key == "orderNumber") {
            changeItem.isOrderNumberChange = true
        }
        if (key == "buyerName") {
            changeItem.isBuyerNameChange = true
        }
        if (key == "zipcode") {
            changeItem.isZipcodeChange = true
        }
        if (key == "address") {
            changeItem.isAddressChange = true
        }
        if (key == "buyerPhone") {
            changeItem.isBuyerPhoneChange = true
        }

        // "취소"상태의 경우 매입일, 판매가 없어지면서 매입일에 "취소"상태의 날짜 입력
        if (key == "status" && changeItem.status == 1000) {

            changeItem.partnerPrice = null, changeItem.orderPrice = null, changeItem.partnerOrderDate = new Date()
        } else {
            //취소하기 전의 '매입가', '판매가'보이기
            changeItem.partnerOrderDate = null
        }

        if (key == "hscode") {
            var listOrder = await Order.findOne({
                where: {
                    id: id
                }
            })

            var listProduct = await ProductHscode.findOne({
                where: {
                    OrderProductId: listOrder.productId,
                }
            })



            if (key == "hscode" && changeItem.hscode) { //hscode가 입ㅕ됬을때

                var hscode = await Hscode.findOne({
                    where: {
                        hscode: changeItem.hscode
                    }
                })
                if (listProduct == null) {  //이전 연결 데터없으면
                    await ProductHscode.create({
                        OrderProductId: listOrder.productId,
                        HscodeId: hscode.id
                    })
                } else {
                    await ProductHscode.update({
                        HscodeId: hscode.id
                    }, {
                        where: {
                            OrderProductId: listOrder.productId
                        }
                    })
                }
            }
        }

        // if (key == "partnerShop" && changeItem.partnerShop) {
        //     var ShopChangeId = await Shop.findOne({
        //         where: {
        //             marketUrl: changeItem.partnerShop
        //         }
        //     })
        //     console.log(ShopChangeId)
        //     var OrderChange = await Order.findOne({
        //         where: {
        //             id: id
        //         }
        //     })
        //     console.log(OrderChange)

        //     await Order.update({
        //         ShopId: ShopChangeId.id
        //     }, {
        //         where: {
        //             id: id
        //         }
        //     })
        // }

        if ((key == "number" && "PackageId" && "packageSum") && (changeItem.number && changeItem.PackageId && changeItem.packageSum)) {
            changeItem.status = 600
        }

        //'발송완료'상태시 '발송메모' 삭제
        if (key == "status" && changeItem.status == 700) {
            changeItem.deleveryMemo = null, changeItem.deleveryStartDate = new Date()
        } else {
            changeItem.deleveryStartDate = null
        }

        //매입처가 입력되면 매입일이 자동입력되게하기
        if (key == "partnerShop") {
            var oldOrder = await Order.findOne({
                where: {
                    id: id
                }

            })
            //'발주대기'상태에서 '매입처' 삭제시 '발주전'상태로 출력 아니면 '발주완료'
            if (oldOrder.status == 200) {
                if (key == "partnerShop" && !changeItem.partnerShop) {
                    changeItem.status = 100
                } else {
                    changeItem.status = 300
                }
            }
            //'발주전'상태에서 '매입처' 삭제시 '발주전'상태로 출력 아니면 '발주완료'
            if (oldOrder.status == 100) {
                if (key == "partnerShop" && !changeItem.partnerShop) {
                    changeItem.status = 100
                } else {
                    changeItem.status = 300
                }
            }

            if (!oldOrder.partnerShop && changeItem.partnerShop) {
                changeItem.partnerOrderDate = new Date()
            }

            if (oldOrder.partnerShop && (!changeItem.partnerShop)) {

                changeItem.partnerOrderDate = null
            }

        }

        await Order.update(changeItem, {
            where: {
                id: id
            }
        })

        var changeData = await Order.findOne({
            where: {
                id: id
            },
            include: [
                {
                    model: Package,
                    as: "package"
                },
                {
                    model: Hscode,
                    as: 'hscodes'
                },
                {
                    model: Shop,
                    as: 'shop'
                },
            ]
        })
        changedList.push(changeData)
    })
    res.json({
        res: true,
        changedList,
    })
}))

/**
 * 히스토리
 */
router.post("/history", asyncHandling(async (req, res) => {
    var filter = req.body

    var todayStart = moment(filter.startDate).startOf("day").toDate()
    var todayEnd = moment(filter.endDate).endOf("day").toDate()

    var where = {
        createDate: {
            [Op.between]: [todayStart, todayEnd]
        }
    }

    var list = await ChangeLog.findAll({
        where: where,
        attributes: ['UserId', 'orderKey', 'changeField', 'changeValue', 'prevValue', 'createDate'],
        order: [["createDate", "DESC"]]
    })

    res.json({
        res: true,
        historyList: list
    })
}))

/**
 * 사용자관리
 */
router.post("/user", asyncHandling(async (req, res) => {
    var list = req.body

    var userList = await User.findAll({
        attributes: ['email', 'name', 'authority', 'signdate', 'connecttime'],
    })

    await asyncForEach(list, async (item) => {
        var authority = item.authority
        var email = item.email

        await User.update({
            authority: authority
        }, {
            where: {
                email: email
            }
        })
    })


    res.json({
        res: true,
        userList
    })
}))

/**
 * 매입처관리
 */
router.post("/partnerShop", asyncHandling(async (req, res) => {
    var changeList = req.body

    var partnerShopList = await Shop.findAll({
        attributes: ['id', 'market', 'marketUrl']
    })

    await asyncForEach(changeList, async (item) => {
        var id = item.id
        var market = item.market
        var marketUrl = item.marketUrl

        await Shop.update({
            market: market,
            marketUrl: marketUrl
        }, {
            where: {
                id: id
            }
        })
    })

    res.json({
        res: true,
        partnerShopList
    })
}))

// router.post("/partnerShop/update", asyncHandling(async (req, res) => {
//     var changeMarket = req.body
//     console.log(changeMarket)

//     await asyncForEach(changeMarket, async (item) => {
//         console.log(item.columnName)

//         if (item.columnName == "market") {
//             var value = item.value

//             await Shop.update({
//                 market: value
//             }, {
//                 where: {
//                     market: value
//                 }
//             })
//         }
//     })

//     res.json({
//         res: true
//     })
// }))

router.post("/order/upload", upload.single("file"), asyncHandling(async (req, res) => {

    var type1Header = [
        '商品ID', '商品名',
        '価格', '受注数',
        '取引ID', 'ニックネーム',
        '名前（本名）', '郵便番号',
        '住所', '電話番号',
        '発送方法', '色・サイズ',
        '連絡事項', '名前（ローマ字）',
        '住所(ローマ字)', '受注メモ'
    ]
    //QOO10 헤더
    var type2Header = [
        '配送状態', '注文番号', 'カート番号',
        '配送会社', '送り状番号', '発送日',
        '注文日', '入金日', 'お届け希望日',
        '発送予定日', '配送完了日', '配送方法',
        '商品番号', '商品名', '数量',
        'オプション情報', 'オプションコード', 'おまけ',
        '受取人名', '受取人名(フリガナ)', '受取人電話番号',
        '受取人携帯電話番号', '住所', '郵便番号',
        '国家', '送料の決済', '決済サイト',
        '通貨', '購入者決済金額', '販売価格',
        '割引額', '注文金額の合計', '供給原価の合計',
        '購入者名', '購入者名(フリガナ)', '配送要請事項',
        '購入者電話番号', '購入者携帯電話番号', '販売者商品コード',
        'JANコード', '規格番号', 'プレゼント贈り主',
        '外部広告', '素材'
    ]
    var type3Header = [
        '注文確定日時',
        '注文番号',
        '送付先一致フラグ',
        '商品管理番号',
        '商品名',
        '個数',
        '項目・選択肢',
        '複数送付先フラグ',
        '送付先姓',
        '送付先名',
        '送付先郵便番号1',
        '送付先郵便番号2',
        '送付先住所都道府県',
        '送付先住所郡市区',
        '送付先住所それ以降の住所',
        '送付先電話番号1',
        '送付先電話番号2',
        '送付先電話番号3',
        '配送方法',
        '注文者姓',
        '注文者名',
        '単価',
        '購入履歴修正有無フラグ',
        '送付先ID',
        '支払方法名',
        '納期情報'
    ]
    var headerMatchingTable = {
        productId: ["商品ID", "商品番号", "商品管理番号"],
        productName: ["商品名"],
        orderPrice: ["価格", "購入者決済金額"],
        orderNumber: ["受注数", "数量", "個数"],
        tradeId: ["取引ID", "注文番号", "注文番号"],
        buyerId: ["ニックネーム"],
        buyerName: ["名前（本名）", "受取人名", "購入者名"],
        buyerPhone: ["連絡事項", "電話番号", "受取人携帯電話番号"],
        zipcode: ["郵便番号"],
        address: ["住所"],
        buyerEngName: ["名前（ローマ字）"],
        engAddress: ["住所(ローマ字)"],
        deliveryType: ["発送方法"],
        colorSize: ["色・サイズ", "オプション情報", "項目・選択肢"],
        orderDate: ["注文日", "注文確定日時"],
        memo: ["受注メモ"],
    }
    var list = [];
    let inputStream = fs.createReadStream(req.file.path).pipe(new AutoDetectDecoderStream({ defaultEncoding: '1255' }));;
    await new Promise(resolve => {
        var line = 0
        var header
        var orderType;

        inputStream
            .pipe(new CsvReadableStream({ parseNumbers: true, parseBooleans: true, trim: true }))
            .on('data', function (row) {
                line++
                if (line == 1) {

                    header = row


                    if (_.isEqual(header, type1Header)) {
                        orderType = 1
                    }
                    if (_.isEqual(header, type2Header)) {
                        orderType = 2
                    }
                    if (_.isEqual(header, type3Header)) {
                        orderType = 3
                    }

                }
                else {
                    var obj = {
                        orderType: orderType
                    }

                    _.each(row, (value, key) => {
                        var itemHeader = header[key]
                        _.find(headerMatchingTable, (headerArr, key) => {
                            if (headerArr.includes(itemHeader)) {
                                obj[key] = value
                            }
                        })

                    })
                    if (obj.orderPrice && typeof obj.orderPrice == "string") {

                        obj.orderPrice = obj.orderPrice.replace(/,/g, "")
                    }
                    if (obj.orderDate) {

                        obj.orderDate = moment(obj.orderDate).toDate()
                        obj.deliveryExpireDate = moment(obj.orderDate).add(18, "days").toDate()
                    }

                    list.push(obj)



                }

            })
            .on('end', function () {
                resolve()
            });
    })

    await asyncForEach(list, async item => {

        await Order.create(item)
    })

    /**
     * 주문알람 갯수처리
     * 상태가 발주전 ~ 포장완료 단계까지 중 구매자 ID가 같은갯수를 넣어줌
     */
    var noticeOrderList = await Order.findAll({
        attributes: ["buyerId", "productId", "buyerName"[sequelize.fn('count', sequelize.col('*')), 'count']],
        where: {
            [Op.or]: {
                buyerId: {
                    [Op.ne]: null
                },
                productId: {
                    [Op.ne]: null
                },
                buyerName: {
                    [Op.ne]: null
                },
            },
            status: {
                [Op.between]: [100, 600]
            }
        },
        group: ["buyerId", "productId", "buyerName"],
        having: sequelize.literal("count > 1")
    })
    await asyncForEach(noticeOrderList, async item => {
        await Order.update({
            orderNotice: item.dataValues.count
        }, {
            where: {
                [Op.or]: {
                    buyerId: item.dataValues.buyerId,
                    productId: item.dataValues.productId,
                    buyerName: item.dataValues.buyerName,
                },
                status: {
                    [Op.between]: [100, 600]
                }
            }
        })
    })

    res.json({
        res: true
    })
}))

router.post("/hscode/list", asyncHandling(async (req, res) => {
    var list = await Hscode.findAll({
        attributes: ["hscode", "kind"],
        where: {
            hscode: {
                [Op.ne]: null
            }
        }
    })
    var marketList = await Shop.findAll({
        attributes: ["market", "marketUrl"],
        where: {
            market: {
                [Op.ne]: null
            }
        }
    })
    var packageList = await Package.findAll({
        attributes: ['no', 'horizontal', 'vertical', 'height'],
        where: {
            no: {
                [Op.ne]: null
            }
        }
    })
    res.json({
        res: true,
        list,
        marketList,
        packageList
    })
}))

router.post("/shop/list", asyncHandling(async (req, res) => {
    var list = await Shop.findAll({
        attributes: ["market", "marketUrl"],
        where: {
            market: {
                [Op.ne]: null
            }
        }
    })
    res.json({
        res: true,
        list
    })
}))

router.post("/order/scanner", asyncHandling(async (req, res) => {
    var tradeId = req.body.tradeId

    var item = await Order.findOne({
        where: {
            tradeId: tradeId
        }
    })

    if (item == null) {
        res.send({ status: "no" })
    } else {
        res.send({ item: item })
    }
}))

router.post("/partnerShop/remove", asyncHandling(async (req, res) => {
    var checkList = req.body

    await asyncForEach(checkList, async (checkItem) => {
        var reMarket = checkItem.market
        var reMarketUrl = checkItem.marketUrl

        await Shop.destroy({
            where: {
                market: reMarket,
                marketUrl: reMarketUrl
            }
        }, {
            where: {
                market: reMarket
            }
        })
        res.json({
            res: true
        })
    })
}))

router.post("/partnerShop/add", asyncHandling(async (req, res) => {
    var market = req.body.market
    var marketUrl = req.body.marketUrl

    await Shop.create({
        market: market,
        marketUrl: marketUrl
    })
    res.json({
        res: true
    })
}))

router.post("/boxpackage", asyncHandling(async (req, res) => {
    var packageList = await Package.findAll({
        attributes: ['no', 'horizontal', 'vertical', 'height']
    })
    res.json({
        res: true,
        packageList
    })
}))

router.post("/boxpackage/add", asyncHandling(async (req, res) => {
    var box = req.body.no
    var horizontal = req.body.horizontal
    var vertical = req.body.vertical
    var height = req.body.height

    await Package.create({
        no: box,
        horizontal: horizontal,
        vertical: vertical,
        height: height
    })
    res.json({
        res: true
    })
}))

router.post("/boxpackage/remove", asyncHandling(async (req, res) => {
    var checkList = req.body

    await asyncForEach(checkList, async (checkItem) => {
        var box = checkItem.no
        var horizontal = checkItem.horizontal
        var vertical = checkItem.vertical
        var height = checkItem.height

        await Package.destroy({
            where: {
                no: box,
                horizontal: horizontal,
                vertical: vertical,
                height: height
            }
        }, {
            where: {
                no: box
            }
        })
    })
    res.json({
        res: true
    })
}))

router.post("/hscodeList", asyncHandling(async (req, res) => {
    var hscodeList = await Hscode.findAll({
        attributes: ['hscode', 'category', 'kind', 'product', 'origin']
    })
    res.json({
        res: true,
        hscodeList
    })
}))

router.post("/hscodeList/add", asyncHandling(async (req, res) => {
    var hscode = req.body.hscode
    var category = req.body.category
    var kind = req.body.kind
    var product = req.body.product
    var origin = req.body.origin

    await Hscode.create({
        hscode: hscode,
        category: category,
        kind: kind,
        product: product,
        origin: origin
    })
    res.json({
        res: true
    })
}))

router.post("/hscodeList/remove", asyncHandling(async (req, res) => {
    var checkList = req.body

    await asyncForEach(checkList, async (checkItem) => {
        var hscode = checkItem.hscode
        var category = checkItem.category
        var kind = checkItem.kind
        var product = checkItem.product
        var origin = checkItem.origin

        await Hscode.destroy({
            where: {
                hscode: hscode,
                category: category,
                kind: kind,
                product: product,
                origin: origin
            }
        }, {
            where: {
                hscode: hscode,
            }
        })
    })
    res.json({
        res: true
    })
}))

module.exports = router

