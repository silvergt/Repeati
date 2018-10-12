/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Platform,
    Text,
    TouchableOpacity,
    FlatList
} from 'react-native';
import Image from 'react-native-fast-image';
import {toJS} from "mobx/lib/mobx";

export default class UpdateListScreen extends Component {


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
                    }}>업데이트 내역</Text>,
                headerLeft:
                    <TouchableOpacity style={
                        {
                            width:50,
                            height:'100%',
                            justifyContent:'center',
                            alignItems:'center',

                        }
                    }
                                      onPress={()=>{navigation.goBack()}}
                    >
                        <Image style={{width:20,height:20}} source={require("../res/images/back.png")}/>
                    </TouchableOpacity>,

            }
        )
    };

    constructor(){
        super();

        this.flatListData = [];

        this.addNewUpdateInfo(
            "리피티 오픈! (2018/10/15)",
            "리피티는 자신이 원하는 단어를 직접 검색해 등록하여 자신만의 영어 단어장을 만들 수 있는 단어장 어플리케이션입니다!" +
            "\n앞으로 단어장 다운로드 등 여러 기능이 들어갈 예정이니, 직접 만드는 단어장 리피티 많이 사랑해주세요!♥"
        );
    }


    addNewUpdateInfo(title,content){
        this.flatListData.push(new updateData(title,content));
    }

    setFlatListRenderItem(item,index){
        return (
            <UpdateDescription
                style={entityStyles.container}
                title={item.title}
                content={item.content}
            />
        );
    }

    render() {

        return (
            <View style={styles.container}>
                <FlatList
                    ref={comp => this.flatList = comp}
                    style={styles.flatList}
                    data={this.flatListData}
                    renderItem={({item,index})=>{
                        return(this.setFlatListRenderItem(item,index));
                    }}
                    keyExtractor={(item, index) => index.toString()}
                />

            </View>
        );
    }
}

class updateData {
    title;
    content;

    constructor(title,content){
        this.title = title;
        this.content = content;
    }
}

class UpdateDescription extends Component{

    /**
     * @params
     * title
     * content
     *
     */


    render() {

        return (
            <View style={entityStyles.container}>
                <Text
                    style={entityStyles.titleText}
                >{this.props.title}</Text>
                <Text
                    style={entityStyles.contentText}
                >{this.props.content}</Text>
            </View>
        )
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
    },
    flatList:{

    }
});

const entityStyles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        paddingLeft:20,
        paddingRight:10,
        paddingTop:5,
        paddingBottom:10,
        backgroundColor:'white',
        borderBottomColor:"#A4A4A4",
        borderBottomWidth:0.3,
        borderTopColor:"#A4A4A4",
        borderTopWidth:0.3,
        marginTop:15,
    },
    titleText:{
        color:'black',
        fontSize:16,
        fontWeight:'bold',
        marginBottom:5,
    },
    contentText:{
        color:'#555555',
        fontSize:14,
    }
});
