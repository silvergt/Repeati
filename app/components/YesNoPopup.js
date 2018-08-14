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
} from 'react-native';
import Modal from 'react-native-modalbox'


export default class YesNoPopup extends Component {
    /**
     * props:
     *
     * style
     * title
     * left
     * right
     * leftClicked
     * rightClicked
     *
     */


    show(){
        this.modal.open();
    }

    close(){
        this.modal.close();
    }


    render() {

        return (
            <Modal
                ref={comp => this.modal = comp}
                style={[this.props.style,styles.basicStyle]}
                backdrop={true}
                backButtonClose={true}
                position={"center"}
                coverScreen={true}
                entry='top'
            >
                <View style={[styles.deletePopupContainer,]}>
                    <View style={{flex:1}}/>
                    <Text style={styles.deletePopupText}>{this.props.title}</Text>
                    <View style={{flex:1}}/>
                    <View style={{height:40,flexDirection:'row'}}>
                        <TouchableOpacity style={[styles.deletePopupButton,{
                            // borderTopLeftRadius:10,
                            borderBottomLeftRadius:5,
                            backgroundColor:'#35466A',
                        }]}
                                          onPress={()=>{
                                              if(this.props.leftClicked === undefined){
                                                  this.close();
                                              }else {
                                                  this.props.leftClicked();
                                              }
                                          }}
                        >
                            <Text style={styles.deletePopupButtonText}>{this.props.left}</Text>
                        </TouchableOpacity>
                        <View style={{width:1}}/>
                        <TouchableOpacity style={[styles.deletePopupButton,{
                            // borderTopRightRadius:10,
                            borderBottomRightRadius:5,
                            backgroundColor:'#35466A',
                        }]}
                                          onPress={()=>{
                                              if(this.props.rightClicked === undefined){
                                                  this.close();
                                              }else {
                                                  this.props.rightClicked();
                                              }
                                          }}
                        >
                            <Text style={styles.deletePopupButtonText}>{this.props.right}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        );
    }
}


const styles = StyleSheet.create({
    basicStyle:{
        borderBottomRightRadius:5,
        borderBottomLeftRadius:5,
    },
    deletePopupContainer:{
        flex:1,
        justifyContent:'center',
        alignItems:'center',
    },
    deletePopupText:{
        justifyContent:'center',
        textAlign:'center',
        color:'black'
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
