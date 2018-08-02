
import {DictionaryStore} from './DictionaryStore'
import {UserStore} from './UserStore'


const dicStore = new DictionaryStore;
const usrStore = new UserStore;

export default {
    dictStore:dicStore,
    userStore:usrStore,
}