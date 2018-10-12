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
    Text,
    ScrollView,
    TouchableOpacity
} from 'react-native';
import Image from 'react-native-fast-image';
import email from 'react-native-email'


export default class SettingsScreen extends Component {

    static navigationOptions =({navigation}) =>{
        return(
            {
                headerStyle: {
                    backgroundColor: "#fff",
                    elevation:0,
                    borderBottomColor:'#CCCCCC',
                    borderBottomWidth:0.5,
                },
                headerTitle:
                    <Text style={{
                        color:'black',
                        fontWeight:'500'
                    }}>설정</Text>,
                headerLeft:
                    <TouchableOpacity style={
                        {
                            width:50,
                            height:'100%',
                            justifyContent:'center',
                            alignItems:'center',

                        }
                    }
                                      onPress={()=>{navigation.goBack()}}
                    >
                        <Image style={{width:20,height:20}} source={require("../res/images/back.png")}/>
                    </TouchableOpacity>,

            }
        )
    };

    openUpdateInfo(){
        this.props.navigation.navigate("UpdateListScreen");
    }

    openInquiry(){
        email(['silvergt04@gmail.com'],{
            subject:"리피티! 이 얘기를 하고싶어요!"
        }).catch(console.error)
    }

    render() {

        return (
            <View style={styles.container}>
                <View style={{height:40}}/>
                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={()=>{
                        this.openUpdateInfo();
                    }}
                >
                    <View style={styles.settingEntity}>
                        <Image
                            style={styles.settingImage}
                            source={require("../res/images/settings_screen/upgrade.png")}
                            resizeMode={Image.resizeMode.contain}
                        />
                        <Text
                            style={styles.settingText}
                        >업데이트 내역</Text>
                    </View>
                </TouchableOpacity>
                <View style={{height:80}}/>
                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={()=>{
                        this.openInquiry();
                    }}
                >
                    <View style={styles.settingEntity}>
                        <Image
                            style={styles.settingImage}
                            source={require("../res/images/settings_screen/mail.png")}
                            resizeMode={Image.resizeMode.contain}
                        />
                        <Text
                            style={styles.settingText}
                        >개발자에게 문의하기</Text>
                    </View>
                </TouchableOpacity>
            </View>
        );
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor:'#EEEEEE'
    },
    settingEntity:{
        flexDirection:'row',
        backgroundColor:'white',
        borderBottomColor:"#A4A4A4",
        borderBottomWidth:0.3,
        borderTopColor:"#A4A4A4",
        borderTopWidth:0.3,
        height:50,
    },
    settingImage:{
        alignSelf:'center',
        justifyContent:'center',
        height:"60%",
        width:80,
    },
    settingText:{
        alignSelf:'center',
        color:'black',
    },

});
