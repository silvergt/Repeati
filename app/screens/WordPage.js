
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
export default class WordPage extends Component {
    static RENDERTYPE_WORD = "RENDERTYPE_WORD";      //단어장 리스트
    static RENDERTYPE_WORDMODIFY = "RENDERTYPE_WORDMODIFY";      //단어장 수정 창
    static MODIFY_NEEDED_MODIFY = "MODIFY_NEEDED_MODIFY";      //변경은 없지만 RENDERTYPE_WORDMODIFY로 리렌더링이 필요할 때
    static MODIFY_NEEDED_WORD = "MODIFY_NEEDED_WORD";      //변경은 없지만 RENDERTYPE_WORD으로 리렌더링이 필요할 때

    static navigationOptions =({navigation}) =>{
        return(
            {
                headerTitle:
                    <Text>{appName}</Text>,
                headerLeft:
                    <TouchableOpacity style={
                        {
                            width:50,
                            height:'100%',
                            justifyContent:'center',
                            alignItems:'center',

                        }
                    }
                                      onPress={()=>{navigation.state.params.holder.onGoBack()}}
                    >
                        <Image style={{width:20,height:20}} source={require("../res/images/back.png")}/>
                    </TouchableOpacity>,
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
                                                  case WordPage.RENDERTYPE_WORD:
                                                      navigation.state.params.holder.setRenderMode(WordPage.RENDERTYPE_WORDMODIFY);
                                                      this.settings.toggleButton(false);
                                                      break;
                                                  case WordPage.RENDERTYPE_WORDMODIFY:
                                                      navigation.state.params.holder.setRenderMode(WordPage.RENDERTYPE_WORD);
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
            selectedWordID:-1,
        };

    }

    componentDidMount(){
        this.props.navigation.setParams({
            holder:this,
        });

        this.setRenderMode(WordPage.RENDERTYPE_WORD);

    }


    //Call whenever renderType has to be changed
    setRenderMode(renderType){
        console.log("TRY",this.props.dictStore.getWordbookById(this.props.navigation.getParam('wordbookID',-1)).wordList);
        switch (renderType){
            case WordPage.RENDERTYPE_WORD:
                this.setState({
                    flatListRenderType: WordPage.RENDERTYPE_WORD,
                    flatListData: this.props.dictStore.getWordbookById(this.props.navigation.getParam('wordbookID',-1)).wordList,
                });
                break;
            case WordPage.RENDERTYPE_WORDMODIFY:
                this.setState({
                    flatListRenderType: WordPage.RENDERTYPE_WORDMODIFY,
                    flatListData: this.props.dictStore.getWordbookById(this.props.navigation.getParam('wordbookID',-1)).wordList,
                });
                break;
        }
    }


    setFlatListRenderItem(item,index){
        switch (this.state.flatListRenderType){
            case WordPage.RENDERTYPE_WORD:
                return(
                    <WordView
                        word={item}
                        onPress={()=>{
                            
                        }}
                    />
                );
            case WordPage.RENDERTYPE_WORDMODIFY:
                return(
                    <WordModifyView
                        word={item}
                        onPressModify={()=>{
                            this.props.navigation.navigate('ReviseWord', {
                                wordID: item.id,
                                onGoBack: () => {
                                    this.setState({
                                        flatListRenderType:WordPage.MODIFY_NEEDED_MODIFY,
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
            case WordPage.MODIFY_NEEDED_MODIFY:
                this.setState({
                    flatListRenderType:WordPage.RENDERTYPE_WORDMODIFY,
                });
                break;
            case WordPage.MODIFY_NEEDED_WORD:
                this.setState({
                    flatListRenderType:WordPage.RENDERTYPE_WORD,
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
                    wordbookID={this.props.navigation.getParam('wordbookID',-1)}
                />
                <PopupDialog
                    width={250}
                    height={150}
                    ref={comp => this.deletePopup = comp}>
                    <View style={styles.deletePopupContainer}>
                        <View style={{flex:1}}/>
                        <Text style={styles.deletePopupText}>정말 선택한 단어들 삭제할거에요?</Text>
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
                                                      flatListRenderType:WordPage.MODIFY_NEEDED_MODIFY,
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


class WordView extends Component {
    /**
     * props:
     * word
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
                <View style={wordViewStyles.container}>
                    <Text style={wordViewStyles.wordTitle}>{this.props.word.word}</Text>
                    <View style={{flex:1}}/>
                    <Text style={wordViewStyles.wordTitle}>{this.props.word.mean}</Text>
                </View>
            </TouchableOpacity>
        );
    }
}

class WordModifyView extends Component {
    /**
     * props:
     * word
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
            <View style={wordViewStyles.container}>
                <Text style={wordViewStyles.wordTitle}>{this.props.title}</Text>
                <View style={{flex:1}}/>
                <TouchableOpacity
                    style={wordViewStyles.wordButton}
                    activeOpacity={0.8}
                    onPress={()=>{this.onPressModify()}}>
                    <Text style={wordViewStyles.wordTitle}>수정</Text>
                </TouchableOpacity>
                <View style={{width:10}}/>
                <TouchableOpacity
                    style={wordViewStyles.wordButton}
                    activeOpacity={0.8}
                    onPress={()=>{this.onPressDelete()}}>
                    <Text style={wordViewStyles.wordTitle}>삭제</Text>
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

const wordViewStyles = StyleSheet.create({
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
    wordTitle:{
        textAlign:'center',
        color:'white',
    },
    wordButton:{
        width:40,
        justifyContent:'center',
        alignSelf:'stretch',
        color:'white',
    },
});
