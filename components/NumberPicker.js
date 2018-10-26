import React, { Component } from 'react';
import {  View, Text, StyleSheet, Dimensions, TouchableHighlight} from 'react-native';
import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures';

const SCREEN_WIDTH = Dimensions.get("window").width;
export default class NumberPicker extends Component {
    constructor(props)
    {
        super(props);
        this.state = {selectedNumber: this.props.start};
    }
    getCurrentNumber(){
        return this.state.selectedNumber;
    }
    onSwipeLeft(gestureState) {
        this.setState((previousState) => {
            selectedNumber: (previousState.selectedNumber + 3)
        });
      }
    
      onSwipeRight(gestureState) {
        this.setState((previousState) => {
            selectedNumber: previousState.selectedNumber - 3
        });

      }
      /*
      selectOtherNumber(newNumber, oldNumber)
      {
        this.setState({selectedNumber: newNumber});
        alert("You selected "+newNumber);
      }*/
  render() {
    const config = {
        velocityThreshold: 0.3,
        directionalOffsetThreshold: 80
      };
    return (
      <View>
          <GestureRecognizer
        onSwipeLeft={(state) => this.onSwipeLeft(state)}
        onSwipeRight={(state) => this.onSwipeRight(state)}
        config={config}
        >
        <View style={styles.background}>
            <View><Text style={styles.text}>{this.state.selectedNumber - 3}</Text></View>
            <View><Text style={styles.text}>{this.state.selectedNumber - 2}</Text></View>
            <View><Text style={styles.text}>{this.state.selectedNumber - 1}</Text></View>
            <View style={{borderWidth: 5, borderColor: 'grey', paddingRight: 5, paddingLeft:5}}><Text style={styles.text}>{this.state.selectedNumber + 0}</Text></View>
            <View><Text style={styles.text}>{this.state.selectedNumber + 1}</Text></View>
            <View><Text style={styles.text}>{this.state.selectedNumber + 2}</Text></View>
            <View><Text style={styles.text}>{this.state.selectedNumber + 3}</Text></View>
        </View>
        </GestureRecognizer>

      </View>
    );
  }
}

const styles = StyleSheet.create({
    background: {
        backgroundColor: 'black',
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: SCREEN_WIDTH,
        padding: 5,
    },
    text: {
        color: 'white',
        fontSize: 30,
    }
});
