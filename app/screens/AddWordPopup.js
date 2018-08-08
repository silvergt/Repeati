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
    Dimensions,
    Image,
    Text,
    TouchableOpacity
} from 'react-native';
import Modal from 'react-native-modalbox'


export default class AddWordPopup extends Component {

    show(){
        this.modal.open();
    }
    close(){
        this.modal.close();
    }

    addNewFolderScreen(){

    }

    addNewWordScreen(){

    }

    render() {

        return (
            <Modal
                ref={comp => this.modal = comp}
                animationType={"fade"}
                style={styles.container}
                position='top'
                backdrop={true}
            >
                <TouchableOpacity style={[styles.buttonContainer,{paddingLeft:20}]}
                                  activeOpacity={0.5}
                                  onPress={()=>{this.addNewFolderScreen()}}>
                    <Image style={styles.buttonImage} source={require("../res/images/folder.png")}/>
                    <View style={styles.buttonPadding}/>
                    <Text style={styles.buttonText}>폴더 추가</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.buttonContainer,{paddingRight:20}]}
                                  activeOpacity={0.5}
                                  onPress={()=>{this.addNewWordScreen()}}>
                    <Image style={styles.buttonImage} source={require("../res/images/word.png")}/>
                    <View style={styles.buttonPadding}/>
                    <Text style={styles.buttonText}>단어 추가</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.closeButton}
                                  onPress={()=>{this.close()}}>
                    <Image style={styles.closeButtonImage} source={require("../res/images/close.png")}/>
                </TouchableOpacity>

            </Modal>
        );
    }
}

const screen = Dimensions.get("window");
const popupHeight = 120;
const styles = StyleSheet.create({
    container: {
        width:screen.width,
        height:popupHeight,
        flexDirection: 'row',
    },
    buttonContainer:{
        flex:1,
        flexDirection:'column',
        justifyContent:'center',
        alignItems:'center',
    },
    buttonImage:{
        width:40,
        height:40,
    },
    buttonPadding:{
        height:20,
    },
    buttonText:{
    },
    closeButton:{
        position:'absolute',
        flexDirection:'row',
        width:40,
        height:40,
        right:0,
        justifyContent:'center',
    },
    closeButtonImage:{
        alignSelf:'center',
        width:20,
        height:20,
    }
});
