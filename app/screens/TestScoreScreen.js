/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    TouchableOpacity,
    Text,
    Dimensions
} from 'react-native';
import Image from 'react-native-fast-image';

const screen = Dimensions.get('window');

export default class TestScoreScreen extends Component {

    static navigationOptions = ({navigation}) =>{
        return(
            {
                headerStyle: {
                    backgroundColor: "#fff",
                    borderBottomColor:'#222222',
                    borderBottomWidth:0.3,
                    elevation:0,
                },
                headerTitle:
                    <Text style={{
                        color:'black',
                    }}>시험 결과</Text>,
                headerLeft:
                    <TouchableOpacity
                        style={{
                            width:50,
                            height:'100%',
                            justifyContent:'center',
                            alignItems:'center',
                        }}
                        onPress={()=>{navigation.goBack()}}
                    >
                        <Image style={{width:20,height:20}} source={require("../res/images/back.png")}/>
                    </TouchableOpacity>,
                headerRight:
                    <TouchableOpacity
                        style={{
                            width:80,
                            height:'100%',
                            justifyContent:'center',
                            alignItems:'center',
                        }}
                        onPress={()=>{navigation.state.params.holder.onClickedComplete()}}>
                        <Text>점수확인</Text>
                    </TouchableOpacity>

            }
        )
    };

    constructor(){
        super();
    }

    componentDidMount(){
        this.totalCorrect = this.props.navigation.getParam('totalCorrect',0);
        this.totalSolved = this.props.navigation.getParam('totalSolved',0);
        this.setState({})

    }

    onClickEndTest(){
        this.props.navigation.goBack();
    }

    onClickReTest(){
        this.props.navigation.goBack();
        this.props.navigation.navigate('TestScreen',{
            wordbookID:0,
        })
    }

    render() {
        let point = 0;
        if(this.totalSolved!==0){
            point = this.totalCorrect/this.totalSolved*100;
            point = Math.round(point);
        }

        return (

            <View style={styles.container}>

                <View style={{flex:4}}/>

                <Text style={styles.normalText}>최종점수</Text>

                <View style={{flex:1}}/>

                <Text style={styles.bigText}>{this.totalCorrect} / {this.totalSolved}</Text>

                <View style={{flex:1}}/>

                <Text style={styles.normalText}>100점 만점 : {point}점</Text>

                <View style={{flex:2}}/>

                <TouchableOpacity
                    style={styles.buttonContainer}
                    activeOpacity={0.8}
                    onPress={()=>{
                        this.onClickEndTest();
                    }}
                >
                    <Text
                        style={styles.buttonText}
                    >시험 종료</Text>
                </TouchableOpacity>
                <View style={{height:20}}/>
               <TouchableOpacity
                    style={styles.buttonContainer}
                    activeOpacity={0.8}
                    onPress={()=>{
                        this.onClickReTest();
                    }}
                >
                    <Text
                        style={styles.buttonText}
                    >다시 보기</Text>
                </TouchableOpacity>
                <View style={{flex:4}}/>
            </View>
        );
    }
}


const styles = StyleSheet.create({
    container: {
        justifyContent:'center',
        alignItems:'center',
        flex: 1,
        flexDirection: 'column',
        backgroundColor:'#F4F4F4',
    },
    buttonContainer:{
        height:50,
        width:screen.width/2,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:'#344768',
        borderRadius:4,
    },
    buttonText:{
        color:'white',
        fontSize:16,
    },
    normalText:{
        color:'#266261',
        alignSelf:'center',
        fontSize:18,
    },
    bigText:{
        color:'black',
        fontSize:40,
        alignSelf:'center',
    }
});
