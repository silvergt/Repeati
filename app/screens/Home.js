
import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    TouchableOpacity,
    Text,
    Platform,
    FlatList,
    Image,
} from 'react-native';
import {name as appName} from '../../app.json';
import UpperBar from "../components/UpperBar"
import LowerBar from "../components/LowerBar";
import {getMeaning} from "../functions/dictionary";
import {inject,observer} from 'mobx-react'
import {clearState, retrieveState, saveState} from "../functions/storage";
import {toJS} from 'mobx'

@inject("dictStore")
@observer
export default class Home extends Component {
    RENDERTYPE_WORDBOOK = "RENDERTYPE_WORDBOOK";      //단어장 리스트
    RENDERTYPE_WORDBOOKMODIFIED = "RENDERTYPE_WORDBOOKMODIFIED";      //단어장 수정 창
    RENDERTYPE_WORD = "RENDERTYPE_WORD";              //단어 관리 창
    RENDERTYPE_WORDMODIFY = "RENDERTYPE_WORDMODIFY";  //단어 수정 창

    constructor(){
        super();

        this.state={
            flatListRenderType: "",
            flatListData: undefined,
            viewingWordbookID:-1,
        };

    }

    componentDidMount(){
        retrieveState().then(
            this.setRenderMode(this.RENDERTYPE_WORDBOOK)
        );

        this.props.dictStore.addNewWordbook("TEST1");
        this.props.dictStore.addNewWordbook("TEST2");
        this.props.dictStore.addNewWordbook("TEST3");
        this.props.dictStore.addNewWord(0,"TEST3","SUPER");
        this.props.dictStore.addNewWord(0,"TEST3","SUPER");
        this.props.dictStore.addNewWord(0,"TEST3","SUPER");
        this.props.dictStore.addNewWord(2,"TEST3","SUPER");
    }


    //Call whenever renderType has to be changed
    setRenderMode(renderType, viewingWordbookID = -1){
        switch (renderType){
            case this.RENDERTYPE_WORDBOOK:
                this.setState({
                    flatListRenderType: this.RENDERTYPE_WORDBOOK,
                    flatListData: this.props.dictStore.wordbook,
                    viewingWordbookID:viewingWordbookID,
                });
                this.upperBar.setTitle(appName);
                this.upperBar.setRightText("관리");
                this.upperBar.setBackEnabled(false);
                break;
            case this.RENDERTYPE_WORDBOOKMODIFIED:
                this.setState({
                    flatListRenderType: this.RENDERTYPE_WORDBOOKMODIFIED,
                    flatListData: this.props.dictStore.wordbook,
                    viewingWordbookID:viewingWordbookID,
                });
                this.upperBar.setTitle(appName);
                this.upperBar.setRightText("완료");
                this.upperBar.setBackEnabled(false);
                break;
            case this.RENDERTYPE_WORD:
                if(viewingWordbookID !== -1) {
                    this.setState({
                        flatListRenderType: this.RENDERTYPE_WORD,
                        flatListData: this.props.dictStore.wordbook[viewingWordbookID].wordList,
                        viewingWordbookID:viewingWordbookID,
                    });
                    this.upperBar.setTitle(this.props.dictStore.wordbook[viewingWordbookID].title);
                    this.upperBar.setRightText("관리");
                    this.upperBar.setBackEnabled(true);
                }
                break;
            case this.RENDERTYPE_WORDMODIFY:
                if(viewingWordbookID !== -1) {
                    this.setState({
                        flatListRenderType: this.RENDERTYPE_WORDMODIFY,
                        flatListData: this.props.dictStore.wordbook[viewingWordbookID].wordList,
                        viewingWordbookID:viewingWordbookID,
                    });
                    this.upperBar.setTitle(this.props.dictStore.wordbook[viewingWordbookID].title);
                    this.upperBar.setRightText("완료");
                    this.upperBar.setBackEnabled(true);
                }
                break;
        }
    }

