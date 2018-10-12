
import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity
} from 'react-native';


export default class RecommendedWord extends Component {
    /**
     * props
     * style
     * word
     * mean
     * onSelected(word,mean)
     *
     */

    onSelected(){
        if(this.props.onSelected !== undefined) {
            this.props.onSelected(this.props.word, this.props.mean);
        }
    }

    render() {

        return (
            <TouchableOpacity
                style={[this.props.style,{
                    flexDirection:'row',
                    paddingLeft:25,
                    paddingRight:10,
                    borderRadius:5,
                    borderColor:"#35466A",
                    borderWidth:1,
                }]}
                onPress={()=>{
                    this.onSelected();
                }}
            >
                <Text style={styles.textStyle_word}>{this.props.word}</Text>
                <View style={{width:15}}/>
                <Text style={styles.textStyle_mean}>{this.props.mean}</Text>
            </TouchableOpacity>
        );
    }
}


const styles = StyleSheet.create({
    textStyle_word:{
        textAlign:'center',
        color:"#878787",
        fontSize:15,
        alignSelf:'center',
        fontWeight:'500'
    },
    textStyle_mean:{
        flex:1,
        color:"#53697D",
        fontSize:14,
        alignSelf:'center',
        fontWeight:'200'
    }
});
