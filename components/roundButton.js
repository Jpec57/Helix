import React, {Component} from 'react';

import {
  StyleSheet,
  Text,
  Button,
  View,
  TouchableHighlight,
  Image
} from 'react-native';

export default class RoundButton extends Component
{
  constructor(props)
  {
    super(props);
  }
  render()
  {
    return (
      <View>
        <TouchableHighlight
         style={{
             borderRadius: this.props.borderRadius,
             borderWidth: this.props.borderWidth,
             padding: 5,
             borderColor: this.props.borderColor,
             backgroundColor: this.props.backgroundColor,
           }}
         onPress={this.props.onPress}
        >
         <Text style={this.props.textStyle}> {this.props.text} </Text>
        </TouchableHighlight>
      </View>
    );
  }

}

const styles = StyleSheet.create({
  text:
  {
    color: '#ffffff',
    fontSize: 25,
    fontWeight: 'bold',
  }
});
