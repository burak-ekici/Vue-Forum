import {createStore} from 'vuex'
import getters from '@/store/getters'
import mutations from '@/store/mutations'
import actions from '@/store/actions'


export default createStore(
    {
        state: {
            categories:[],
            forums:[],
            threads:[],
            posts:[],
            users:[],
            authId: 'VXjpr2WHa8Ux4Bnggym8QFLdv5C3',
            unsubscribes : []
        },
        getters,
        actions,
        mutations
    }
)



