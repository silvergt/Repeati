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
import {inject,observer} from 'mobx-react'
import RecommendedWord from "../components/RecommendedWord";
import {getMeaning} from "../functions/dictionary";
import SelectListPopup from "../components/SelectListPopup";

const screen = Dimensions.get('window');

@inject("dictStore")
@observer
export default class AddNewWord extends Component {

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
            wordbookID:0,
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
        let goBackListener = this.props.navigation.getParam('onGoBack',-1);
        goBackListener();

        this.props.navigation.goBack();
    }

    openWordbookSelectPopup(){
        this.selectWordbookPopup.show();
    }

    getSelectedWordbookTitle(){
        if(this.state.wordbookID === undefined || this.state.wordbookID === -1){
            return "단어장";
        }else{
            return this.props.dictStore.getWordbookById(this.state.wordbookID).title;
        }

    }

    render() {


        return (
            <View style={styles.container}>
                <View style={styles.container}>
                    <View style={{flex:1,justifyContent:'center',flexDirection:'row'}}>
                        <Text style={styles.folderSelectText}>폴더 선택 :</Text>
                        <TouchableOpacity
                            style={styles.folderSelectBox}
                            onPress={()=>{this.openWordbookSelectPopup()}}
                        >
                            <Text style={styles.folderSelectFolderText}>{this.getSelectedWordbookTitle()}</Text>
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
        justifyContent:'center'
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
        backgroundColor:'#344768',
        height:50,
    },
    lowerButtonText:{
        color:'white',
        alignSelf:'center',
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