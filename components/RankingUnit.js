import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, TouchableHighlight, Animated, Dimensions } from 'react-native';
//https://moduscreate.com/blog/expanding-and-collapsing-elements-using-animations-in-react-native/

const SCREEN_WIDTH = Dimensions.get("window").width;


class RankingUnit extends Component {
    constructor(props) {
        super(props);

        this.icons = {
            'up': require('../imgs/arrow_up.png'),
            'down': require('../imgs/arrow_down.png')
        };

        this.state = {
            expanded: true,
            animation: new Animated.Value()
        };
    }

    toggle() {
        let initialValue = this.state.expanded ? this.state.maxHeight + this.state.minHeight : this.state.minHeight,
            finalValue = this.state.expanded ? this.state.minHeight : this.state.maxHeight + this.state.minHeight;

        this.setState({
            expanded: !this.state.expanded
        });

        this.state.animation.setValue(initialValue);
        Animated.spring(
            this.state.animation,
            {
                toValue: finalValue
            }
        ).start();
    }

    _setMaxHeight(event) {
        this.setState({
            maxHeight: event.nativeEvent.layout.height
        });
    }

    _setMinHeight(event) {
        this.setState({
            minHeight: event.nativeEvent.layout.height
        });
    }


    render() {
        let icon = this.icons['down'];

        if (this.state.expanded) {
            icon = this.icons['up'];
        }
        return (
            <Animated.View 
            style={{height: this.state.animation, width: SCREEN_WIDTH - 10}}>
            <View style={styles.container}>
                <View style={styles.titleContainer} onLayout={this._setMinHeight.bind(this)}>
                    <Text style={styles.num}>{this.props.position}</Text>
                    <Text style={styles.title}>{this.props.name}</Text>
                    <TouchableHighlight
                        style={styles.button}
                        onPress={this.toggle.bind(this)}
                        underlayColor="#f1f1f1">
                        <Image
                            style={styles.buttonImage}
                            source={icon}
                        ></Image>
                    </TouchableHighlight>
                </View>

                <View style={styles.body} onLayout={this._setMaxHeight.bind(this)}>
                    {this.props.children}
                </View>
            </View>
            </Animated.View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        borderBottomWidth: 1,
        borderBottomColor: 'black',
        padding: 10,
        overflow: 'hidden'
    },
    titleContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 20
    },
    title: {
        color: '#2a2f43',
        fontWeight: 'bold'
    },
    button: {
    },
    buttonImage: {
        width: 20,
        height: 20
    },
    body: {
        padding: 10,
        paddingTop: 0
    },
    num: {
        fontSize: 25,
        fontWeight: 'bold'
    }
});

export default RankingUnit;