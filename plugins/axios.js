export default function ({ $axios, app, redirect }) {
    $axios.onResponse(res => {

        if (res && res.data && !res.data.res && res.data.code == 401) {
            return redirect('/')
        }
        else if (res && res.data && !res.data.res && res.data.msg) {
            window.alert(res.data.msg)
        }
        return res

    })
    // $axios.onRequest(config => {
    //   config.params = config.params || {}; // get existing parameters
    //   config.params['lang'] = app.i18n.locale;
    // })

    $axios.onError(error => {
        console.log(`시스템 오류가 발생했습니다 관리자에게 문의해주세요[${error}]`)
        //   const code = parseInt(error.response && error.response.status)
        //   if (code === 400) {
        //     redirect('/400')
        //   }
    })
}