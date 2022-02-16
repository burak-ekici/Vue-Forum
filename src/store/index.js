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
            authId: 'gfdgdf',
            unsubscribes : [],
            authUserUnsubscribe : null
        },
        getters,
        actions,
        mutations
    }
)



