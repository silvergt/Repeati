import {
    AsyncStorage
} from "react-native"
import store from '../stores'
import {toJS} from 'mobx'


export async function clearState() {
    await AsyncStorage.setItem("store","").then(()=>{
        console.log("store data cleared");
    });
}

export async function saveState(){
    console.log("to save : ",store);
    await AsyncStorage.setItem("store",JSON.stringify(toJS(store))).then(()=>{
        console.log('store data saved');
    });
}

export async function retrieveState(){
    let data = await AsyncStorage.getItem("store");
    if(data === null || data === undefined){
        return undefined;
    }
    return JSON.parse(data);
}