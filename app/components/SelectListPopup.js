/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    FlatList,
    Text
} from 'react-native';
import Modal from 'react-native-modalbox'

export default class SelectListPopup extends Component {
    /**
     * @props
     * style
     * title
     * data
     * renderItem(item,index)
     */

    show(){
        this.modal.open();
    }
    close(){
        this.modal.close();
    }

    setFlatListRenderItem(item,index){
        return this.props.renderItem(item,index);
    }

    render() {

        return (
            <Modal
                ref={comp => this.modal = comp}
                animationType={"fade"}
                style={[styles.container,this.props.style]}
                position='center'
                backdrop={true}
                backButtonClose={true}
                swipeToClose={false}
                coverScreen={true}
            >
                <View style={styles.titleTextContainer}>
                    <Text style={styles.titleText}>{this.props.title}</Text>
                </View>
                <FlatList
                    ref={comp => this.flatList = comp}
                    style={styles.flatList}
                    data={this.props.data}
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

            </Modal>
        );
    }
}


const styles = StyleSheet.create({
    container: {
        borderRadius:10,
    },
    flatList:{
        flex:1,
        marginTop:20,
        marginBottom:20,
    },
    titleTextContainer:{
        height:50,
        justifyContent:'center',
        backgroundColor:'#344768',
        borderTopLeftRadius:10,
        borderTopRightRadius:10,
    },
    titleText:{
        justifyContent: 'center',
        alignSelf:'center',
        textAlign:'center',
        color:'white',
        fontSize:16,
    }
});
