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
    Dimensions,
    Alert
} from 'react-native';
import Swiper from 'react-native-deck-swiper'
import {inject,observer} from 'mobx-react'
import RecommendedWord from "../components/RecommendedWord";
import {getMeaning} from "../functions/dictionary";
import SelectListPopup from "../components/SelectListPopup";

const screen = Dimensions.get('window');

@inject("dictStore")
@observer
export default class TestScreen extends Component {
    static TESTTYPE_ENG_TO_KOR = "영어 보고 뜻 맞추기"; //영어보고 한글맞추기
    static TESTTYPE_KOR_TO_ENG = "뜻 보고 영단어 맞추기"; //한글보고 영어맞추기

    /**
     *
     * @param;
     * navigation
     * wordbookID
     * onGoBack
     *
     */

    static navigationOptions = ({navigation}) =>{
        return(
            {

                headerTitle:
                    <Text>단어 시험</Text>,
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
                        <Text>종료</Text>
                    </TouchableOpacity>

            }
        )
    };

    constructor(){
        super();

        this.state={
            testType:TestScreen.TESTTYPE_ENG_TO_KOR,
        };
        this.wordbookID = 0;
        this.cardList = [];
        this.onClickedComplete = this.onClickedComplete.bind(this);
    }

    componentDidMount(){
        this.props.navigation.setParams({
            holder:this,
        });

        this.wordbookID = this.props.navigation.getParam('wordbookID',0);

        this.addWordListIntoCards();
    }

    clearWordList(){
        this.cardList = [];
    }
    
    addWordListIntoCards(){
        let wordbookTemp = this.props.dictStore.getWordbookById(this.wordbookID);

        const shuffledWordList = this.shuffleLists(wordbookTemp.wordList);

        for(let i=0;i<shuffledWordList.length;i++){
            this.cardList.push(shuffledWordList[i]);
        }

        this.setState({})
    }

    shuffleLists(arr){
        let len = arr.length;
        if(len === 1)return arr;
        let i = len * 10;
        console.log(len);
        while(i > 0)
        {
            let idx1 = Math.floor(Math.random()* len);
            let idx2 = Math.floor(Math.random()* len);
            if(idx1 === idx2) continue;
            let temp = arr[idx1];
            arr[idx1] = arr[idx2];
            arr[idx2] = temp;
            i--;
        }
        return arr;


    }

    onClickedComplete(){
        let goBackListener = this.props.navigation.getParam('onGoBack',-1);
        goBackListener();

        this.props.navigation.goBack();
    }

    openWordbookSelectPopup(){
        this.selectWordbookPopup.show();
    }

    openTestTypeSelectPopup(){
        this.selectTestTypePopup.show();
    }

    getSelectedWordbookTitle(){
        if(this.wordbookID === undefined || this.wordbookID === -1){
            return "단어장";
        }else{
            return this.props.dictStore.getWordbookById(this.wordbookID).title;
        }
    }


    render() {


        return (
            <View style={styles.container}>
                <View style={styles.container}>
                    <Swiper
                        ref={comp => this.swiper = comp}
                        backgroundColor={'transparent'}
                        stackSize={3}
                        cards={this.cardList}
                        disableBottomSwipe={true}
                        disableTopSwipe={true}
                        renderCard={(card) =>{
                            return(
                                <View>
                                    <View style={{height:100,}}/>
                                    <Card style={cardStyles.container}
                                          word={card}
                                          testType={this.state.testType}
                                    />
                                </View>
                            )
                        }}/>
                    <View style={{justifyContent:'center',flexDirection:'row',marginTop:20}}>
                        <Text style={styles.folderSelectText}>단어장 선택 :</Text>
                        <TouchableOpacity
                            style={styles.folderSelectBox}
                            onPress={()=>{this.openWordbookSelectPopup()}}
                        >
                            <Text style={styles.folderSelectFolderText}>{this.getSelectedWordbookTitle()}</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{height:20}}/>
                    <View style={{justifyContent:'center',flexDirection:'row'}}>
                        <Text style={styles.folderSelectText}>시험 방식 :</Text>
                        <TouchableOpacity
                            style={styles.folderSelectBox}
                            onPress={()=>{this.openTestTypeSelectPopup()}}
                        >
                            <Text style={styles.folderSelectFolderText}>{this.state.testType}</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{
                        flexDirection:'row',
                        alignItems:'flex-end',
                        margin:10,
                        position:'absolute',
                        bottom:0
                    }}>
                        <TouchableOpacity style={styles.lowerButton}>
                            <Text style={[styles.lowerButtonText,{color:'red'}]}>{"<"} 모르는 단어</Text>
                        </TouchableOpacity>
                        <View style={{flex:1}}/>
                        <TouchableOpacity style={styles.lowerButton}>
                            <Text style={[styles.lowerButtonText,{color:'green'}]}>아는 단어 {">"}</Text>
                        </TouchableOpacity>
                    </View>



                </View>
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
                                    this.wordbookID = item.id;
                                    this.setState({})
                                }}
                            >
                                <Text style={selectStyles.itemTitle}>{item.title}</Text>
                            </TouchableOpacity>
                        )
                    }}
                />
                <SelectListPopup
                    style={selectStyles.selectTestTypePopup}
                    ref={comp=>this.selectTestTypePopup = comp}
                    title={"시험 방식을 선택해주세요"}
                    data={[TestScreen.TESTTYPE_ENG_TO_KOR,TestScreen.TESTTYPE_KOR_TO_ENG]}
                    renderItem={(item,index)=>{
                        return(
                            <TouchableOpacity
                                style={selectStyles.itemContainer}
                                onPress={()=>{
                                    this.selectTestTypePopup.close();
                                    this.setState({
                                        testType:item,
                                    })
                                }}
                            >
                                <Text style={selectStyles.itemTitle}>{item}</Text>
                            </TouchableOpacity>
                        )
                    }}
                />
            </View>
        );
    }
}

class Card extends Component{
    /**
     * @params;
     * style
     * word
     * testType
     */

    constructor(){
        super();

        this.state={
            answerIsVisible : false,
        }
    }

    render(){
        let hint = this.props.testType === TestScreen.TESTTYPE_ENG_TO_KOR ?
            this.props.word.word : this.props.word.mean;

        return(
            <View style={this.props.style}>
                <Text>{hint}</Text>
                <Text>{this.props.word.mean}</Text>
            </View>
        )
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor:'#EEEEEE',
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
    },
    plainText:{
        color:"#427677",
        fontSize:16,
        alignSelf:'center',
    },
    lowerButton:{
        justifyContent:'center',
        height:80,
    },
    lowerButtonText:{
        color:'black',
        alignSelf:'center',
        fontSize:17,
    }
});

const selectStyles = StyleSheet.create({
    selectWordbookPopup:{
        width:screen.width-50,
        height:300
    },
    itemContainer:{
        height:50,
        justifyContent:'center',
        alignItems:'center',
    },
    itemTitle:{
        color:'black',
        alignSelf:'center',
        textAlign:'center',
    },
    selectTestTypePopup:{
        width:screen.width-50,
        height:200
    },
});

const cardStyles = StyleSheet.create({
    container:{
        width:screen.width-50,
        height:screen.height/2,
        alignSelf:'center',
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:'white',
        borderRadius:10,
        borderWidth:1,
        borderColor:'#427677',
    }
});