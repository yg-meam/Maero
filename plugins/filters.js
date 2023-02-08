import Vue from 'vue'
import _ from "underscore"
import moment from "moment"
import numeral from "numeral"
Vue.filter("date", function (value, format) {
    if (!value) {
        return ""
    }
    return moment(value).format(format);
});

Vue.filter("nl2br", function (value) {
    if (!value) {
        return ""
    }
    return value.replace(/\n/gi, "<br>");
});
Vue.filter("number", function (value, format) {
    var ret = numeral(value).format(format)
    if (_.isNaN(ret)) {
        ret = 0
    }
    return ret;
});