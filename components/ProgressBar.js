import React, { Component } from 'react';
import {  View, Text, } from 'react-native';

export default class ProgressBar extends Component {
  constructor(props)
  {
    super(props);
  }
  render() {
    var rest = 100 - this.props.progress;
    return (
      <View style={{flex: 1, flexDirection: 'row', height: 10, margin: 10}}>
              <View style={{flex: this.props.progress, backgroundColor: 'red', borderTopLeftRadius: 15, borderBottomLeftRadius: 15}}></View>
        <View style={{flex: rest, backgroundColor: 'black', borderTopRightRadius: 15, borderBottomRightRadius: 15}}>
        </View>
      </View>
    );
  }
}
