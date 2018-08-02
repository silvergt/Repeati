
import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Platform,
    Dimensions,
    Text,
    TouchableOpacity,
    Image,
} from 'react-native';

export default class UpperBar extends Component {
    /**props
     * title
     * rightTextClicked()
     * rightText
     * backClicked()
     * backEnabled
     */

    constructor(){
        super();

        this.state = {
            title:"",
            rightText : "",
            backEnabled : false,
        }

    }

    componentDidMount(){
        this.setState({
            title:this.props.title,
            rightText:this.props.rightText,
            backEnabled:this.props.backEnabled,
        })
    }


    onBackClicked(){
        if(this.props.backClicked !== undefined) {
            this.props.backClicked();
        }
    }

    onRightTextClicked(){
        if(this.props.rightTextClicked !== undefined) {
            this.props.rightTextClicked();
        }
    }


    setTitle(text){
        this.setState({
            title:text,
        })
    }

    setRightText(text){
        this.setState({
            rightText:text,
        })
    }

    setBackEnabled(enable){
        this.setState({
            backEnabled:enable,
        })
    }


    render() {
        if(this.state.backEnabled === undefined || this.state.backEnabled === true){
            var backImage = <Image style={styles.back}
                                   source={require("../res/images/back.png")}/>;
        }

        return (
            <View style={{flexDirection:"column"}}>
                <View style={styles.container}>
                    <TouchableOpacity
                        style={styles.backContainer}
                        onPress={()=>this.onBackClicked()}>
                        {backImage}
                    </TouchableOpacity>

                    <Text style={styles.logoText}>{this.state.title}</Text>

                    <TouchableOpacity
                        style={styles.rightTextContainer}
                        onPress={()=>this.onRightTextClicked()}>
                        <Text style={styles.rightText}>{this.state.rightText}</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.shadow}/>
            </View>
        );
    }
}


const screen = Dimensions.get("window");
const upperBarHeight = Platform.OS === 'ios' ? 40 : 45;
const styles = StyleSheet.create({
    container: {
        width:screen.width,
        height:upperBarHeight,
        flexDirection: 'row',
        alignItems:'center',
        justifyContent:"center",
    },rightTextContainer:{
        position:"absolute",
        height:upperBarHeight,
        width:upperBarHeight+10,
        justifyContent:'center',
        right:6,
    },rightText:{
        textAlign:"center",
        fontSize:15,
        color:"#3D485E",
    },logoText:{
        flex:1,
        textAlign:"center",
        alignSelf:'center',
        position:'absolute',
        color:'black'
    },back:{
        position:'absolute',
        height:upperBarHeight/2,
        width:upperBarHeight/2,
        left:5,
    },backContainer:{
        position:'absolute',
        height:upperBarHeight,
        width:upperBarHeight+10,
        justifyContent:'center',
        left:5,
    },
    shadow:{
        height:1,
        backgroundColor:"#A5BAE5"
    }
});
