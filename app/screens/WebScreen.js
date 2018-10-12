import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    WebView,
    TouchableOpacity,
    Dimensions
} from 'react-native';
import Image from 'react-native-fast-image';

const screen = Dimensions.get('window');

export default class WebScreen extends Component<Props> {

    static navigationOptions= ({navigation}) => {
        return(
            {
                headerStyle: {
                    backgroundColor: "#fff",
                    elevation:0,
                    borderBottomColor:'#CCCCCC',
                    borderBottomWidth:0.5,
                },
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
            }
        )
    };

    render() {
        return (
            <View style={styles.container}>
                <WebView
                    source={{uri: this.props.navigation.state.params.url}}
                    style={{flex:1}}/>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});