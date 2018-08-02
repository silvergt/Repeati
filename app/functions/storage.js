import {
    AsyncStorage
} from "react-native"
import store from '../stores'
import {toJS} from 'mobx'


export async function clearState() {
    AsyncStorage.setItem("store","").then(()=>{
        console.log("store data cleared");
    });
}

export async function saveState(){
    console.log("to save : ",store);
    AsyncStorage.setItem("store",JSON.stringify(toJS(store))).then(()=>{
        console.log('store data saved');
    });
}

export async function retrieveState(){
    AsyncStorage.getItem("store").then((data)=>{
        if(data === null || data === undefined){
            return;
        }
        const dataTemp = JSON.parse(data);
        console.log('retrieved : ',dataTemp);
        try {
            if(dataTemp.dictStore.wordbookID !== undefined) {
                store.dictStore.wordbookID = dataTemp.dictStore.wordbookID;
                store.dictStore.wordID = dataTemp.dictStore.wordID;
                store.dictStore.wordbook = dataTemp.dictStore.wordbook;
            }
        }catch (e) {console.log("dictStore error : ",e)}
        try{
            if(dataTemp.userStore.userSerialNumber !== undefined) {
                store.userStore.userSerialNumber = dataTemp.userStore.userSerialNumber;
                store.userStore.userName = dataTemp.userStore.userName;
                store.userStore.totalSolved = dataTemp.userStore.totalSolved;
                store.userStore.totalCorrect = dataTemp.userStore.totalCorrect;
            }
        }catch (e) {{console.log("userStore error : ",e)}}
    }).done();
}