import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableHighlight } from 'react-native';
import renderIf from '../node_modules/render-if';


const PopUpWindow = class PopUpWindow extends Component {
    render() {
        return (
            <View style={{ flex: 1 }}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>{this.props.title}</Text>
                </View>
                <View style={{ padding: 10}}>
                {this.props.content}

                    {renderIf(this.props.text != null)(
                        <View style={{ padding: 10, justifyContent: 'flex-end' }}>
                            <Text>{this.props.text}</Text>
                            <View style={{ flex: 1, flexDirection: 'row', marginTop: 20 }}>
                                <View style={{ flex: 0.5 }}>
                                    <TouchableHighlight
                                        onPress={this.props.yes}
                                        style={styles.button}>
                                        <Text style={styles.inButton}>Yes</Text>
                                    </TouchableHighlight>
                                </View>
                                <View style={{ flex: 0.5 }}>
                                    <TouchableHighlight
                                        onPress={this.props.no}
                                        style={styles.button}>
                                        <Text style={styles.inButton}>No</Text>
                                    </TouchableHighlight>
                                </View>
                            </View>
                        </View>
                    )}
                </View>

            </View>

        );
    }
}
PopUpWindow.defaultProps = {
    content: null,
    text: null,
    yes: ()=>{
        alert("Yes")
    },
    no: ()=>{
        alert("No")
    }


};

export default PopUpWindow;

const styles = StyleSheet.create({
    header: {
        backgroundColor: 'black',
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        padding: 15,
        justifyContent: 'center',
        alignItems: 'center'
    },
    headerTitle: {
        color: 'white',

    },
    button: {
        backgroundColor: "#b81717",
        padding: 10,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center'
    },
    inButton: {
        color: 'white',
        fontSize: 20,
    }
});