    setFlatListRenderItem(item,index){
        console.log("item structure : ",toJS(item));
        switch (this.state.flatListRenderType){
            case this.RENDERTYPE_WORDBOOK:
                return(
                    <WordbookView
                        title={item.title}
                        wordLength={item.wordList.length}
                        onPress={()=>{
                            console.log("ID",item.id);
                            this.setRenderMode(this.RENDERTYPE_WORD,item.id);
                        }}
                    />
                );
            case this.RENDERTYPE_WORDBOOKMODIFIED:
                return(
                    <WordbookModifyView
                        title={item.title}
                    />
                );
            case this.RENDERTYPE_WORD:
                break;
            case this.RENDERTYPE_WORDMODIFY:
                break;
        }
        this.setState({})
    }

    upperRightTextClicked(){
        switch (this.state.flatListRenderType){
            case this.RENDERTYPE_WORDBOOK:
                this.setRenderMode(this.RENDERTYPE_WORDBOOKMODIFIED);
                break;
            case this.RENDERTYPE_WORDBOOKMODIFIED:
                this.setRenderMode(this.RENDERTYPE_WORDBOOK);
                break;
            case this.RENDERTYPE_WORD:
                this.setRenderMode(this.RENDERTYPE_WORDMODIFY);
                break;
            case this.RENDERTYPE_WORDMODIFY:
                this.setRenderMode(this.RENDERTYPE_WORD);
                break;
        }

    }

    upperBackClicked(){
        switch (this.state.flatListRenderType){
            case this.RENDERTYPE_WORD:
                this.setRenderMode(this.RENDERTYPE_WORDBOOK);
                break;
            case this.RENDERTYPE_WORDMODIFY:
                this.setRenderMode(this.RENDERTYPE_WORDBOOK);
                break;
        }
    }


    render() {
        return (
            <View style={styles.container}>
                <UpperBar
                    ref={comp => this.upperBar = comp}
                    title={appName}
                    rightText={"관리"}
                    rightTextClicked={()=>{this.upperRightTextClicked()}}
                    backEnabled={false}
                    backClicked={()=>{this.upperBackClicked()}}
                />
                <View style={{flex:1,flexDirection:"row"}}>
                    <FlatList
                        style={styles.flatList}
                        data={this.state.flatListData}
                        extraData={this.state.flatListRenderType}
                        renderItem={({item,index})=>{
                            return(this.setFlatListRenderItem(item,index));
                        }}
                    />
                    <TouchableOpacity style={styles.addButton}>
                        <Image
                            style={{width:"100%",height:"100%"}}
                            source={require("../res/images/plusbutton.png")}
                        />
                    </TouchableOpacity>

                </View>
                <LowerBar/>
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
    render(){
        return(
            <TouchableOpacity
                onPress={()=>{this.props.onPress()}}
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
     * onPressModify()
     * onPressDelete()
     */
    render(){
        return(
            <View style={wordbookViewStyles.container}>
                <Text style={wordbookViewStyles.wordbookTitle}>{this.props.title}</Text>
                <View style={{flex:1}}/>
                <TouchableOpacity
                    style={wordbookViewStyles.wordbookButton}
                    activeOpacity={0.8}
                    onPress={()=>{this.props.onPressModify()}}>
                    <Text style={wordbookViewStyles.wordbookTitle}>수정</Text>
                </TouchableOpacity>
                <View style={{width:10}}/>
                <TouchableOpacity
                    style={wordbookViewStyles.wordbookButton}
                    activeOpacity={0.8}
                    onPress={()=>{this.props.onPressDelete()}}>
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
        paddingTop: Platform.OS === 'ios' ? 20 : 0
    },
    flatList:{
        flex:1,
    },addButton:{
        position:"absolute",
        width:60,
        height:60,
        alignSelf:'flex-end',
        right:10,
        bottom:10,
    }
});

const wordbookViewStyles = StyleSheet.create({
    container: {
        height:50,
        flexDirection: 'row',
        backgroundColor:'#02225E',
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
