import React, { Component } from "react";
import {
    View,
    Text,
    StyleSheet
} from "react-native";

import { Header, Body, Title, Content, Left, Icon, Right } from 'native-base'

class CustomHeader extends Component {
    render() {
        return (
            <Header style={{backgroundColor: '#b81717'}}>
            <Left><Icon name="ios-menu" onPress={this.props.onPress} /></Left>
            <Body>
              <Text style={{color: 'white', fontWeight: 'bold'}}>{this.props.title}</Text>
              </Body>
              <Right />
          </Header>
        );
    }
}

const styles = StyleSheet.create({
    header:{
        
    }
  });

export default CustomHeader;