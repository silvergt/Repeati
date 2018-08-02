
import React, {Component} from 'react';
import {
    Provider
}from 'mobx-react'
import {AppRegistry} from 'react-native';
import Home from './app/screens/Home';
import {name as appName} from './app.json';
import store from './app/stores'

class App extends Component{

    render(){
        return(
            <Provider {...store}>
                <Home/>
            </Provider>
        );
    }
}

AppRegistry.registerComponent(appName, () => App);
