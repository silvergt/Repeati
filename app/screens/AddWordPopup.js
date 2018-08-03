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
} from 'react-native';
import Modal from 'react-native-modalbox'


export default class AddWordPopup extends Component {

    show(){
        this.modal.open();
    }

    render() {

        return (
            <Modal ref={comp => this.modal = comp}
                   style={modalStyles.container}
                   position='center'
                   backdrop={true}
            >

            </Modal>
        );
    }
}


const modalStyles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        padding: 20
    }
});
