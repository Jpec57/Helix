import React, { Component } from 'react';
import { View, Dimensions, Text, TouchableOpacity, StyleSheet, FlatList, Button } from 'react-native';
import ExerciseCard from '../../components/ExerciseCard';
const SCREEN_HEIGHT = Dimensions.get("window").height;

export default class ResumeWorkoutScreen extends Component {
  static navigationOptions = {
    title: 'Resume Workout',
    headerStyle: {
      backgroundColor: '#000000',
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
      fontWeight: 'bold',
    },
  };
  _renderItem = ({ item }) => (
    <ExerciseCard
      name={item.name}
      series={item.series}
      reps={item.reps}
      weight={item.weight}
      superset={item.superset}
      rest={item.rest}
    />
  );

  render() {
    const workout = this.props.navigation.getParam('workout', null);
    const modif = this.props.navigation.getParam('modif', false);
    return (
      <View style={{ flex: 1 }}>
        <TouchableOpacity
          style={styles.head}
          onPress={() => this.props.navigation.navigate('AllWorkoutsScreen')}>
          <View style={{ alignItems: 'center' }} >
            <Text
              style={styles.content}>
              {workout.name}
            </Text>
          </View>
        </TouchableOpacity>
        <View style={{ flex: 3, justifyContent: 'center', alignItems: 'center' }}>
          <FlatList
            data={workout.exercises}
            extraData={workout.exercises}
            renderItem={this._renderItem}
            keyExtractor={(item, index) => index.toString()}
          />
          <View>
            <Button
              onPress={
                () => {
                  this.props.navigation.navigate('InExerciseScreen', { currentSet: 1, currentExercise: 0, workout: workout, modif: modif, skill: true });
                }
              }
              title="START WORKOUT"
              color="black"
              accessibilityLabel="DONE"
            />
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  head: {
    padding: 5,
    justifyContent: 'center',
    backgroundColor: 'black'
  },
  content: {
    color: 'white',
    fontSize: 30,
    fontWeight: 'bold',
  },
  row: {
    flexDirection: 'row',
  }
});
