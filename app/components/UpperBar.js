
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
     * right1Clicked()
     * right1Res
     * right1Enabled
     * right2Clicked()
     * right2Res
     * right2Enabled
     * backClicked()
     * backEnabled
     */

    constructor(){
        super();

        this.state = {
            title:"",
            backEnabled : false,
            right1Res: require("../res/images/plus.png"),
            right2Res: require("../res/images/plus.png"),
            right1Enabled : true,
            right2Enabled : true,
        }

    }

    componentDidMount(){
        this.setState({
            title:this.props.title,
            rightText:this.props.rightText,
            backEnabled:this.props.backEnabled !== undefined ? this.props.backEnabled:false,
            right1Enabled:this.props.right1Enabled !== undefined ? this.props.right1Enabled:true,
            right2Enabled:this.props.right2Enabled !== undefined ? this.props.right2Enabled:true,
            right1Res:this.props.right1Res !== undefined ? this.props.right1Res : require("../res/images/plus.png"),
            right2Res:this.props.right2Res !== undefined ? this.props.right2Res : require("../res/images/plus.png"),

        })
    }


    onBackClicked(){
        if(this.props.backClicked !== undefined) {
            this.props.backClicked();
        }
    }

    onRight1Clicked(){
        if(this.props.right1Clicked !== undefined) {
            this.props.right1Clicked();
        }
    }

    onRight2Clicked(){
        if(this.props.right1Clicked !== undefined) {
            this.props.right1Clicked();
        }
    }


    setTitle(text){
        this.setState({
            title:text,
        })
    }

    setBackEnabled(enable){
        this.setState({
            backEnabled:enable,
        })
    }


    render() {
        if(this.state.backEnabled === true){
            var backImage = <Image style={styles.back} source={require("../res/images/back.png")}/>;
        }

        if(this.state.right1Enabled === true){
            var right1Image = <Image style={styles.rightImage} source={this.state.right1Res}/>;
        }

        if(this.state.right2Enabled === true){
            var right2Image = <Image style={styles.rightImage} source={this.state.right2Res}/>;
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

                    <View
                        style={styles.rightTextContainer}
                    >
                        <TouchableOpacity
                            style={styles.rightImageContainer}
                            onPress={()=>this.onRight1Clicked()}
                        >
                            {right1Image}
                        </TouchableOpacity>
                        <View style={{flex:1}}/>
                        <TouchableOpacity
                            style={styles.rightImageContainer}
                            onPress={()=>this.onRight2Clicked()}
                        >
                            {right2Image}
                        </TouchableOpacity>
                    </View>

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
        flexDirection:'row',
        height:upperBarHeight,
        width:upperBarHeight*1.4,
        justifyContent:'center',
        right:0,
        alignItems:'center',
        marginRight:15,
    },rightImageContainer:{
        justifyContent:'center',
        height:upperBarHeight,
        width:upperBarHeight-2,
    },
    rightImage:{
        width:upperBarHeight*0.5,
        height:upperBarHeight*0.5,
        alignSelf:'center',
    },
    logoText:{
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
        // backgroundColor:"#A5BAE5"
    }
});
