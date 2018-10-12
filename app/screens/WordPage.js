
import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    TouchableOpacity,
    Text,
    FlatList,
    Image,
    Animated,
    Platform,
    Dimensions,
    Alert,
} from 'react-native';
import {name as appName} from '../../app.json';
import LowerBar from "../components/LowerBar";
import {inject,observer} from 'mobx-react'
import {clearState, retrieveState, saveState} from "../functions/storage";
import AddWordPopup from "../components/AddWordPopup";
import SettingButton from "../components/SettingButton"
import YesNoPopup from "../components/YesNoPopup";
import {toJS} from 'mobx'
import WordbookScreen from "./WordbookScreen";

const screen = Dimensions.get('window');

@inject("dictStore")
@observer
export default class WordPage extends Component {
    static RENDERTYPE_WORD = "RENDERTYPE_WORD";      //단어 리스트
    static RENDERTYPE_WORDMODIFY = "RENDERTYPE_WORDMODIFY";      //단어 수정 리스트
    static MODIFY_NEEDED_WORD = "MODIFY_NEEDED_WORD";      //변경은 없지만 RENDERTYPE_WORD로 리렌더링이 필요할 때
    static MODIFY_NEEDED_WORDMODIFY = "MODIFY_NEEDED_WORDMODIFY";      //변경은 없지만 MODIFY_NEEDED_WORDMODIFY으로 리렌더링이 필요할 때

