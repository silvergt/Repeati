/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Platform,
    Image
} from 'react-native';

export default class SettingButton extends Component {

    constructor(){
        super();
        this.state={
            setToSetting:true
        }
    }

    toggleButton(settingEnabled){
        this.setState({
            setToSetting:settingEnabled,
        })
    }

    render() {
        let ImgVar;

        if(this.state.setToSetting){
            ImgVar =
                <Image style={styles.imageStyle} source={require("../res/images/settings.png")}/>;
        }else{
            ImgVar =
                <Image style={styles.imageStyle} source={require("../res/images/complete.png")}/>
        }

        return (
            <View>
                {ImgVar}
            </View>
        );
    }
}


const styles = StyleSheet.create({
    imageStyle: {
        width:20,
        height:20
    },
});
