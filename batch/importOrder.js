/**
 *  주문목록 받아서 db에 import 시키기 위한 배치 스크립트 파일
 */

require("../module/db_production")
// require("../module/db")
var fs = require("fs")
var path = require("path")
var qs = require("querystring");
var _ = require("underscore");
var asyncForEach = require('async-await-foreach');
const AutoDetectDecoderStream = require('autodetect-decoder-stream');
const CsvReadableStream = require('csv-reader');

var _ = require('underscore');
(async () => {
    var list = []
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
        productId: ["商品ID"],
        productName: ["商品名"],
        orderPrice: ["価格"],
        orderNumber: ["受注数"],
        tradeId: ["取引ID"],
        buyerId: ["ニックネーム"],
        buyerName: ["名前（本名）"],
        buyerPhone: ["電話番号"],
        zipcode: ["郵便番号"],
        address: ["住所"],
        buyerEngName: ["名前（ローマ字）"],
        engAddress: ["住所(ローマ字)"],
        deliveryType: ["発送方法"],
        colorSize: ["色・サイズ"],
        memo: ["受注メモ"],
    }
    let inputStream = fs.createReadStream(path.join(__dirname, "data", "order1.csv")).pipe(new AutoDetectDecoderStream({ defaultEncoding: '1255' }));;
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
                    console.log(header)

                    if (_.isEqual(header, type1Header)) {
                        orderType = 1
                    }
                    if (_.isEqual(header, type2Header)) {
                        orderType = 2
                    }
                    if (_.isEqual(header, type3Header)) {
                        orderType = 3
                    }
                    console.log(orderType)
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
                    // console.log(obj)
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

    process.exit()
})()