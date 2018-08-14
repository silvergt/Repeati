
import React, {Component} from 'react';
import {
    Provider
}from 'mobx-react'
import {createStackNavigator} from 'react-navigation'
import {AppRegistry} from 'react-native';
import {name as appName} from './app.json';
import store from './app/stores'
import WordbookScreen from "./app/screens/WordbookScreen";
import ReviseWordbook from "./app/screens/ReviseWordbook";
import ReviseWord from "./app/screens/ReviseWord";
import WordPage from "./app/screens/WordPage";
import AddNewFolder from "./app/screens/AddNewFolder";
import AddNewWord from "./app/screens/AddNewWord";
import TestScreen from "./app/screens/TestScreen"


const RootStack = createStackNavigator({
        Home:{
            screen:WordbookScreen,
        },
        ReviseWordbook:{
            screen:ReviseWordbook,
        },
        WordPage:{
            screen:WordPage,
        },
        ReviseWord:{
            screen:ReviseWord,
        },
        AddNewFolder:{
            screen:AddNewFolder,
        },
        AddNewWord:{
            screen:AddNewWord,
        },
        TestScreen:{
            screen:TestScreen,
        }
    },
    {initialRouteName:"Home", }
);

class App extends Component{
    render(){
        return(
            <Provider {...store}>
                <RootStack/>
            </Provider>
        );
    }
}

AppRegistry.registerComponent(appName, () => App);
