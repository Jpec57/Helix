import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, Button, TouchableHighlight, AsyncStorage } from 'react-native';
import * as firebase from 'firebase';
import { KeepAwake } from 'expo';


var end = false;
var key = null;
var workout = null;
var uid = null;
var currentExercise = 0;
var myTimer = null;

export default class InExerciseScreen extends Component {
    static navigationOptions = {
        header: null
      };
    /*
        Initialization
    */
    constructor(props) {
        super(props);
        this.state = {
            currentExercise: 0,
            currentSet: 1,
            username: "Jpec",
            reps: 0,
        };
        console.disableYellowBox = true;
    }

    
    componentDidMount() {
        this.getUid();
        this._activate();

        Expo.ScreenOrientation.allow(Expo.ScreenOrientation.Orientation.PORTRAIT_UP);
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

    getUid = async () => {
        var that = this;
        try {
            uid = await AsyncStorage.getItem('uid', null);
            if (uid !== null) {
                firebase.database().ref('/Profiles/' + uid).once('value', function (snapshot) {
                    that.setState({
                        username: snapshot.val().pseudo
                    });
                });
                this.setInitialState();

            }
        } catch (error) {
            alert("Error" + error);
        }
    };


    /*
        If a key for the training has not been created, we must create an entry
        in firebase to store the data with initFirebaseEntry()
    */
    setInitialState() {
        workout = this.props.navigation.getParam('workout', null);
        currentExercise = this.props.navigation.getParam('currentExercise', 0);
        var set = this.props.navigation.getParam('currentSet', 1);
        key = this.props.navigation.getParam('key', null);
        if (key == null) {
            this.initFirebaseEntry(workout, set);
        }
        else {
            this.setState({
                currentExercise: currentExercise,
                oldExercise: currentExercise,
                currentSet: set,
                key: key,
            });
        }
        const exo = workout.exercises[currentExercise];
        if (exo.hold == true) {
            this.setTimer();
        }
    }
    initFirebaseEntry(workout, set) {
        var that = this;
        var date = Date.now();
        var init = {
            username: that.state.username,
            name: workout.name,
            muscles: [],
            lastTime: 0,
            exercises: [],
            points: 0,
            material: [],
            cycle: false,
            lastTime: (-date),
            description: "None",
            visible: true,
            love: 0,
        };
        if (this.props.navigation.getParam('skill', false))
        {
            init["skillPath"] = this.props.navigation.getParam('path', "");
        }
        key = '/trainings/' + (Number.MAX_SAFE_INTEGER - date) + '/' + uid + '/' + workout.name;

        firebase.database().ref(key).set(init).then(() => {
            that.setState({
                currentExercise: currentExercise,
                oldExercise: currentExercise,
                currentSet: set,
                key: key,
            });
            that.updateExercise();
        });
    }

    /*
        UPDATE FUNCTIONS
    */

    /*
        Create a node for the new current exercise
    */
    updateExercise() {
        var nb = currentExercise;
        var exo = workout.exercises[nb];
        firebase.database().ref(key + '/exercises/' + nb).set({
            description: exo.description,
            hold: exo.hold,
            series: exo.series,
            weight: exo.weight,
            difficulty: exo.difficulty,
            muscles: exo.muscles,
            material: exo.material,
            restBtw: exo.restBtw,
            rest: exo.rest,
            name: exo.name,
            tempo: exo.tempo,
            superset: "Dips",
            reps: 0,
        });
    }

    componentWillReceiveProps()
    {
        clearInterval();
        const exo = workout.exercises[currentExercise];
        if (myTimer == null && exo.hold == true)
        {
            this.setState({
                reps: 0
            });
            this.setTimer();
        }
        else
        {
            myTimer = null;
        }

    }

    setTimer() {
        var that = this;
        myTimer = setInterval(function () {
            var newCountDown = that.state.reps + 1;
            that.setState({
                reps: newCountDown,
            });
        }, 1000);
    }

    /*
        Increase the current set and check whether we have to: 
            - change exercise and reset currentSet to 1
            - put an end to the training
        Then, change page
    */
    increaseSet() {
        var set = this.state.currentSet + 1;
        var change = false;
        if (set <= workout.exercises[currentExercise].series) {
            this.setState({
                currentSet: set
            })
        }
        else {
            var newExo = currentExercise + 1;
            change = true;
            try {
                name = workout.exercises[newExo].name;
                this.setState({
                    currentSet: 1,
                    currentExercise: newExo,
                    oldExercise: newExo,
                });
                currentExercise = newExo;
                this.updateExercise();
            } catch (e) {
                end = true;
            }
        }
        clearInterval(myTimer);
        const modif = this.props.navigation.getParam('modif', false);

        if (end == false) {
            const exo = workout.exercises[this.state.oldExercise];
            var expectedReps = exo.reps;
            if (exo.hold)
            {
                expectedReps = this.state.reps;
            }

            this.props.navigation.navigate('InWorkoutScreen', {
                currentSet: this.state.currentSet,
                currentExercise: currentExercise,
                expectedReps: expectedReps,
                key: key,
                change: change,
                workout: workout,
                modif: modif

            });
        }
        else {
            this.props.navigation.navigate('InWorkoutScreen', {
                currentSet: this.state.currentSet,
                currentExercise: currentExercise,
                expectedReps: workout.exercises[this.state.oldExercise].reps,
                key: key,
                change: false,
                workout: workout,
                end: true,
                modif: modif,
            });
        }
    }

    quitWorkout() {
        clearInterval(myTimer);
        const modif = this.props.navigation.getParam('modif', false);
        this.props.navigation.navigate('EndWorkoutScreen', {workout: workout, key: key, modif: modif});
    }

    render() {
        workout = this.props.navigation.getParam('workout', null);
        const exo = workout.exercises[currentExercise];
        return (
            <View style={{ flex: 1, marginTop: '5%' }}>
                <View style={styles.header}>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={styles.name}>{exo.hold ? "" : "" + exo.reps} {exo.name}</Text>
                    </View>

                </View>
                <View style={styles.body}>
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
                <View style={styles.footer}>
                    <View style={{ alignItems: 'center', marginTop: 10 }}>
                        <Text>Weight : {exo.weight}</Text>
                        <Text>Set : {this.state.currentSet} / {exo.series}</Text>
                    </View>

                    {exo.hold ? <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ fontSize: 30, fontWeight: 'bold' }}>{this.state.reps}</Text>
                    </View> : null}

                    <View style={{ alignItems: 'center', justifyContent: 'center', margin: '10%' }}>
                        <Button
                            onPress={() => {
                                clearInterval(myTimer);
                                this.increaseSet();

                            }}
                            title="TAP WHEN DONE"
                            color="black"
                            accessibilityLabel="DONE"
                        />
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
    header: {
        backgroundColor: 'black',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    body: {
        backgroundColor: 'black',
        flex: 2,
    },
    footer: {
        flex: 2,
        backgroundColor: '#fff'
    },
    rotateStyle: {
        transform: [{ rotate: '-20deg' }],
        color: 'white',
        fontSize: 30,
    },
    name: {
        fontSize: 25,
        color: 'white',
        fontWeight: 'bold',
    }
})