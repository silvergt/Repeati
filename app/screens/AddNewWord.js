/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react';
import ReactNative, {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    TextInput,
    Dimensions,
    Alert,
    Keyboard,
} from 'react-native';
import Image from 'react-native-fast-image';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import {inject,observer} from 'mobx-react'
import RecommendedWord from "../components/RecommendedWord";
import {getMeaning} from "../functions/dictionary";
import SelectListPopup from "../components/SelectListPopup";

const screen = Dimensions.get('window');

@inject("dictStore")
@observer
export default class AddNewWord extends Component {

    static navigationOptions = ({navigation}) =>{
        return(
            {
                headerStyle: {
                    backgroundColor: "#fff",
                },
                headerTitle:
                    <Text>단어 추가</Text>,
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
                            width:50,
                            height:'100%',
                            justifyContent:'center',
                            alignItems:'center',
                        }}
                        onPress={()=>{navigation.state.params.holder.onClickedComplete()}}>
                        <Text>추가</Text>
                    </TouchableOpacity>

            }
        )
    };

    constructor(){
        super();
        this.state={
            wordbookID:0,
            newWordTitle:"",
            newWordMean:"",

            recommendedWords:[],
        };
        this.onClickedComplete = this.onClickedComplete.bind(this);
    }

    componentDidMount(){
        this.props.navigation.setParams({
            holder:this,
        });

        this.setState({
            wordbookID:this.props.navigation.getParam('wordbookID',0),
        });
    }

    onClickedComplete(){
        if(this.state.newWordTitle === "" || this.state.newWordMean === ""){
            Alert.alert(
                '앗!',
                '영어단어와 뜻을 모두 입력해주세요!',
                [
                    {text: 'OK', onPress: () => console.log('OK Pressed') },
                ]
            );
            return;
        }

        this.props.dictStore.addNewWord(this.state.wordbookID,this.state.newWordTitle,this.state.newWordMean);
        
        let goBackListener = this.props.navigation.getParam('onGoBack',-1);
        goBackListener();

        this.props.navigation.goBack();
    }

    onChangeWordTextInput(text){
        this.setState({
            newWordTitle: text
        });

        getMeaning(text).then((wordListTemp)=>{
            var recommendedWordTemp = [];
            const maxLength = wordListTemp.length < 3 ? wordListTemp.length : 3;
            for(let i=0;i<maxLength;i++){
                recommendedWordTemp.push(wordListTemp[i]);
            }
            this.setState({
                recommendedWords: recommendedWordTemp,
            })
        });
    }

    getSelectedWordbookTitle(){
        if(this.state.wordbookID === undefined || this.state.wordbookID === -1){
            return "단어장";
        }else{
            return this.props.dictStore.getWordbookById(this.state.wordbookID).title;
        }

    }

    openWordbookSelectPopup(){
        this.selectWordbookPopup.show();
    }

    scrollToInput (reactNode: any) {
        this.scroll.scrollToFocusedInput(reactNode)
    }


    render() {

        var recommendedWords=[];
        for(let i=0;i<this.state.recommendedWords.length;i++){
            recommendedWords.push(
                <RecommendedWord
                    style={{marginLeft:15,marginRight:15,marginTop:10,height:40}}
                    word={this.state.recommendedWords[i].word}
                    mean={this.state.recommendedWords[i].mean}
                    onSelected={(word,mean)=>{
                        this.setState({
                            newWordTitle:word,
                            newWordMean:mean,
                            recommendedWords:[],
                        });
                        Keyboard.dismiss();
                    }}
                />
            )
        }

        return (
            <View
                style={styles.container}
            >
                <KeyboardAwareScrollView
                    style={styles.container}
                    ref={ref => {this.scroll = ref}}
                    keyboardShouldPersistTaps={'always'}
                    keyboardDismissMode={'on-drag'}
                >
                    <View style={{height:screen.width/6,justifyContent:'center',flexDirection:'row'}}>
                        <Text style={styles.folderSelectText}>폴더 선택 :</Text>
                        <TouchableOpacity
                            style={styles.folderSelectBox}
                            onPress={()=>{this.openWordbookSelectPopup()}}
                        >
                            <Text style={styles.folderSelectFolderText}>{this.getSelectedWordbookTitle()}</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{height:20}}/>
                    <Text style={styles.plainText}>영어 단어</Text>
                    <View style={{height:20}}/>
                    <View style={styles.wordbookTextInputContainer}>
                        <TextInput
                            ref={comp=>this.wordInput=comp}
                            style={styles.wordbookTextInput}
                            maxLength={25}
                            returnKeyType='done'
                            blurOnSubmit={true}
                            autoCorrect={false}
                            underlineColorAndroid={"#FFFFFF"}
                            value={this.state.newWordTitle}
                            onChangeText={(text)=>{this.onChangeWordTextInput(text)}}/>
                        <View style={{width:screen.width-100,height:2,backgroundColor:'#427677',alignSelf:'center',}}/>
                    </View>

                    {recommendedWords}

                    <View style={{height:screen.width/4,justifyContent:'center'}}>
                        <TouchableOpacity
                            style={styles.swapContainer}
                            activeOpacity={0.8}
                            onPress={()=>{
                                this.onChangeWordTextInput(this.state.newWordMean);
                                this.setState({
                                    newWordMean:this.state.newWordTitle,
                                    newWordTitle:this.state.newWordMean,
                                })
                            }}
                        >
                            <Image
                                style={styles.swapImage}
                                source={require("../res/images/swap.png")}
                                resizeMode={Image.resizeMode.contain}
                            />
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.plainText}>뜻(클릭해 직접 수정하세요)</Text>
                    <View style={{height:20}}/>
                    <View style={styles.wordbookTextInputContainer}>
                        <TextInput
                            ref={comp=>this.meanInput=comp}
                            style={styles.wordbookTextInput}
                            maxLength={50}
                            blurOnSubmit={true}
                            returnKeyType='done'
                            autoCorrect={false}
                            value={this.state.newWordMean}
                            onChangeText={(text)=>{this.setState({newWordMean:text})}}
                            onFocus={(event: Event) => {
                                // `bind` the function if you're using ES6 classes
                                this.scrollToInput(ReactNative.findNodeHandle(event.target))
                            }}
                        />
                        <View style={{width:screen.width-100,height:2,backgroundColor:'#427677',alignSelf:'center',}}/>
                    </View>
                </KeyboardAwareScrollView>
                {/*<TouchableOpacity  style={styles.lowerButton}*/}
                                   {/*onPress={()=>{this.onClickedComplete()}}*/}
                {/*>*/}
                    {/*<Text style={styles.lowerButtonText}>완료</Text>*/}
                {/*</TouchableOpacity>*/}
                <SelectListPopup
                    style={selectStyles.selectWordbookPopup}
                    ref={comp=>this.selectWordbookPopup = comp}
                    title={"단어장을 선택해주세요"}
                    data={this.props.dictStore.wordbook}
                    renderItem={(item,index)=>{
                        return(
                            <TouchableOpacity
                                style={selectStyles.itemContainer}
                                onPress={()=>{
                                    this.selectWordbookPopup.close();
                                    this.setState({
                                        wordbookID:item.id,
                                    })
                                }}
                            >
                                <Text style={selectStyles.itemTitle}>{item.title}</Text>
                            </TouchableOpacity>
                        )
                    }}
                />
            </View>
        );
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor:'white',
        // justifyContent:'center'
    },
    folderSelectText:{
        color:"#427677",
        textAlign:'center',
        alignSelf:'center',
        marginRight:20,
    },
    folderSelectBox:{
        alignSelf:'center',
        backgroundColor:"#344768",
        paddingRight:20,
        paddingLeft:20,
        paddingTop:10,
        paddingBottom:10,
        borderRadius:3,
    },
    folderSelectFolderText:{
        color:"white",
        alignSelf:'center',
        textAlign:'center'
    },
    wordbookTextInput:{
        width:screen.width,
        textAlign:'center',
        justifyContent:'center',
        alignSelf:'center',
        fontSize:20,
        marginBottom:5,
        paddingLeft:20,
        paddingRight:20
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
    },
    swapContainer:{
        width:50,
        height:50,
        justifyContent:'center',
        alignItems:'center',
        alignSelf:'center'
    },
    swapImage:{
        width:30,
        height:30,
    }
});

const selectStyles = StyleSheet.create({
    selectWordbookPopup:{
        width:screen.width-50,
        height:300
    },itemContainer:{
        height:50,
        justifyContent:'center',
        alignItems:'center',
    },itemTitle:{
        color:'black',
        alignSelf:'center',
        textAlign:'center',
    }
});