    /**
     *
     * @param navigation
     * wordbookTitle
     * wordbookID
     * onGoBack()
     */


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
                    }}>
                        단어장 : {navigation.state.params.wordbookTitle}
                        </Text>,
                headerLeft:
                    <TouchableOpacity
                        style={{
                            width:50,
                            height:'100%',
                            justifyContent:'center',
                            alignItems:'center',
                        }}
                        onPress={()=>{navigation.state.params.holder.onGoBack()}}
                    >
                        <Image style={{width:20,height:20}} source={require("../res/images/back.png")}/>
                    </TouchableOpacity>,
                headerRight:
                    <View style={styles.headerRightContainer}>
                        <TouchableOpacity style={styles.headerImageContainer}
                                          onPress={()=>{
                                              if(navigation.state.params.holder===undefined) {
                                                  return;
                                              }
                                              navigation.state.params.holder.addWordPopup.show()
                                          }}
                        >
                            <Image style={styles.headerImage} source={require("../res/images/plus.png")}/>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.headerImageContainer}
                                          onPress={()=>{
                                              if(navigation.state.params.holder===undefined) {
                                                  return;
                                              }
                                              navigation.state.params.holder.addWordPopup.close();
                                              switch (navigation.state.params.holder.state.flatListRenderType){
                                                  case WordPage.RENDERTYPE_WORD:
                                                      navigation.state.params.holder.setRenderMode(WordPage.RENDERTYPE_WORDMODIFY);
                                                      this.wordPageSettings.toggleButton(false);
                                                      break;
                                                  case WordPage.RENDERTYPE_WORDMODIFY:
                                                      navigation.state.params.holder.setRenderMode(WordPage.RENDERTYPE_WORD);
                                                      this.wordPageSettings.toggleButton(true);
                                                      break;
                                              }
                                          }}
                        >
                            <SettingButton
                                ref={comp => this.wordPageSettings = comp}
                                style={styles.headerImage}/>
                        </TouchableOpacity>
                    </View>


            }
        )
    };

    constructor(){
        super();

        this.state={
            upperTitle:"Repeati",
            flatListRenderType: "",
            flatListData: undefined,
            selectedWordID:-1,

            fadeVal: new Animated.Value(0),
        };

    }

    componentDidMount(){
        this.props.navigation.setParams({
            holder:this,
        });

        this.wordbookID = this.props.navigation.getParam('wordbookID',-1);

        this.setRenderMode(WordPage.RENDERTYPE_WORD);

        this.setState({
            flatListData: this.props.dictStore.wordbook[this.props.dictStore.getWordbookIndexById(this.wordbookID)].wordList,
        });
    }


    //Call whenever renderType has to be changed
    setRenderMode(renderType){
        switch (renderType){
            case WordPage.RENDERTYPE_WORD:
                this.setState({
                    flatListRenderType: WordPage.RENDERTYPE_WORD,
                });
                break;
            case WordPage.RENDERTYPE_WORDMODIFY:
                this.setState({
                    flatListRenderType: WordPage.RENDERTYPE_WORDMODIFY,
                    // flatListData: this.props.dictStore.wordbook[this.props.navigation.getParam('wordbookID',-1)].wordList,
                });
                break;
        }
    }


    setFlatListRenderItem(item,index){
        switch (this.state.flatListRenderType){
            case WordPage.RENDERTYPE_WORD:
                return(
                    <WordView
                        wordbookID={this.props.navigation.getParam('wordbookID',-1)}
                        word={item}
                    />
                );
            case WordPage.RENDERTYPE_WORDMODIFY:
                return(
                    <WordModifyView
                        wordbookID={this.props.navigation.getParam('wordbookID',-1)}
                        word={item}
                        onPressModify={()=>{
                            this.props.navigation.navigate('ReviseWord', {
                                wordbookID: this.props.navigation.getParam('wordbookID',-1),
                                word:toJS(item),
                                onGoBack: () => {
                                    this.setState({
                                        flatListRenderType:WordPage.MODIFY_NEEDED_WORDMODIFY,
                                    })
                                }
                            })
                        }}
                        onPressDelete={()=>{
                            this.setState({
                                selectedWordID:item.id,
                            });
                            this.deletePopup.show();
                        }}
                    />
                );
            case WordPage.MODIFY_NEEDED_WORD:
                this.setState({
                    flatListRenderType:WordPage.RENDERTYPE_WORD,
                });
                break;
            case WordPage.MODIFY_NEEDED_WORDMODIFY:
                this.setState({
                    flatListRenderType:WordPage.RENDERTYPE_WORDMODIFY,
                });
                break;
        }
    }

    onGoBack(){
        let goBackListener = this.props.navigation.getParam('onGoBack',-1);
        goBackListener();

        this.props.navigation.goBack();
    }

    
    render() {
        let body=undefined;
        if(this.state.flatListData === undefined || this.state.flatListData.length === 0){
            console.log("flatListData is empty! : No wordbook existing");
            body =
                <View style={{flex:1,flexDirection:"column",justifyContent:'center'}}>
                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={ ()=>
                        {
                            this.props.navigation.navigate('AddNewWord',{
                                wordbookID:this.props.navigation.getParam('wordbookID',-1),
                                onGoBack:()=>{
                                    this.setState({
                                        flatListRenderType:WordPage.MODIFY_NEEDED_WORD,
                                    });
                                }
                            })
                        }
                        }
                    >
                        <Image
                            style={styles.newWordImage}
                            source={require("../res/images/plus_thin.png")}
                        />
                        <Text
                            style={styles.newWordTitle}
                        >첫번째 단어 등록하기</Text>
                        <Text
                            style={styles.newWordText}
                        >위 버튼을 눌러 단어를 등록해보세요.{"\n"}단어장 만들기랑 똑같아요.</Text>
                    </TouchableOpacity>

                </View>;
        }else{
            body =
                <View style={{flex:1,flexDirection:"row"}}>
                    <FlatList
                        ref={comp => this.flatList = comp}
                        style={styles.flatList}
                        data={this.state.flatListData}
                        extraData={this.state.flatListRenderType}
                        renderItem={({item,index})=>{
                            return(this.setFlatListRenderItem(item,index));
                        }}
                        keyExtractor={(item, index) => index.toString()}
                        ItemSeparatorComponent={()=><View style={{
                            opacity:0.2,
                            marginLeft:15,
                            marginRight:15,
                            height:1,
                            backgroundColor:'#447677'
                        }}/>
                        }
                    />

                </View>;
        }

        return (
            <View style={styles.container}>
                {body}
                <LowerBar
                    btn2Enabled={false}
                    btn3Enabled={false}
                    button1Pressed={()=>{
                        if(this.state.flatListData.length<1){
                            Alert.alert(
                                "이런",
                                "단어장에 단어를 먼저 등록해주세요!",
                                [
                                    {text:'OK', onPress:()=>{}}
                                ]
                            )
                            return;
                        }
                        this.props.navigation.navigate('TestScreen',{
                            wordbookID:this.wordbookID,
                        })
                    }}
                    button2Pressed={()=>{
                        this.props.navigation.navigate('InstantSearchScreen',{
                            onGoBack:()=>{
                                if(this.state.flatListRenderType===WordPage.RENDERTYPE_WORDMODIFY){
                                    this.setState({flatListRenderType:WordPage.MODIFY_NEEDED_WORDMODIFY});
                                }else{
                                    this.setState({flatListRenderType:WordPage.MODIFY_NEEDED_WORD});
                                }
                            }
                        });
                    }}
                />
                <AddWordPopup
                    ref={comp=>this.addWordPopup = comp}
                    onAddNewFolder={()=>{
                        this.props.navigation.navigate('AddNewFolder',{
                            onGoBack:()=>{
                                this.addWordPopup.close();
                            }
                        })
                    }}
                    onAddNewWord={()=>{
                        this.props.navigation.navigate('AddNewWord',{
                            wordbookID:this.props.navigation.getParam('wordbookID',-1),
                            onGoBack:()=>{
                                this.addWordPopup.close();
                                this.setState({
                                    flatListRenderType:WordPage.MODIFY_NEEDED_WORD,
                                });
                            }
                        })
                    }}
                />
                <YesNoPopup
                    ref={comp => this.deletePopup = comp}
                    style={{width:250,height:150}}
                    title={"정말 단어를 삭제하시겠습니까?"}
                    left={"삭제"}
                    right={"취소"}
                    leftClicked={()=>{
                        this.props.dictStore.deleteWord(this.props.navigation.getParam('wordbookID',-1),this.state.selectedWordID);
                        this.setState({
                            flatListRenderType:WordPage.MODIFY_NEEDED_WORDMODIFY,
                            selectedWordID:-1,
                        });
                        this.deletePopup.close();
                    }}
                    rightClicked={()=>{
                        this.deletePopup.close();
                    }}

                />
            </View>
        );
    }
}

