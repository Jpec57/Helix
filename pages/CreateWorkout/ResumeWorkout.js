import React, { Component } from 'react';
import {
  View, Text, StyleSheet, TouchableHighlight, FlatList, Image,
  PanResponder, TextInput,
  Animated, AsyncStorage,
  BackHandler
} from 'react-native';
import { StackActions, NavigationActions } from 'react-navigation';
import SortableList from 'react-native-sortable-list';

import ExercisePanel from '../../components/ExercisePanel';
import * as firebase from 'firebase';

var workout = null;
var uid = null;
var backHandler = 0;


export default class ResumeWorkoutScreen2 extends Component {
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
  constructor(props) {
    super(props);
    this.state = {
      exercises: [],
      wName: "Enter a workout name"
    };
    this.deleteSpecificExercise = this.deleteSpecificExercise.bind(this);

  }

  componentDidMount() {
    backHandler = this.props.navigation.getParam('backHandler', 0);
    var that = this;
    BackHandler.addEventListener('hardwareBackPress', function() {
      if (backHandler == 0)
      {
          that.props.navigation.navigate('HomeScreen');
      }
      else
      {
          that.props.navigation.navigate('CompleteExerciseScreen', { workout: workout, backHandler: (backHandler - 1)});
      }
      return true;
    });
    workout = this.props.navigation.getParam('workout', null);
    wname = this.props.navigation.getParam('wname', "Enter a workout name");
    this.setState({
      exercises: workout.exercises,
      wName: wname
    });
    Expo.ScreenOrientation.allow(Expo.ScreenOrientation.Orientation.PORTRAIT_UP );
    this.getUid();
  }

  deleteSpecificExercise = (id) =>{
    console.log("INDEX: "+ id);
    workout.exercises.splice(id, 1);
    this.setState({
      exercises: workout.exercises
    })
  }

  evaluateInvolvements()
  {
    var exos = this.state.exercises;
    var arrName = ["Abs", "Back", "Biceps", "Butt", "Calves", "Chest", "Forearm", "Hamstrings", "Quadriceps", "Shoulders", "Trapezius", "Triceps"];
    var arrTot = [0,0,0,0,0,0,0,0,0,0,0,0];
    exos.forEach(function(exo){
      let muscles = exo["muscles"];
      muscles.forEach(function(m){
        for (var i = 0; i < arrName.length; i++)
        {
          if (m == arrName[i])
          {
            arrTot[i] += 1;
          }
        }
      });
    });
    var returnString = "";
    //Transform int to string
    for (var i =0; i < arrTot.length; i++)
    {
      returnString = returnString + arrTot[i] + ";";
    }
    returnString.slice(0, -1);
    console.log(returnString);
    return (returnString);
  }

  getUid = async() => {
    var that=this;
    try {
      uid = await AsyncStorage.getItem('uid');
      if (uid !== null)
      {
        var array = [];
        firebase.database().ref('/Profiles/' + uid + '/workouts/').once('value', function(snapshot){
          snapshot.forEach(function(child){
            array.push(child);
          });
          that.setState({workoutsDatabase: array});
        });
      }
    } catch (error) {
      alert("Error "+ error);
    }
  }

  saveWorkout() {
    workout.name = this.state.wName;
    
    if (workout.name == 'Enter a workout name') {
      alert("Please choose a workout name");
    }
    else {
      firebase.database().ref('/Profiles/' + uid + '/workouts/'+workout.name).set(
        workout
      );
    }
  }

  quitWorkout() {
    this.props.navigation.navigate('AllWorkoutsScreen');
  }

  _renderItem = ({ item, index }) => (

    <ExercisePanel title={item.series + " * " + item.reps + "     " + item.name}>
      <View style={{ flex: 1 }}>
        <View style={{ justifyContent: 'center', alignItems: 'center'}}>
          <Image source={require('../../imgs/NoImageAvailable.jpg')}
            style={{
              resizeMode: 'contain',
              width: 300,
              height: 180
            }}
          />
        </View>

        <TouchableHighlight
          onPress={() => {
          }}>
          <Text>{item.description} {index}</Text>

        </TouchableHighlight>
        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
          <View>
            <TouchableHighlight
              style={{ padding: 5, borderWidth: 1, borderColor: 'black', backgroundColor: '#b81717' }}
              onPress={() => { this.props.navigation.navigate('CompleteExerciseScreen', { workout: workout, index: index, backHandler: (backHandler - 1)}) }}
            >
              <Text style={{ color: 'white' }}>EDIT</Text>
            </TouchableHighlight>
          </View>

          <View>
            <TouchableHighlight
              onPress={()=>{
                this.deleteSpecificExercise(index);
                this.forceUpdate();
              }
              }>
              <Image
                source={require('../../imgs/bin.png')}
                style={{ width: 30, height: 30 }} />
            </TouchableHighlight>
          </View>

        </View>
      </View>
    </ExercisePanel>
  );

