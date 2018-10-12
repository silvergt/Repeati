
import React, {Component} from 'react';
import {
    Provider
}from 'mobx-react'
import { createStackNavigator,createBottomTabNavigator } from 'react-navigation';
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
import TestScoreScreen from "./app/screens/TestScoreScreen"
import WebScreen from "./app/screens/WebScreen"
import InstantSearchScreen from "./app/screens/InstantSearchScreen"
import SettingsScreen from "./app/screens/SettingsScreen"
import UpdateListScreen from "./app/screens/UpdateListScreen"

import RNSplashScreen from 'react-native-splash-screen'

const RootStack = createBottomTabNavigator({
    Home:createStackNavigator({
        MainScreen:{
            screen:WordbookScreen,
        },
        ReviseWordbook,
        WordPage,
        ReviseWord,
        AddNewFolder,
        AddNewWord,
        TestScreen,
        TestScoreScreen,
        WebScreen,
        InstantSearchScreen,
        SettingsScreen,
        UpdateListScreen,
    },{
        initialRouteName:"MainScreen",
    })
},{
    tabBarOptions:{
        style:{
            height:0,
            backgroundColor:'white',
            borderTopColor:'white',
        }
    }
});


class App extends Component{


    componentDidMount(){
        setTimeout(()=>{
            console.log("MOQ");
            RNSplashScreen.hide();
        },800);

    }

    render(){
        return(
            <Provider {...store}>
                <RootStack/>
            </Provider>
        );
    }
}

AppRegistry.registerComponent(appName, () => App);
