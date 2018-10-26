import React, { PureComponent } from 'react';
import {withNavigation} from 'react-navigation';
import {  View, Text, TouchableOpacity, StyleSheet} from 'react-native';

class WorkoutNameListItem extends React.PureComponent {
    constructor(props)
    {
        super(props)
    }
    render() {
        const {navigation } = this.props;
    return (
        <View>
          <TouchableOpacity 
          style={styles.background}
          onPress={() => {
            navigation.navigate('ResumeWorkoutScreen', {workout: this.props.data});
              }}>
          <View>
          <Text 
              style={styles.content}>
              {this.props.text}
            </Text>
          </View>
          </TouchableOpacity>
        </View>
    );
  }
}

const styles = StyleSheet.create({
    background: {
        width: '100%',
        alignItems: 'center',
        padding: 5,

        justifyContent: 'center',
        backgroundColor: 'white'
    },
    content: {
        color: 'black',
        fontSize: 20,
    }
})

export default withNavigation(WorkoutNameListItem)
