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
    TouchableOpacity,
    Image,
    TextInput,
    Dimensions, Alert
} from 'react-native';
import {inject,observer} from 'mobx-react'

const screen = Dimensions.get('window');

@inject("dictStore")
@observer
export default class AddNewFolder extends Component {

    /**
     * @param;
     * navigation
     * onGoBack()
     *
     */

    static navigationOptions =({navigation}) =>{
        return(
            {
                headerStyle: {
                    backgroundColor: "#fff",
                },
                headerTitle:
                    <Text>단어장 추가</Text>,
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
                headerRight:
                    <TouchableOpacity style={
                        {
                            width:50,
                            height:'100%',
                            justifyContent:'center',
                            alignItems:'center',

                        }
                    }

                                      onPress={()=>{navigation.state.params.holder.onClickedComplete()}}>
                        <Text>완료</Text>
                    </TouchableOpacity>

            }
        )
    };

    constructor(){
        super();
        this.state={
            wordbookTitle:"",
        };
        this.onClickedComplete = this.onClickedComplete.bind(this);
    }

    componentDidMount(){
        this.props.navigation.setParams({
            holder:this,
        });
    }

    onClickedComplete(){
        if(this.state.wordbookTitle === ""){
            Alert.alert(
                '앗!',
                '단어장 이름을 입력해주세요!',
                [
                    {text: 'OK', onPress: () => console.log('OK Pressed') },
                ]
            );
            return;
        }

        this.props.dictStore.addNewWordbook(this.state.wordbookTitle);

        let goBackListener = this.props.navigation.getParam('onGoBack',-1);
        goBackListener();

        this.props.navigation.goBack()
    }


    render() {

        return (
            <View style={styles.container}>
                <View style={styles.container}>
                    <View style={{flex:1}}/>
                    <Text style={styles.plainText}>폴더명</Text>
                    <View style={{height:20}}/>
                    <View style={styles.wordbookTextInputContainer}>
                        <TextInput
                            style={styles.wordbookTextInput}
                            maxLength={25}
                            returnKeyType='done'
                            blurOnSubmit={true}
                            onChangeText={(text)=>{this.setState({wordbookTitle:text})}}
                        >{this.state.wordbookTitle}</TextInput>
                        <View style={{width:screen.width*2/3,height:2,backgroundColor:'#427677',alignSelf:'center',}}/>
                    </View>
                    <View style={{flex:1.5}}/>
                </View>
                <TouchableOpacity  style={styles.lowerButton}
                                   onPress={()=>{this.onClickedComplete()}}
                >
                    <Text style={styles.lowerButtonText}>추가하기</Text>
                </TouchableOpacity>
            </View>
        );
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor:'white',
        justifyContent:'center'
    },
    wordbookTextInput:{
        width:screen.width,
        textAlign:'center',
        justifyContent:'center',
        alignSelf:'center',
        fontSize:20,
        marginBottom:5,
    },
    plainText:{
        color:"#427677",
        fontSize:16,
        alignSelf:'center',
    },
    lowerButton:{
        justifyContent:'center',
        backgroundColor:'#344768',
        height:60,
    },
    lowerButtonText:{
        color:'white',
        alignSelf:'center',
        fontSize:17,
    }
});
