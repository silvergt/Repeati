/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    Image,
    TextInput,
    Dimensions
} from 'react-native';
import {inject,observer} from 'mobx-react'

const screen = Dimensions.get('window');

@inject("dictStore")
@observer
export default class ReviseWordbook extends Component {


    static navigationOptions =({navigation}) =>{
        return(
            {
                headerStyle: {
                    backgroundColor: "#fff",
                },
                headerTitle:
                    <Text>단어장 수정</Text>,
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
            wordbookSpecifics:0,
            wordbookLength:0,
            wordbookCorrectRate:0,
            revisedWordbookTitle:"",
        };
        this.onClickedComplete = this.onClickedComplete.bind(this);
    }

    componentDidMount(){
        this.props.navigation.setParams({
            holder:this,
        });

        const retrievedWordbook = this.props.dictStore.getWordbookById(this.props.navigation.getParam('wordbookID',-1));

        this.setState({
            wordbookSpecifics:retrievedWordbook,
            wordbookCorrectRate:this.getWordbookCorrectRate(retrievedWordbook.wordList),
            wordbookLength:retrievedWordbook.wordList.length,
            revisedWordbookTitle:retrievedWordbook.title,
        });
    }

    getWordbookCorrectRate(wordList){
        var totalSolved=0,totalCorrect=0;
        for(let i=0;i<wordList.length;i++){
            totalSolved+=wordList[i].totalSolved;
            totalCorrect+=wordList[i].totalCorrect;
        }

        if(totalSolved === 0){return 0}
        return (totalCorrect/totalSolved*100).toString().slice(0,5);
    }

    onClickedComplete(){
        const wordbookIndex = this.props.dictStore.getWordbookIndexById(this.props.navigation.getParam('wordbookID',-1));
        this.props.dictStore.wordbook[wordbookIndex].title=this.state.revisedWordbookTitle;

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
                            onChangeText={(text)=>{this.setState({revisedWordbookTitle:text})}}
                        >{this.state.wordbookSpecifics.title}</TextInput>
                        <View style={{width:screen.width*2/3,height:2,backgroundColor:'#427677',alignSelf:'center',}}/>
                    </View>
                    <View style={{height:60}}/>
                    <Text style={styles.plainText}>단어 수 : {this.state.wordbookLength}</Text>
                    <View style={{height:30}}/>
                    <Text style={styles.plainText}>단어장 정답률 : {this.state.wordbookCorrectRate}%</Text>
                    <View style={{flex:1}}/>
                </View>
                <TouchableOpacity  style={styles.lowerButton}
                                   onPress={()=>{this.onClickedComplete()}}
                >
                    <Text style={styles.lowerButtonText}>수정 완료</Text>
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
    wordbookTextInputContainer:{
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
        height:50,
    },
    lowerButtonText:{
        color:'white',
        alignSelf:'center',
        fontSize:17,
    }
});
