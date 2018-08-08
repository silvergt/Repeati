
import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    TouchableOpacity,
    Text,
    Platform,
    FlatList,
    Image,
    Dimensions
} from 'react-native';
import PopupDialog from 'react-native-popup-dialog';
import {name as appName} from '../../app.json';
import LowerBar from "../components/LowerBar";
import UpperBar from "../components/UpperBar";
import {getMeaning} from "../functions/dictionary";
import {inject,observer} from 'mobx-react'
import {clearState, retrieveState, saveState} from "../functions/storage";
import {toJS} from 'mobx'
import AddWordPopup from "./AddWordPopup";
import SettingButton from "../components/SettingButton";

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
                headerTitle:
                    <Text>{appName}</Text>,
                headerRight:
                    <View style={styles.headerRightContainer}>
                        <TouchableOpacity style={styles.headerImageContainer}
                                          onPress={()=>{
                                              console.log("WW",navigation.state.params.holder.props.dictStore.wordbook[0].title);
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
                                                      this.settings.toggleButton(false);
                                                      break;
                                                  case WordbookScreen.RENDERTYPE_WORDBOOKMODIFY:
                                                      navigation.state.params.holder.setRenderMode(WordbookScreen.RENDERTYPE_WORDBOOK);
                                                      this.settings.toggleButton(true);
                                                      break;
                                              }
                                          }}
                        >
                            <SettingButton
                                ref={comp => this.settings = comp}
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
            selectedWordbookID:-1,
        };

    }

    componentDidMount(){
        this.props.navigation.setParams({
            holder:this,
        });

        retrieveState().then(
            this.setRenderMode(WordbookScreen.RENDERTYPE_WORDBOOK)
        );

        this.props.dictStore.addNewWordbook("TEST1");
        this.props.dictStore.addNewWordbook("TEST2");
        this.props.dictStore.addNewWordbook("TEST3");
        this.props.dictStore.addNewWordbook("TEST1");
        this.props.dictStore.addNewWordbook("TEST2");
        this.props.dictStore.addNewWordbook("TEST3");
        this.props.dictStore.addNewWordbook("TEST1");
        this.props.dictStore.addNewWordbook("TEST2");
        this.props.dictStore.addNewWordbook("TEST3");
        this.props.dictStore.addNewWordbook("TEST1");
        this.props.dictStore.addNewWordbook("TEST2");
        this.props.dictStore.addNewWordbook("TEST3");
        this.props.dictStore.addNewWordbook("TEST1");
        this.props.dictStore.addNewWordbook("TEST2");
        this.props.dictStore.addNewWordbook("TEST3");
        this.props.dictStore.addNewWord(0,"TEST31","SUPER");
        this.props.dictStore.wordbook[0].wordList[0].totalSolved=81;
        this.props.dictStore.wordbook[0].wordList[0].totalCorrect=31;
        this.props.dictStore.addNewWord(0,"TEST32","SUPER");
        this.props.dictStore.wordbook[0].wordList[1].totalSolved=52;
        this.props.dictStore.wordbook[0].wordList[1].totalCorrect=9;
        this.props.dictStore.addNewWord(0,"TEST33","SUPER");
        this.props.dictStore.addNewWord(2,"TEST34","SUPER");
    }


    //Call whenever renderType has to be changed
    setRenderMode(renderType){
        switch (renderType){
            case WordbookScreen.RENDERTYPE_WORDBOOK:
                this.setState({
                    flatListRenderType: WordbookScreen.RENDERTYPE_WORDBOOK,
                    flatListData: this.props.dictStore.wordbook,
                });
                break;
            case WordbookScreen.RENDERTYPE_WORDBOOKMODIFY:
                this.setState({
                    flatListRenderType: WordbookScreen.RENDERTYPE_WORDBOOKMODIFY,
                    flatListData: this.props.dictStore.wordbook,
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
        return (
            <View style={styles.container}>
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
                    />

                </View>
                <LowerBar/>
                <AddWordPopup
                    ref={comp => this.addWordPopup = comp}
                />
                <PopupDialog
                    width={250}
                    height={150}
                    ref={comp => this.deletePopup = comp}>
                    <View style={styles.deletePopupContainer}>
                        <View style={{flex:1}}/>
                        <Text style={styles.deletePopupText}>정말 단어장을 삭제할거에요?</Text>
                        <View style={{flex:1}}/>
                        <View style={{height:40,flexDirection:'row'}}>
                            <TouchableOpacity style={[styles.deletePopupButton,{
                                // borderTopLeftRadius:10,
                                borderBottomLeftRadius:5,
                                backgroundColor:'#35466A',
                            }]}
                                              onPress={()=>{
                                                  this.props.dictStore.deleteWordbook(this.state.selectedWordbookID);
                                                  this.setState({
                                                      flatListRenderType:WordbookScreen.MODIFY_NEEDED_MODIFY,
                                                      selectedWordbookID:-1,
                                                  });
                                                  this.deletePopup.dismiss();
                                              }}
                            >
                                <Text style={styles.deletePopupButtonText}>삭제</Text>
                            </TouchableOpacity>
                            <View style={{width:1}}/>
                            <TouchableOpacity style={[styles.deletePopupButton,{
                                // borderTopRightRadius:10,
                                borderBottomRightRadius:5,
                                backgroundColor:'#35466A',
                            }]}
                                              onPress={()=>{this.deletePopup.dismiss()}}
                            >
                                <Text style={styles.deletePopupButtonText}>취소</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </PopupDialog>
            </View>
        );
    }
}


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
        backgroundColor:'white',
    },
    flatList:{
        flex:1,
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


    deletePopupContainer:{
        flex:1,
        justifyContent:'center',
        alignItems:'center',
    },
    deletePopupText:{
        justifyContent:'center',
        textAlign:'center',
    },
    deletePopupButton:{
        flex:1,
        justifyContent:'center',
        alignItems:'center',
    },
    deletePopupButtonText:{
        textAlign:'center',
        color:'white'
    }
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
