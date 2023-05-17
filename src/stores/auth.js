import { defineStore } from 'pinia'


const useAuth = defineStore({
    id: 'authInfo',
    state: () => ({
        userInfo: null
    }),
    actions: {
        setUserInfo(userInfo) {
            this.userInfo = userInfo
        }
    }
})
export { useAuth }
