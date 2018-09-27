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
    TextInput,
    Dimensions,
    Alert, Animated
} from 'react-native';
import Image from 'react-native-fast-image';
import Swiper from 'react-native-deck-swiper'
import {inject,observer} from 'mobx-react'
import SelectListPopup from "../components/SelectListPopup";

const screen = Dimensions.get('window');

@inject("dictStore")
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
                headerStyle: {
                    backgroundColor: "#fff",
                    borderBottomWidth: 0,
                    elevation:0,
                },
                headerTitle:
                    <Text style={{
                        color:'black',
                    }}>단어 시험</Text>,
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
                        <Text style={{color:'black',}}>점수확인</Text>
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
        this.totalSolved = 0;
        this.totalCorrect = 0;

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

    changeWordbook(wordbookID){
        this.wordbookID = wordbookID;

        this.clearWordList();
        this.addWordListIntoCards();
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
        this.props.navigation.goBack();
        this.props.navigation.navigate("TestScoreScreen",{
            totalSolved : this.totalSolved,
            totalCorrect : this.totalCorrect,
        });
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
                        onTapCard={(index) => {
                            this.lastTappedIndex = index;
                        }}
                        renderCard={(card,index) =>{
                            return(
                                <View>
                                    <View style={{height:100,}}/>
                                    <Card
                                        style={cardStyles.container}
                                        word={card}
                                        testType={this.state.testType}
                                        navigation={this.props.navigation}
                                        onClicked={()=>{
                                            this.lastTappedIndex = index;
                                        }}
                                    />
                                </View>
                            )
                        }}
                        onSwipedLeft={(index)=>{
                            if(index !== this.lastTappedIndex){
                                Alert.alert("모르는 단어는\n뜻을 알고 가는게 좋아요!");
                            }
                            this.props.dictStore.setWordSolvedCount(this.wordbookID,this.cardList[index].id,false);
                            this.totalSolved += 1;

                            if(this.cardList.length - index < 3){
                                this.addWordListIntoCards();
                            }
                        }}
                        onSwipedRight={(index)=>{
                            this.props.dictStore.setWordSolvedCount(this.wordbookID,this.cardList[index].id,true);
                            this.totalSolved += 1;
                            this.totalCorrect += 1;

                            if(this.cardList.length - index < 3){
                                this.addWordListIntoCards();
                            }
                        }}
                    />
                    <View style={styles.upperOptionContainer}>
                        <View style={{justifyContent:'center',flexDirection:'row'}}>
                            <Text style={styles.folderSelectText}>단어장 선택 :</Text>
                            <TouchableOpacity
                                style={styles.folderSelectBox}
                                activeOpacity={0.8}
                                onPress={()=>{this.openWordbookSelectPopup()}}
                            >
                                <Text style={styles.folderSelectFolderText}>{this.getSelectedWordbookTitle()}</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{height:15}}/>
                        <View style={{justifyContent:'center',flexDirection:'row'}}>
                            <Text style={styles.folderSelectText}>시험 방식 :</Text>
                            <TouchableOpacity
                                style={styles.folderSelectBox}
                                activeOpacity={0.8}
                                onPress={()=>{this.openTestTypeSelectPopup()}}
                            >
                                <Text style={styles.folderSelectFolderText}>{this.state.testType}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={{
                        flexDirection:'row',
                        alignItems:'flex-end',
                        margin:10,
                        position:'absolute',
                        bottom:0
                    }}>
                        <TouchableOpacity
                            style={styles.lowerButton}
                            activeOpacity={0.8}
                            onPress={()=>{
                                this.swiper.swipeLeft();
                            }}
                        >
                            <Text style={[styles.lowerButtonText,{color:'red'}]}>{"<"} 모르는 단어</Text>
                        </TouchableOpacity>
                        <View style={{flex:1}}/>
                        <TouchableOpacity
                            style={styles.lowerButton}
                            activeOpacity={0.8}
                            onPress={()=>{
                                this.swiper.swipeRight();
                            }}
                        >
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
                                activeOpacity={0.8}
                                onPress={()=>{
                                    this.selectWordbookPopup.close();
                                    this.changeWordbook(item.id);
                                    this.setState({});
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
                                activeOpacity={0.8}
                                onPress={()=>{
                                    this.selectTestTypePopup.close();
                                    this.setState({
                                        testType:item,
                                    });
                                    this.clearWordList();
                                    this.addWordListIntoCards();
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
    guide1 = "카드를 터치하면 정답을 알려드려요";
    guide2 = <Text style={{color:'#272727'}}><Text style={{color:'red'}}>모르면 단어</Text>면 왼쪽으로,{"\n"}
        <Text style={{color:'green'}}>아는 단어</Text>면 오른쪽으로 보내주세요!</Text>;
    /**
     * @params;
     * style
     * word
     * testType
     * onClicked()
     */

    constructor(){
        super();

        this.state={
            answerIsVisible : false,
            answerOpacity : new Animated.Value(0),
            guideText : this.guide1,
        }
    }

    showAnswer(){
        Animated.timing(this.state.answerOpacity,{
            toValue:1,
            duration:600
        }).start();
        this.setState({
            answerIsVisible:true,
            guideText : this.guide2,
        });
    }

    render(){
        let hint = this.props.testType === TestScreen.TESTTYPE_ENG_TO_KOR ?
            this.props.word.word : this.props.word.mean;

        let answer = this.props.testType === TestScreen.TESTTYPE_ENG_TO_KOR ?
            this.props.word.mean : this.props.word.word;

        return(
            <View style={this.props.style}>
                <TouchableOpacity
                    style={{flex:1,alignSelf:'stretch',padding:15}}
                    activeOpacity={0.8}
                    onPress={()=>{
                        this.showAnswer();
                        this.props.onClicked();
                    }}
                >
                    <View style={{flex:1}}/>
                    <Text style={cardStyles.hintText}>{hint}</Text>
                    <Animated.Text
                        style={[cardStyles.answerText,{opacity:this.state.answerOpacity}]}
                    >{answer}</Animated.Text>
                    <Animated.View
                        style={[cardStyles.toDaumTouchable,{
                            opacity:this.state.answerOpacity,
                        }]}
                    >
                        <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={()=>{
                                if(this.state.answerIsVisible) {
                                    this.props.navigation.navigate('WebScreen', {
                                        url: "http://alldic.daum.net/search.do?q=" + this.props.word.word
                                    })
                                }else{
                                    this.showAnswer();
                                    this.props.onClicked();
                                }
                            }}
                        >
                            <Animated.Image
                                style={[cardStyles.toDaumImage,]}
                                source={require("../res/images/daumlogo.png")}
                                resizeMode={Image.resizeMode.contain}
                            />
                        </TouchableOpacity>
                    </Animated.View>

                    <Text style={cardStyles.guideText}>{this.state.guideText}</Text>
                </TouchableOpacity>
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
    },
    upperOptionContainer:{
        backgroundColor:'#fff',
        paddingBottom:20,
        borderBottomColor:'#222222',
        borderBottomWidth:0.4,
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
    },
    hintText:{
        textAlign:'center',
        fontSize:24,
        color:'black',
    },
    answerText:{
        flex:1.6,
        marginTop:20,
        textAlign:'center',
        fontSize:18,
        color:'black',
    },
    guideText:{
        alignSelf:'center',
        textAlign:'center',
        fontSize:14,
        position:'absolute',
        bottom:0,
        marginBottom:10,
        color:'black',
    },
    toDaumImage:{
        alignSelf:'center',
        width:40,
        height:40,
    },
    toDaumTouchable:{
        alignSelf:'flex-end',
        justifyContent:'center',
        width:50,
        height:50,
        borderWidth:1,
        borderColor:'#CCCCCC',
        borderRadius:5,
        backgroundColor:'#FAFAFA',
        position:'absolute',
        bottom:50,
        right:20,
    }
});