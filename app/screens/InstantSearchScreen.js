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
import {inject} from 'mobx-react'
import RecommendedWord from "../components/RecommendedWord";
import {getMeaning} from "../functions/dictionary";
import SelectListPopup from "../components/SelectListPopup";

const screen = Dimensions.get('window');

@inject("dictStore")
export default class InstantSearchScreen extends Component {

    static navigationOptions= ({navigation}) => {
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
                    }}>
                        빠른 검색
                    </Text>,
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
                            height:"100%",
                            justifyContent:'center',
                            alignItems:'center',
                            marginRight:10,
                        }}
                        onPress={()=>{navigation.state.params.holder.openWordbookSelectPopup()}}>
                        <Text style={{color:'black'}}>단어 추가</Text>
                    </TouchableOpacity>

            }
        )
    };

    constructor(){
        super();
        this.state={
            newWordTitle:"",
            newWordMean:"",

            recommendedWords:[],
        };
        this.onClickAddWord = this.onClickAddWord.bind(this);
    }

    componentDidMount(){
        this.props.navigation.setParams({
            holder:this,
        });

    }

    clearText(){
        this.setState({
            newWordTitle:"",
            newWordMean:"",
        })
    }


    onClickAddWord(selectedWordbookID){
        if(this.state.newWordTitle === "" || this.state.newWordMean === ""){
            Alert.alert(
                '앗!',
                '영어단어와 뜻을 모두 입력해주세요!',
                [
                    {text: 'OK', onPress: () => {this.selectWordbookPopup.close()} },
                ]
            );
            return;
        }

        this.props.dictStore.addNewWord(selectedWordbookID,this.state.newWordTitle,this.state.newWordMean);
        this.clearText();

        let goBackListener = this.props.navigation.getParam('onGoBack',-1);
        goBackListener();

        Alert.alert(
            '성공!',
            '단어 '+this.state.newWordTitle+' 를 추가했어요!',
            [
                {text: 'OK', onPress: () => {this.selectWordbookPopup.close()} },
            ]
        );
        // this.props.navigation.goBack();

    }

    onChangeWordTextInput(text){
        this.setState({
            newWordTitle: text
        });

        getMeaning(text).then((wordListTemp)=>{
            let recommendedWordTemp = [];
            const maxLength = wordListTemp.length < 3 ? wordListTemp.length : 3;
            for(let i=0;i<maxLength;i++){
                recommendedWordTemp.push(wordListTemp[i]);
            }
            this.setState({
                recommendedWords: recommendedWordTemp,
            })
        });
    }

    openWordbookSelectPopup(){
        this.selectWordbookPopup.show();
    }

    scrollToInput (reactNode: any) {
        this.scroll.scrollToFocusedInput(reactNode)
    }

    render() {

        let recommendedWords=[];
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
                style={[styles.container,{justifyContent:'center',}]}
            >
                <KeyboardAwareScrollView
                    style={styles.container}
                    ref={ref => {this.scroll = ref}}
                    keyboardShouldPersistTaps={'always'}
                    keyboardDismissMode={'on-drag'}
                >
                    <View
                        style={{height:60}}
                    />
                    <Text style={styles.plainText}>영어 단어</Text>
                    <View style={{height:20}}/>
                    <View style={styles.TextInputContainer}>
                        <TextInput
                            ref={comp=>this.wordTextInput=comp}
                            style={styles.TextInput}
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
                    <View style={styles.TextInputContainer}>
                        <TextInput
                            style={styles.TextInput}
                            ref={comp=>this.meanTextInput=comp}
                            maxLength={50}
                            blurOnSubmit={true}
                            multiline={true}
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
                    <View style={{height:50}}/>
                </KeyboardAwareScrollView>

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
                                    this.onClickAddWord(item.id);
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
    TextInput:{
        width:screen.width,
        textAlign:'center',
        justifyContent:'center',
        alignSelf:'center',
        fontSize:18,
        paddingLeft:20,
        paddingRight:20,
    },
    plainText:{
        color:"#427677",
        fontSize:16,
        alignSelf:'center',
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
    },addToWordbookContainer:{
        justifyContent:'center',
        alignSelf:'stretch',
        alignItems:'center',
        backgroundColor:"#344768",
        height:60,
    },
    addToWordbookText:{
        color:'white',
        fontSize:17,
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

