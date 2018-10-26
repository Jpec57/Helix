import React, { Component } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableHighlight, Image, Platform, Vibration } from 'react-native';
import * as firebase from 'firebase';
import { KeepAwake } from 'expo';


const SCREEN_WIDTH = Dimensions.get("window").width;
const soundObject = new Expo.Audio.Sound();

var myTimer = null;
var key = null;
var workout = null;
var currentExercise = 0;
var currentSet = 1;
var totalReps = 0;
var change = false;
var end = false;

export default class InWorkoutScreen extends Component {
  static navigationOptions = {
    header: null
  };
  /*
      INITIALIZATION
  */
  constructor(props) {
    super(props);
    this.state = {
      selectedNumber: 10,
      countdown: 60,
      nextExercise: "None",
      exercising: false,
    };
    console.disableYellowBox = true;
    Expo.Audio.setIsEnabledAsync(true);
    this.loadCountdown();
  }

  loadCountdown = async()=>
  {
    try {
      await soundObject.loadAsync(require('../../sounds/123.mp3'));
    } catch (error) {
    }
  }

  playCountdown = async()=>
  {
    try {
      await soundObject.playAsync();
      // Your sound is playing!
    } catch (error) {
      // An error occurred!
    }
  }

  componentDidMount() {
    key = this.props.navigation.getParam('key', null);
    change = this.props.navigation.getParam('change', false);
    end = this.props.navigation.getParam('end', false);
    var expectedReps = this.props.navigation.getParam('expectedReps', 0);
    var nextExercise = this.props.navigation.getParam('currentExercise', 0);
    var workout = this.props.navigation.getParam('workout', null);
    this.setTotalReps();

    this.setState({
      selectedNumber: expectedReps,
      countdown: workout.exercises[nextExercise].rest,
      nextExercise: workout.exercises[nextExercise].name,
      exercising: false,
    });
    this.launchCountDown();
    this._activate();
    Expo.ScreenOrientation.allow(Expo.ScreenOrientation.Orientation.PORTRAIT_UP );
  }

  _activate = () => {
    KeepAwake.activate();
  }

  _deactivate = () => {
    KeepAwake.deactivate();
  }

  componentWillUnmount()
  {
    this._deactivate();
  }

  launchCountDown() {
    var that = this;
    myTimer = setInterval(function () {
      var newCountDown = that.state.countdown - 1;
      if (newCountDown == 3)
      {
        that.playCountdown();
      }
      if (newCountDown == 0)
      {
        if (Platform.OS === 'ios')
        {
          Vibration.vibrate(1000);
        }
        else
        {
          Vibration.vibrate(1000);
        }
      }
      if (newCountDown >= 0) {
        that.setState({
          countdown: newCountDown,
        })
      }
      else {
        that.nextPage()
      }
    }, 1000);
  }

  setTotalReps() {
    if (change == true) {
      firebase.database().ref(key + '/exercises/' + (currentExercise - 1) + '/reps/').on('value', function (snapshot) {
        totalReps = snapshot.val();
      });
    }
    else {
      firebase.database().ref(key + '/exercises/' + currentExercise + '/reps/').on('value', function (snapshot) {
        totalReps = snapshot.val();
      });
    }
  }

  /*
      UPDATE FUNCTIONS
  */

  updateReps() {
    totalReps = totalReps + this.state.selectedNumber;
    if (change == true) {
      firebase.database().ref(key + '/exercises/' + (currentExercise - 1) + '/reps/').set(totalReps);
    }
    else {
      firebase.database().ref(key + '/exercises/' + currentExercise + '/reps/').set(totalReps);
    }
  }

  nextPage() {
    this.updateReps();
    if (end == false) {
      clearInterval(myTimer);
      const modif = this.props.navigation.getParam('modif', false);
      this.props.navigation.navigate('InExerciseScreen', {
        currentExercise: currentExercise,
        currentSet: currentSet,
        key: key,
        workout: workout,
        modif: modif
      });
    }
    else {
      this.quitWorkout();
    }
  }

  quitWorkout() {
    clearInterval(myTimer);
    const modif = this.props.navigation.getParam('modif', false);
    this.props.navigation.navigate('EndWorkoutScreen', {workout: workout, key: key, modif: modif});
  }

  selectOtherNumber(add) {
    var newNumber = this.state.selectedNumber + add;
    this.setState({ selectedNumber: newNumber });
  }

  render() {
    workout = this.props.navigation.getParam('workout', null);
    currentExercise = this.props.navigation.getParam('currentExercise', 0);
    currentSet = this.props.navigation.getParam('currentSet', 1);
    return (
      <View style={{ marginTop: '10%', marginBottom: 0, flex: 1 }}>
        <View style={styles.background}>
          <TouchableHighlight onPress={() => this.selectOtherNumber(-3)}>
            <View><Text style={styles.text}>{this.state.selectedNumber - 3}</Text></View>
          </TouchableHighlight>
          <TouchableHighlight onPress={() => this.selectOtherNumber(-2)}>
            <View><Text style={styles.text}>{this.state.selectedNumber - 2}</Text></View>
          </TouchableHighlight>
          <TouchableHighlight onPress={() => this.selectOtherNumber(-1)}>
            <View><Text style={styles.text}>{this.state.selectedNumber - 1}</Text></View>
          </TouchableHighlight>
          <View style={{ borderWidth: 5, borderColor: 'grey', paddingRight: 5, paddingLeft: 5 }}><Text style={styles.text}>{this.state.selectedNumber + 0}</Text></View>
          <TouchableHighlight onPress={() => this.selectOtherNumber(1)}>
            <View><Text style={styles.text}>{this.state.selectedNumber + 1}</Text></View>
          </TouchableHighlight>
          <TouchableHighlight onPress={() => this.selectOtherNumber(2)}>
            <View><Text style={styles.text}>{this.state.selectedNumber + 2}</Text></View>
          </TouchableHighlight>
          <TouchableHighlight onPress={() => this.selectOtherNumber(3)}>
            <View><Text style={styles.text}>{this.state.selectedNumber + 3}</Text></View>
          </TouchableHighlight>
        </View>
        <View style={styles.countdown}>
          <Text style={styles.countdownText}>{this.state.countdown}</Text>
          <TouchableHighlight
            onPress={() => {
              this.nextPage();
            }}>
            <Text style={{ fontSize: 25 }}>Skip</Text>
          </TouchableHighlight>
        </View>
        <View style={{ flex: 1, marginTop: '25%', marginBottom: 0, alignItems: 'center', alignSelf: 'stretch' }}>
          <Text style={{ fontWeight: 'bold' }}>
            Next exercise: {this.state.nextExercise}
          </Text>
          <View style={{ flex: 1, alignItems: 'center', alignSelf: 'stretch', backgroundColor: 'black' }}>
            <View
              style={{ flex: 1, flexDirection: 'row' }}>
              <Image
                resizeMode='contain'
                style={{
                  flex: 1,
                  width: null,
                  height: null
                }}
                source={require('../../imgs/NoImageAvailable.jpg')}
              />
            </View>
          </View>
          <View>
            <TouchableHighlight
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
        </View>

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
  countdown: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '25%',
  },
  countdownText: {
    fontSize: 100,
    fontWeight: 'bold',
  },
  text: {
    color: 'white',
    fontSize: 30,
  }
});
