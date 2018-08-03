
import React, {Component} from 'react';
import {
    Provider
}from 'mobx-react'
import {createStackNavigator} from 'react-navigation'
import {AppRegistry} from 'react-native';
import Home from './app/screens/Home';
import {name as appName} from './app.json';
import store from './app/stores'


const RootStack = createStackNavigator({
    Home:{
        screen:Home,
        },
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