@inject("dictStore")
class WordView extends Component {
    /**
     * props:
     * word
     */

    constructor(){
        super();
        this.animating = false;
        this.state={
            important:false,
            // meanOpacity:Platform.OS === 'ios' ? new Animated.Value(0) : 0,
            // imageOpacity:Platform.OS === 'ios' ? new Animated.Value(1) : 1,
            meanOpacity:new Animated.Value(0),
            imageOpacity: new Animated.Value(1),

        }
    }

    componentDidMount(){
        this.setState({
            important:this.props.word.markedImportant,
        })
    }

    markImportant(){
        this.props.dictStore.setWordImportant(this.props.wordbookID,this.props.word.id,!this.state.important);
        this.setState({
            important:!this.state.important,
        })
    }

    onWordViewPressed(){
        this.animateMean();
        // if(Platform.OS === 'ios'){
        //     this.animateMean();
        // }else{
        //     this.showMean();
        // }
    }

    animateMean(){
        if(this.animating){
            return;
        }
        this.animating = true;
        Animated.timing(this.state.meanOpacity,{
            toValue:1,
            duration:1000
        }).start();
        Animated.timing(this.state.imageOpacity,{
            toValue:0,
            duration:1000
        }).start();
        setTimeout(()=>{
            Animated.timing(this.state.meanOpacity,{
                toValue:0,
                duration:1000
            }).start();
            Animated.timing(this.state.imageOpacity,{
                toValue:1,
                duration:1000
            }).start();
            this.animating = false;
        },3000);
    }

    //ONLY FOR ANDROID
    showMean(){
        console.log("TTT");
        this.setState({
            meanOpacity:1,
            imageOpacity:0,
        });
        setTimeout(()=>{
            console.log("MMM");
            this.setState({
                meanOpacity:0,
                imageOpacity:1,
            });
        },3000);
    }


    render(){
        let starSource;
        if(this.state.important){
            starSource = require("../res/images/star_filled.png");
        }else{
            starSource = require("../res/images/star_empty.png");
        }

        let circleSource;
        const correctRatio = this.props.word.totalCorrect/this.props.word.totalSolved;
        if(this.props.word.totalSolved <= 3){
            circleSource = require("../res/images/new.png");
        }else if(correctRatio>=0.8){
            circleSource = require("../res/images/circle_green.png");
        }else if(correctRatio<=0.3){
            circleSource = require("../res/images/circle_red.png");
        }else{
            circleSource = require("../res/images/circle_yellow.png");
        }

        return(
            <View style={[wordViewStyles.container,]}>

                <TouchableOpacity
                    style={wordViewStyles.starContainer}
                    onPress={()=>this.markImportant()}>
                    <Image style={wordViewStyles.starImage} source={starSource}/>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[wordViewStyles.container,{flex:1,flexDirection:'row'}]}
                    onPress={()=>{
                        this.onWordViewPressed();
                    }}
                >
                    <Text style={wordViewStyles.wordTitle}>{this.props.word.word}</Text>

                    <View style={wordViewStyles.rightContent}>
                        <Animated.Image
                            style={{
                                ...wordViewStyles.circleImage,
                                opacity:this.state.imageOpacity,
                            }}
                            source={circleSource}/>
                        <Animated.Text
                            style={{
                                ...wordViewStyles.wordMean,
                                opacity:this.state.meanOpacity,
                            }}
                            multiline={true}
                        >
                            {this.props.word.mean}</Animated.Text>
                    </View>
                </TouchableOpacity>
            </View>
        );
    }
}

