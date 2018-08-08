
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
import WordPage from "./app/screens/WordPage";


const RootStack = createStackNavigator({
    Home:{
        screen:WordbookScreen,
    },
    ReviseWordbook:{
        screen:ReviseWordbook,
    },
    WordPage:{
        screen:WordPage,
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
