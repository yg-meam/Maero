/**
 * 상자목록 DB에 넣기
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
var xlsx = require("xlsx")

var _ = require('underscore');
(async () => {
    const workbook = xlsx.readFile(path.join(__dirname, "data", "partnerShopList.xlsx"), {
        cellDates: true,
        cellNF: false,
        cellText: false
    });
    // console.log(workbook.Sheets)
    var key = _.keys(workbook.Sheets)
    var sheet = workbook.Sheets[key[0]]
    var result = xlsx.utils.sheet_to_json(sheet, {
        // header: 1,
        // dateNF: "YYYY-MM-DD;@"
    });
    await asyncForEach(result, async item => {
        console.log(item)
        await Shop.create({
            market: item["매입처명"],
            marketUrl: item["URL"],
        })
    })

    process.exit()
})()