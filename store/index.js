export const state = () => ({
    userInfo: null,
    loginCallCount: 0,
    loginRedirect: "/",
    landingTop: false
})

export const mutations = {
    setLandingTop(state, landingTop) {
        state.landingTop = landingTop
    },

    setUserInfo(state, userInfo) {
        state.userInfo = userInfo

    },
    logout(state) {
        state.userInfo = null
    },

    openLogin(state, path) {
        state.loginCallCount++
        state.loginRedirect = path || "/"
    }

}
