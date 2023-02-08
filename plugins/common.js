import Vue from "vue"



import _ from "underscore";
import numeral from "numeral";

Vue.mixin({
    data() {
        return {

            incomeBankAccount: "215-106268-01-016",
            incomeFields: ["카드입금", "현금입금", "기타입금"],
            outgoingFields: [
                "인건비",
                "인건비(프리랜서)",
                "4대보험",
                "고정비",
                "식재료업체",
                "식재료",
                "부가세",
                "세금",
                "배달",
                "기타",
            ],
        }
    },
    filters: {
        nl2br(input) {
            if (input) { 
                return input.replace(/\n/gi, "<br>");
            }
        },
        num2han(num) {
            if (num) {
                num = parseInt((num + "").replace(/[^0-9]/g, ""), 10) + ""; // 숫자/문자/돈 을 숫자만 있는 문자열로 변환
                if (num == "0") return "영";
                var number = [
                    "영",
                    "일",
                    "이",
                    "삼",
                    "사",
                    "오",
                    "육",
                    "칠",
                    "팔",
                    "구",
                ];
                var unit = [
                    "",
                    "만",
                    "억",
                    "조",
                    "경",
                    "해",
                    "자",
                    "양",
                    "구",
                    "간",
                    "정",
                ];
                var smallUnit = ["천", "백", "십", ""];
                var result = []; //변환된 값을 저장할 배열
                var unitCnt = Math.ceil(num.length / 4); //단위 갯수. 숫자 10000은 일단위와 만단위 2개이다.
                num = num.padStart(unitCnt * 4, "0"); //4자리 값이 되도록 0을 채운다
                var regexp = /[\w\W]{4}/g; //4자리 단위로 숫자 분리
                var array = num.match(regexp);
                //낮은 자릿수에서 높은 자릿수 순으로 값을 만든다(그래야 자릿수 계산이 편하다)
                for (var i = array.length - 1, unitCnt = 0; i >= 0; i--, unitCnt++) {
                    var hanValue = _makeHan(array[i]); //한글로 변환된 숫자
                    if (hanValue == "")
                        //값이 없을땐 해당 단위의 값이 모두 0이란 뜻.
                        continue;
                    result.unshift(hanValue + unit[unitCnt]); //unshift는 항상 배열의 앞에 넣는다.
                }
                //여기로 들어오는 값은 무조건 네자리이다. 1234 -> 일천이백삼십사
                function _makeHan(text) {
                    var str = "";
                    for (var i = 0; i < text.length; i++) {
                        var num = text[i];
                        if (num == "0")
                            //0은 읽지 않는다
                            continue;
                        str += number[num] + smallUnit[i];
                    }
                    return str;
                }
                return result.join("");
            }
        },
        taxType(input) {
            var finded = _.find(taxType, (item) => {
                return item.value == input;
            });
            return finded && finded.text;
        },
        accountStatus(input) {
            var finded = _.find(accountStatus, (item) => {
                return item.value == input;
            });
            return finded && finded.text;
        },
        storeStatus(input) {
            var finded = _.find(storeStatus, (item) => {
                return item.value == input;
            });
            return finded && finded.text;
        },
        userAuth(input) {
            var finded = _.find(userAuth, (item) => {
                return item.value == input;
            });
            return finded && finded.text;
        },
        bankTransactionType(input) {
            var finded = _.find(bankTransactionType, (item) => {
                return item.value == input;
            });
            return finded && finded.text;
        },
        bankAccountType(input) {
            var finded = _.find(bankAccountType, (item) => {
                return item.value == input;
            });
            return finded && finded.text;
        },
        fundingStatus(input) {
            var finded = _.find(fundingStatus, (item) => {
                return item.value == input;
            });
            return finded && finded.text;
        },
        documentType(input) {
            var finded = _.find(documentType, (item) => {
                return item.value == input;
            });
            return finded && finded.text;
        },
        fundingType(input) {
            var finded = _.find(fundingType, (item) => {
                return item.value == input;
            });
            return finded && finded.text;
        },
        bankCode(input) {
            var finded = _.find(bankCode, (item) => {
                return item.code == input;
            });
            return finded && finded.name;
        },
        fieldType(input) {
            var finded = _.find(fieldType, (item) => {
                return item.value == input;
            });
            return finded && finded.text;
        },
        transactionType(input) {
            var finded = _.find(transactionType, (item) => {
                return item.value == input;
            });
            return finded && finded.text;
        },
        price(price) {

            if (price >= 10000) {
                var man = price - Math.floor(price / 10000) * 10000;

                var txt = `${numeral(Math.floor(price / 10000)).format("0,000")}억`;
                if (man > 0) {
                    txt = `${numeral(Math.floor(price / 10000)).format(
                        "0,000"
                    )}억 ${numeral(price - Math.floor(price / 10000) * 10000).format(
                        "0,000"
                    )}만`;
                }
                return txt;
            } else {
                return `${numeral(price).format("0,000")}만`;
            }
        },
        accountPrice(price) {
            price = Math.floor(price)
            if (price >= 100000000) {
                var uk = price - Math.floor(price / 100000000) * 100000000;

                var txt = `${numeral(Math.floor(price / 100000000)).format("0,000")}억`;
                if (uk > 0) {
                    txt = `${numeral(Math.floor(price / 100000000)).format(
                        "0,000"
                    )}억 ${numeral(
                        price - Math.floor(price / 100000000) * 100000000
                    ).format("0,000")}만`;
                }
                return txt;
            } else if (price > 10000) {
                var man = price - Math.floor(price / 10000) * 10000;
                var txt = `${numeral(Math.floor(price / 10000)).format("0,000")}만`;
                if (man > 0) {
                    txt = `${numeral(Math.floor(price / 10000)).format(
                        "0,000"
                    )}만 ${numeral(price - Math.floor(price / 10000) * 10000).format(
                        "0,000"
                    )}`;
                }
                return txt;
            } else {
                return `${numeral(price).format("0,000")}`;
            }
        },
        accountSum(accounts) {
            var sum = 0;
            sum = _.reduce(
                accounts,
                (memo, account) => {
                    return memo + account.total;
                },
                sum
            );
            return sum;
        },
        accountAllocation(accounts) {
            var sum = 0;
            sum = _.reduce(
                accounts,
                (memo, account) => {
                    return memo + account.allocation;
                },
                sum
            );
            return sum;
        },
        accountExtra(accounts) {
            var sum = 0;
            sum = _.reduce(
                accounts,
                (memo, account) => {
                    return memo + account.extra;
                },
                sum
            );
            return sum;
        },
    },
    methods: {

        //해당 매장의 1개월 보증금이자 총액구하기
        getDepositInterest(store) {
            return ((store.depositFunding *
                10000) *
                (store.depositRating / 100)) / 12
        },
        sum(list, field) {
            return _.reduce(
                list,
                (memo, item) => {
                    return memo + item[field];
                },
                0
            );
        },
        priceFormat(price) {
            if (price >= 10000) {
                var man = price - Math.floor(price / 10000) * 10000;

                var txt = `${numeral(Math.floor(price / 10000)).format("0,000")}억`;
                if (man > 0) {
                    txt = `${numeral(Math.floor(price / 10000)).format(
                        "0,000"
                    )}억 ${numeral(price - Math.floor(price / 10000) * 10000).format(
                        "0,000"
                    )}만`;
                }
                return txt;
            } else {
                return `${numeral(price).format("0,000")}만`;
            }
        },
    }
})