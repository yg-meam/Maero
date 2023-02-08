import 'babel-polyfill'
import Vue from 'vue'
import VueAwesomeSwiper from 'vue-awesome-swiper'
import 'swiper/swiper-bundle.css'

import _ from "underscore"
import moment from "moment"


window._ = _
window.moment = moment

import VueCookies from "vue-cookies";
//쿠키를 사용한다.
Vue.use(VueCookies);
Vue.$cookies.config("10y");



import hhInput from "@/components/hhInput"
import hhSelect from "@/components/hhSelect"
import ImageBox from "@/components/ImageBox"
import AddressDialog from "@/components/AddressDialog"

Vue.component('hhInput', hhInput)
Vue.component('hhSelect', hhSelect)
Vue.component('ImageBox', ImageBox)
Vue.component('AddressDialog', AddressDialog)
Vue.use(VueAwesomeSwiper, /* { default options with global component } */)


import Highcharts from "highcharts";
import HighchartsVue from 'highcharts-vue'
import HighchartsMore from "highcharts/highcharts-more";
HighchartsMore(Highcharts)
Vue.use(HighchartsVue)


import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme
import VueQuillEditor from 'vue-quill-editor'
Vue.use(VueQuillEditor, /* { default global options } */)



import VueNumber from 'vue-number-animation'
Vue.use(VueNumber)


import VueMask from 'v-mask'
Vue.use(VueMask);

// import 'fullpage.js/vendors/scrolloverflow' // Optional. When using scrollOverflow:true
// import VueFullPage from 'vue-fullpage.js'

// Vue.use(VueFullPage);


import VueClipboard from 'vue-clipboard2'
Vue.use(VueClipboard)

import VueLazyload from 'vue-lazyload'

Vue.use(VueLazyload)

import 'tui-grid/dist/tui-grid.css';
import 'tui-date-picker/dist/tui-date-picker.css';

var toastui = require('@toast-ui/vue-grid');

var Grid = toastui.Grid;

Vue.component('grid', Grid, {
    theme: "clean"
})