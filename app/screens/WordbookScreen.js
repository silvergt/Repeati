
import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    TouchableOpacity,
    Text,
    FlatList,
    Dimensions,
    BackHandler,
    Alert,
    Platform,
    StatusBar,
} from 'react-native';
import Image from 'react-native-fast-image'
import {name as appName} from '../../app.json';
import LowerBar from "../components/LowerBar";
import {inject,observer} from 'mobx-react'
import {clearState, retrieveState, saveState} from "../functions/storage";
import {toJS} from 'mobx'
import AddWordPopup from "../components/AddWordPopup";
import SettingButton from "../components/SettingButton";
import YesNoPopup from "../components/YesNoPopup";
import store from "../stores";
// import RNSplashScreen from 'react-native-splash-screen'

const screen = Dimensions.get("window");

@inject("dictStore")
@observer
export default class WordbookScreen extends Component {
    static RENDERTYPE_WORDBOOK = "RENDERTYPE_WORDBOOK";      //단어장 리스트
    static RENDERTYPE_WORDBOOKMODIFY = "RENDERTYPE_WORDBOOKMODIFY";      //단어장 수정 창
    static MODIFY_NEEDED_MODIFY = "MODIFY_NEEDED_MODIFY";      //변경은 없지만 RENDERTYPE_WORDBOOKMODIFY로 리렌더링이 필요할 때
    static MODIFY_NEEDED_WORDBOOK = "MODIFY_NEEDED_WORDBOOK";      //변경은 없지만 RENDERTYPE_WORDBOOK으로 리렌더링이 필요할 때

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
                    <Image
                        style={{
                            marginLeft:Platform.OS === 'ios' ? 0 : 20,
                            width:60,
                        }}
                        source={require("../res/images/wordlogo.png")}
                        resizeMode={Image.resizeMode.contain}
                    />,
                headerRight:
                    <View style={styles.headerRightContainer}>
                        <TouchableOpacity style={styles.headerImageContainer}
                                          onPress={()=>{
                                              navigation.state.params.holder.addWordPopup.show()
                                          }}
                        >
                            <Image style={styles.headerImage} source={require("../res/images/plus.png")}/>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.headerImageContainer}
                                          onPress={()=>{
                                              navigation.state.params.holder.addWordPopup.close();
                                              switch (navigation.state.params.holder.state.flatListRenderType){
                                                  case WordbookScreen.RENDERTYPE_WORDBOOK:
                                                      navigation.state.params.holder.setRenderMode(WordbookScreen.RENDERTYPE_WORDBOOKMODIFY);
                                                      this.wordbookPageSettings.toggleButton(false);
                                                      break;
                                                  case WordbookScreen.RENDERTYPE_WORDBOOKMODIFY:
                                                      navigation.state.params.holder.setRenderMode(WordbookScreen.RENDERTYPE_WORDBOOK);
                                                      this.wordbookPageSettings.toggleButton(true);
                                                      break;
                                              }
                                          }}
                        >
                            <SettingButton
                                ref={comp => this.wordbookPageSettings = comp}
                                style={styles.headerImage}/>
                        </TouchableOpacity>
                    </View>

            }
        )
    };

    static initialize = true;

    constructor(){
        super();

        this.state={
            upperTitle:"Repeati",
            flatListRenderType: "",
            flatListData: [],
            selectedWordbookID:-1,
        };
    }

    componentDidMount(){
        this.props.navigation.setParams({
            holder:this,
        });

        if (this.state.flatListData.length===0){
            retrieveState().then((dataTemp)=> {
                    console.log('retrieved : ',dataTemp);
                    try {
                        if(dataTemp.dictStore.wordbookID !== undefined) {
                            this.props.dictStore.retrieveFromDatabase(
                                dataTemp.dictStore.wordbookID,
                                dataTemp.dictStore.wordID,
                                dataTemp.dictStore.wordbook
                            );
                        }
                    }catch (e) {console.log("dictStore error : ",e)}
                    try{
                        if(dataTemp.userStore.userSerialNumber !== undefined) {
                            this.props.userStore.retrieveFromDatabase(
                                dataTemp.userStore.userSerialNumber,
                                dataTemp.userStore.userName,
                                dataTemp.userStore.totalSolved,
                                dataTemp.userStore.totalCorrect,
                            );
                        }
                    }catch (e) {{console.log("userStore error : ",e)}}

                    console.log("STATE RETRIEVED");
                    this.setRenderMode(WordbookScreen.RENDERTYPE_WORDBOOK);
                }
            );
        }


        this.setState({
            flatListData: this.props.dictStore.wordbook,
        });

        WordbookScreen.initialize = false;

        // RNSplashScreen.hide();
    }


    //Call whenever renderType has to be changed
    setRenderMode(renderType){
        switch (renderType){
            case WordbookScreen.RENDERTYPE_WORDBOOK:
                this.setState({
                    flatListRenderType: WordbookScreen.RENDERTYPE_WORDBOOK,
                });
                break;
            case WordbookScreen.RENDERTYPE_WORDBOOKMODIFY:
                this.setState({
                    flatListRenderType: WordbookScreen.RENDERTYPE_WORDBOOKMODIFY,
                });
                break;
        }
    }


    setFlatListRenderItem(item,index){
        switch (this.state.flatListRenderType){
            case WordbookScreen.RENDERTYPE_WORDBOOK:
                return(
                    <WordbookView
                        title={item.title}
                        wordLength={item.wordList.length}
                        onPress={()=>{
                            this.props.navigation.navigate('WordPage',{
                                wordbookID:item.id,
                                wordbookTitle:item.title,
                                onGoBack: () => {
                                    this.setState({
                                        flatListRenderType:WordbookScreen.MODIFY_NEEDED_WORDBOOK,
                                    })
                                }
                            });
                        }}
                    />
                );
            case WordbookScreen.RENDERTYPE_WORDBOOKMODIFY:
                return(
                    <WordbookModifyView
                        title={item.title}
                        wordbookID={item.id}
                        onPressModify={()=>{
                            this.props.navigation.navigate('ReviseWordbook', {
                                wordbookID: item.id,
                                onGoBack: () => {
                                    this.setState({
                                        flatListRenderType:WordbookScreen.MODIFY_NEEDED_MODIFY,
                                    })
                                }
                            })
                        }}
                        onPressDelete={()=>{
                            this.setState({
                                selectedWordbookID:item.id,
                            });
                            this.deletePopup.show();
                        }}
                    />
                );
            case WordbookScreen.MODIFY_NEEDED_MODIFY:
                this.setState({
                    flatListRenderType:WordbookScreen.RENDERTYPE_WORDBOOKMODIFY,
                });
                break;
            case WordbookScreen.MODIFY_NEEDED_WORDBOOK:
                this.setState({
                    flatListRenderType:WordbookScreen.RENDERTYPE_WORDBOOK,
                });
                break;
        }
    }


    render() {
        let body = undefined;
        if(this.state.flatListData.length === 0){
            console.log("flatListData is empty! : No wordbook existing");
            body =
                <View style={{flex:1,flexDirection:"column",justifyContent:'center'}}>
                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={ ()=>
                            {
                                this.props.navigation.navigate('AddNewFolder',{
                                    onGoBack:()=>{
                                        this.setState({
                                            flatListRenderType:WordbookScreen.MODIFY_NEEDED_WORDBOOK,
                                        });
                                    }
                                })
                            }
                        }
                    >
                        <Image
                            style={styles.newWordbookImage}
                            source={require("../res/images/plus_thin.png")}
                        />
                        <Text
                            style={styles.newWordbookTitle}
                        >첫번째 단어장 만들기</Text>
                        <Text
                            style={styles.newWordbookText}
                        >위 버튼을 눌러 단어장을 만들어보세요.{"\n"}아주 쉽답니다.</Text>
                    </TouchableOpacity>

                </View>
        }else{
            body =
                <View style={{flex:1,flexDirection:"row"}}>
                    <FlatList
                        ref={comp => this.flatList = comp}
                        style={styles.flatList}
                        data={this.state.flatListData}
                        extraData={this.state.flatListRenderType}
                        renderItem={({item,index})=>{
                            console.log("items",toJS(item));
                            return(this.setFlatListRenderItem(item,index));
                        }}
                        keyExtractor={(item, index) => index.toString()}
                    />

                </View>;
        }


        return (
            <View style={styles.container}>
                <StatusBar
                    backgroundColor="white"
                    barStyle="dark-content"
                />
                {body}
                <LowerBar
                    button1Pressed={()=> {
                        if (this.props.dictStore.wordbook.length > 0) {
                            let index = this.props.dictStore.getAnyWordbookHasWord();
                            if(index !== -1){
                                this.props.navigation.navigate('TestScreen',{
                                    wordbookID:index,
                                })
                            }else{
                                Alert.alert(
                                    "잠깐!",
                                    "먼저 단어장에 단어를 등록해보세요",
                                    [
                                        {text: 'OK', onPress: () => {}},
                                    ]
                                );
                            }
                        }else{
                            Alert.alert(
                                "잠깐!",
                                "먼저 단어장을 만들어보세요",
                                [
                                    {text: '만들러가기', onPress: () => {
                                        this.props.navigation.navigate("AddNewFolder",{
                                            onGoBack:()=>{
                                                this.setState({
                                                    flatListRenderType:WordbookScreen.MODIFY_NEEDED_WORDBOOK,
                                                });
                                            }
                                        });
                                    }},
                                ]
                            );
                        }
                    }}
                    button2Pressed={()=>{
                        this.props.navigation.navigate('InstantSearchScreen',{
                            onGoBack:()=>{
                                if(this.state.flatListRenderType===WordbookScreen.RENDERTYPE_WORDBOOKMODIFY){
                                    this.setState({flatListRenderType:WordbookScreen.MODIFY_NEEDED_MODIFY});
                                }else{
                                    this.setState({flatListRenderType:WordbookScreen.MODIFY_NEEDED_WORDBOOK});
                                }
                            }
                        });
                    }}
                    button3Pressed={()=>{
                        this.props.navigation.navigate('SettingsScreen',{
                            onGoBack:()=>{
                                if(this.state.flatListRenderType===WordbookScreen.RENDERTYPE_WORDBOOKMODIFY){
                                    this.setState({flatListRenderType:WordbookScreen.MODIFY_NEEDED_MODIFY});
                                }else{
                                    this.setState({flatListRenderType:WordbookScreen.MODIFY_NEEDED_WORDBOOK});
                                }
                            }
                        });
                    }}
                />

                <AddWordPopup
                    ref={comp=>this.addWordPopup = comp}
                    style={{width:screen.width,height:150}}
                    onAddNewFolder={()=>{
                        this.props.navigation.navigate('AddNewFolder',{
                            onGoBack:()=>{
                                this.addWordPopup.close();
                                this.setState({
                                    flatListRenderType:WordbookScreen.MODIFY_NEEDED_WORDBOOK,
                                });
                            }
                        })
                    }}
                    onAddNewWord={()=>{
                        if( this.props.dictStore.wordbook.length === 0 ){
                            Alert.alert(
                                "잠깐!",
                                "먼저 단어장을 만들어보세요",
                                [
                                    {text: '만들러가기', onPress: () => {
                                            this.props.navigation.navigate("AddNewFolder",{
                                                onGoBack:()=>{
                                                    this.addWordPopup.close();
                                                    this.setState({
                                                        flatListRenderType:WordbookScreen.MODIFY_NEEDED_WORDBOOK,
                                                    });
                                                }
                                            });
                                        }},
                                ]
                            );
                            return;
                        }
                        this.props.navigation.navigate('AddNewWord',{
                            onGoBack:()=>{
                                this.addWordPopup.close();
                                this.setState({
                                    flatListRenderType:WordbookScreen.MODIFY_NEEDED_WORDBOOK,
                                });
                            }
                        })
                    }}
                />
                <YesNoPopup
                    ref={comp => this.deletePopup = comp}
                    style={{width:250,height:150}}
                    title={"정말 단어장을 삭제하시겠습니까?"}
                    left={"삭제"}
                    right={"취소"}
                    leftClicked={()=>{
                        // this.deletePopup.close();
                        // if(this.props.dictStore.wordbook.length===1){
                        //     Alert.alert(
                        //         '앗!',
                        //         '단어장을 전부 다 지우면 안돼요!',
                        //         [
                        //             {text: 'OK', onPress: () => {this.deletePopup.close()} },
                        //         ]
                        //     );
                        //     return;
                        // }
                        this.props.dictStore.deleteWordbook(this.state.selectedWordbookID);
                        this.setState({
                            flatListRenderType:WordbookScreen.MODIFY_NEEDED_MODIFY,
                            selectedWordbookID:-1,
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
class WordbookView extends Component {
    /**
     * props:
     * title
     * wordLength
     * onPress()
     */

    onPress(){
        if(this.props.onPress !== undefined) {
            this.props.onPress();
        }
    }

    render(){
        return(
            <TouchableOpacity
                onPress={()=>{this.onPress()}}
                activeOpacity={0.8}
            >
                <View style={wordbookViewStyles.container}>
                    <Text style={wordbookViewStyles.wordbookTitle}>{this.props.title}</Text>
                    <View style={{flex:1}}/>
                    <Text style={wordbookViewStyles.wordbookTitle}>단어 수 : {this.props.wordLength}</Text>
                </View>
            </TouchableOpacity>
        );
    }
}

@inject("dictStore")
class WordbookModifyView extends Component {
    /**
     * props:
     * title
     * wordbookID
     * onPressModify()
     * onPressDelete()
     */

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
        return(
            <View style={wordbookViewStyles.container}>
                <Text style={wordbookViewStyles.wordbookTitle}>{this.props.title}</Text>
                <View style={{flex:1}}/>
                <TouchableOpacity
                    style={wordbookViewStyles.wordbookButton}
                    activeOpacity={0.8}
                    onPress={()=>{this.onPressModify()}}>
                    <Text style={wordbookViewStyles.wordbookTitle}>수정</Text>
                </TouchableOpacity>
                <View style={{width:10}}/>
                <TouchableOpacity
                    style={wordbookViewStyles.wordbookButton}
                    activeOpacity={0.8}
                    onPress={()=>{this.onPressDelete()}}>
                    <Text style={wordbookViewStyles.wordbookTitle}>삭제</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor:'#EEEEEE',
    },
    flatList:{
        flex:1,
    },
    newWordbookTitle:{
        alignSelf:'center',
        margin:20,
        fontSize:20,
        color:'black',
        textAlign:'center'
    },
    newWordbookText:{
        alignSelf:'center',
        fontSize:14,
        color:'black',
        textAlign:'center'
    },
    newWordbookImage:{
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

const wordbookViewStyles = StyleSheet.create({
    container: {
        height:50,
        flexDirection: 'row',
        backgroundColor:'#35466A',
        alignItems:'center',
        marginLeft:15,
        marginRight:15,
        marginTop:15,
        paddingLeft:15,
        paddingRight:15,
        borderRadius:5,
    },
    wordbookTitle:{
        textAlign:'center',
        color:'white',
    },
    wordbookButton:{
        width:40,
        justifyContent:'center',
        alignSelf:'stretch',
        color:'white',
    },
});