@inject("dictStore")
class WordModifyView extends Component {
    /**
     * props:
     * word
     */

    constructor(){
        super();
        this.state={
            important:false,
            meanOpacity:new Animated.Value(0),
            imageOpacity:new Animated.Value(1),

        }
    }

    componentDidMount(){
        this.setState({
            important:this.props.word.markedImportant,
        })
    }

    markImportant(){
        this.props.dictStore.setWordImportant(this.props.wordbookID,this.props.word.id,!this.state.important);
        this.setState({
            important:!this.state.important,
        })
    }

    onPressModify(){
        if(this.props.onPressModify !== undefined) {
            this.props.onPressModify();
        }
    }

    onPressDelete(){
        if(this.props.onPressDelete !== undefined) {
            this.props.onPressDelete();
        }
    }

    render(){
        let starSource;
        if(this.state.important){
            starSource = require("../res/images/star_filled.png");
        }else{
            starSource = require("../res/images/star_empty.png");
        }

        return(
            <View style={[wordViewStyles.container,]}>

                <TouchableOpacity
                    style={wordViewStyles.starContainer}
                    onPress={()=>this.markImportant()}>
                    <Image style={wordViewStyles.starImage} source={starSource}/>
                </TouchableOpacity>

                <View style={[wordViewStyles.container,{flex:1,flexDirection:'row'}]}>
                    <Text style={wordViewStyles.wordTitle}>{this.props.word.word}</Text>

                    <View style={{flex:1}}/>

                    <View style={wordViewStyles.rightModifyContent}>
                        <TouchableOpacity
                            style={wordViewStyles.wordbookModifyButton}
                            activeOpacity={0.8}
                            onPress={()=>{this.onPressModify()}}>
                            <Text style={wordViewStyles.wordbookModifyTitle}>수정</Text>
                        </TouchableOpacity>
                        <View style={{width:10}}/>
                        <TouchableOpacity
                            style={wordViewStyles.wordbookModifyButton}
                            activeOpacity={0.8}
                            onPress={()=>{this.onPressDelete()}}>
                            <Text style={wordViewStyles.wordbookModifyTitle}>삭제</Text>
                        </TouchableOpacity>
                    </View>
                </View>
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
    flatList:{
        flex:1,
    },
    newWordTitle:{
        alignSelf:'center',
        margin:20,
        fontSize:20,
        color:'black',
        textAlign:'center'
    },
    newWordText:{
        alignSelf:'center',
        fontSize:14,
        color:'black',
        textAlign:'center'
    },
    newWordImage:{
        alignSelf:'center',
        width:60,
        height:60,
    },
    headerRightContainer:{
        flexDirection:'row',
        marginRight:5
    },
    headerImageContainer:{
        width:40,
        height:40,
        justifyContent:'center',
        alignItems:'center'
    },
    headerImage:{
        width:20,
        height:20
    },
});

const wordViewStyles = StyleSheet.create({
    container: {
        height:50,
        flexDirection: 'row',
        alignItems:'center',
        marginRight:15,
        marginLeft:15,
    },
    wordTitle:{
        textAlign:'center',
        color:'black',
    },
    wordButton:{
        width:40,
        justifyContent:'center',
        alignSelf:'stretch',
    },
    starContainer: {
        height:50,
        flexDirection: 'row',
        alignItems:'center',
    },
    starImage:{
        width:18,
        height:18,
        alignSelf:'center',
    },
    circleImage:{
        width:18,
        height:18,
        alignSelf:'center',
        position:'absolute',
        right:0,
    },
    wordMean:{
        flex:1,
        textAlign:'right',
        color:'black',
    },
    rightContent:{
        flex:1,
        height:"100%",
        alignItems:'center',
        flexDirection:'row',
        marginLeft:10,
    },
    rightModifyContent:{
        height:"100%",
        alignItems:'center',
        flexDirection:'row',
    },
    wordbookModifyTitle:{
        textAlign:'center',
        color:'black',
    },
    wordbookModifyButton:{
        width:40,
        justifyContent:'center',
        alignSelf:'stretch',
        color:'black',
    },
});
