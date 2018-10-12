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
    TouchableOpacity,
    Text, Dimensions,
} from 'react-native';
import Image from 'react-native-fast-image'

export default class LowerBar extends Component {

    constructor(){
        super();

        this.state={
            btn1Enabled:true,
            btn2Enabled:true,
            btn3Enabled:true,
        }
    }

    componentDidMount(){
        this.setState({
            btn1Enabled:this.props.btn1Enabled === undefined ? true : this.props.btn1Enabled,
            btn2Enabled:this.props.btn2Enabled === undefined ? true : this.props.btn2Enabled,
            btn3Enabled:this.props.btn3Enabled === undefined ? true : this.props.btn3Enabled,
        })
    }

    onButton1Pressed(){
        if(this.props.button1Pressed !== undefined) {
            this.props.button1Pressed();
        }
    }

    onButton2Pressed(){
        if(this.props.button2Pressed !== undefined) {
            this.props.button2Pressed();
        }
    }

    onButton3Pressed(){
        if(this.props.button3Pressed !== undefined) {
            this.props.button3Pressed();
        }
    }


    render() {

        let btn1,btn2,btn3;

        if(this.state.btn1Enabled){
            btn1=
                <TouchableOpacity
                    style={styles.button1}
                    onPress={()=>this.onButton1Pressed()}>
                    <Image
                        style={styles.innerImage}
                        source={require("../res/images/tabbar/test.png")}
                        resizeMode={Image.resizeMode.contain}
                    />
                    <Text style={styles.innerText}>시험 시작</Text>
                </TouchableOpacity>;
        }else{
            btn1=undefined;
        }

        if(this.state.btn2Enabled){
            btn2=
                <TouchableOpacity
                    style={styles.button1}
                    onPress={()=>this.onButton2Pressed()}>
                    <Image
                        style={styles.innerImage}
                        source={require("../res/images/tabbar/search.png")}
                        resizeMode={Image.resizeMode.contain}
                    />
                    <Text style={styles.innerText}>빠른 검색</Text>
                </TouchableOpacity>;
        }else{
            btn2=undefined;
        }

        if(this.state.btn3Enabled){
            btn3=
                <TouchableOpacity
                    style={styles.button3}
                    onPress={()=>this.onButton3Pressed()}>
                    <Image
                        style={styles.innerImage}
                        source={require("../res/images/tabbar/settings.png")}
                        resizeMode={Image.resizeMode.contain}
                    />
                    <Text style={styles.innerText}>설정</Text>
                </TouchableOpacity>;
        }else{
            btn3=undefined;
        }


        return (
            <View style={{flexDirection:"column"}}>
                <View style={styles.shadow}/>
                <View style={styles.container}>
                    {btn1}
                    {btn2}
                    {btn3}
                </View>
            </View>
        );
    }
}

const screen = Dimensions.get("window");
const lowerBarHeight = 60;
const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'center',
        width:screen.width,
        height:lowerBarHeight,
        backgroundColor:'white',
    },
    shadow:{
        height:1,
        backgroundColor:"#CCCCCC",
    },
    button1:{
        flex:1,
        justifyContent: 'center',
    },
    button2:{
        flex:1,
        justifyContent: 'center',
    },
    button3:{
        flex:1,
        justifyContent: 'center',
    },
    innerImage:{
        height:"38%",
        justifyContent:'center',
        marginBottom:5,
        alignSelf:'center'
    },
    innerText:{
        justifyContent:'center',
        textAlign:'center',
        color:"#000000",
        fontSize:11,
        fontWeight:'100'
    }
});
