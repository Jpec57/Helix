import React, { Component } from 'react';
import {  View, Text, StyleSheet, Image, FlatList} from 'react-native';
import RankingUnit from '../../components/RankingUnit';

export default class RankingScreen extends Component {
  constructor(props)
  {
    super(props);
    this.state = {
      users: ["Flavien", "Maxime", "Gerard"]
    };

  }

  _renderItem = ({ item, index}) => (
    <View style={{flex: 1}}>
      <RankingUnit name={item} position={index} children={
        <View style={{justifyContent: 'center', alignItems: 'center'}}>
      <Text>Hello World</Text>

        </View>
      }/>
    </View>
  );

  render() {
    return (
      <View style={{flex: 1}}>
        <View style={styles.header}>
        <Text style={styles.headerText}> Ranking </Text>
        </View>
        <View style={{flex: 5, justifyContent: 'center', alignItems: 'center'}}>
        <FlatList
                data={this.state.users}
                renderItem={this._renderItem}
                keyExtractor={(item, index) => index.toString()}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
    header: {
      backgroundColor: 'black',
      justifyContent: 'center',
      alignItems: 'center',
      flex:1
    },
    headerText: {
      color: 'white',
      fontSize: 25,
      fontWeight: 'bold',
    }
});