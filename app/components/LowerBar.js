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

export default class LowerBar extends Component {

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


        return (
            <View style={{flexDirection:"column"}}>
                <View style={styles.shadow}/>
                <View style={styles.container}>
                    <TouchableOpacity
                        style={styles.button1}
                        onPress={()=>this.onButton1Pressed()}>
                        <Text style={styles.innerText}>시험 시작</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.button2}
                        onPress={()=>this.onButton2Pressed()}>
                        <Text style={styles.innerText}>빠른 검색</Text>
                    </TouchableOpacity>
                    {/*<TouchableOpacity*/}
                    {/*style={styles.button3}*/}
                    {/*onPress={()=>this.onButton3Pressed}>*/}
                        {/*<Text style={styles.innerText}>마이페이지</Text>*/}
                {/*</TouchableOpacity>*/}
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
        paddingLeft:15,
        paddingRight:15,
    },
    shadow:{
        height:1,
        backgroundColor:"#A5BAE5",
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
    innerText:{
        textAlign:'center',
        color:"#3D485E",
        fontSize:15
    }
});