  render() {
    workout = this.props.navigation.getParam('workout', null);
    return (
      <View style={{ flex: 1 }}>
        <View style={styles.header}>
          <View style={{ marginTop: 15, marginLeft: 15 }}>
            <TouchableHighlight
            style ={{ padding: 10, borderRadius: 15, backgroundColor : '#bfbfbf'}}
              onPress={() => { this.quitWorkout() }}>
              <Image
                resizeMode='contain'
                style={{
                  width: 30,
                  height: 30
                }}
                source={require('../../imgs/exit.png')}
              />
            </TouchableHighlight>

          </View>

          <View style={{
            justifyContent: 'center',
            alignItems: 'center',

          }}>
            <TextInput
              placeholder={this.state.wName}
              style={{ marginLeft: 25, width: 200, justifyContent: 'center', alignItems: 'center', borderWidth: 1,
              borderColor: '#bfbfbf',
              borderRadius: 5,
              backgroundColor: 'white',
              padding: 5
            }}
              onChangeText={(text) => this.setState({ wName: text })}
            />
          </View>

        </View>
        <View style={styles.body}>
          <FlatList
            data={this.state.exercises}
            extraData={this.state}
            renderItem={this._renderItem}
            keyExtractor={(item, index) => index.toString()}
          />
          <View style={{ justifyContent: 'flex-end', alignItems: 'flex-end', marginRight: '5%' }}>
            <TouchableHighlight
              style={{ justifyContent: 'center', alignItems: 'center', width: 50, height: 50, backgroundColor: 'black', borderRadius: 100, borderColor: 'black', borderWidth: 1 }}
              onPress={() => { 
                var muscleInvolv = this.evaluateInvolvements();
                const resetAction = StackActions.reset({
                  index: 0,
                  actions: [NavigationActions.navigate({ routeName: 'ChooseMuscleScreen',
                   params: {
                     workout: workout, 
                     backHandler: (backHandler - 1),
                      muscleInvolvements: muscleInvolv,
                      renderControl: true
                    }
                  })],
                });
                this.props.navigation.dispatch(resetAction);
              }}>
              <Text style={{ fontSize: 35, color: 'white' }}>+</Text>
            </TouchableHighlight>
          </View>

        </View>
        <View style={styles.footer}>
          <TouchableHighlight
            style={{
              justifyContent: 'center',
              alignItems: 'center', padding: 10,
               backgroundColor: '#fff', borderWidth: 1,
                borderColor: 'black',
            }}
            onPress={() => {
              if (workout.exercises.length > 0) {
                if (this.state.wName != "Enter a workout name") {
                  workout.name = this.state.wName;
                  this.props.navigation.navigate('InExerciseScreen', { workout: workout })
                }
                else
                {
                  alert("Enter a workout name");
                }
              }
              else {
                alert("Error: you must have at least one exercise");
              }
            }}>
            <Text style={{fontWeight: 'bold'}}>START WORKOUT</Text>
          </TouchableHighlight>
          <TouchableHighlight
            style={{
              justifyContent: 'center',
              alignItems: 'center', padding: 10,
               backgroundColor: '#fff',
               borderWidth: 1, borderColor: 'black'
            }}
            onPress={() => {
              this.saveWorkout();
            }}>
            <Text style={{fontWeight: 'bold'}}>SAVE WORKOUT</Text>
          </TouchableHighlight>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'black',
  },
  
  body: {
    flex: 5,
    backgroundColor: '#bfbfbf'

  },
  footer: {
    flex: 2,
    backgroundColor: '#bfbfbf',
    justifyContent: 'space-around'
  }
});