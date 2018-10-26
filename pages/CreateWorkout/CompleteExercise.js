import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Dimensions, TextInput, BackHandler } from 'react-native';
import { Card, CardItem, Body } from 'native-base';
const SCREEN_WIDTH = Dimensions.get("window").width;

var workout = null;
var index = 0;
var backHandler = 0;


export default class CompleteExerciseScreen extends Component {
    static navigationOptions = ({ navigation }) => {
        const { params = {} } = navigation.state;
        return {
            title: 'Complete your exercise',
            headerStyle: {
                backgroundColor: '#000000',
            },
            headerLeft:
                <TouchableOpacity
                    onPress={() => {
                        params.method();
                    }}>
                    <View style={{ flexDirection: 'row' }}>
                        <Image source={require('../../imgs/back.png')} title="Back" style={{ width: 20, height: 20 }}></Image>
                        <Text style={{ color: 'white' }}>BACK</Text>
                    </View>
                </TouchableOpacity>,
            headerTintColor: '#fff',
            headerTitleStyle: {
                fontWeight: 'bold',
            },
        };
    };
    constructor(props) {
        super(props);
        this.state = {
            exerciseName: "Exercise name",
            sets: 3,
            reps: 12,
            rest: 60,
            weight: 80,
        }
        this.removeExercise = this.removeExercise.bind(this);
    }
    componentDidMount() {
        backHandler = this.props.navigation.getParam('backHandler', 0);
        var that = this;
        this.props.navigation.setParams({
            method: this.removeExercise
        });
        BackHandler.addEventListener('hardwareBackPress', function () {
            if (backHandler == 0) {
                that.props.navigation.navigate('HomeScreen');
            }
            else {
                that.props.navigation.navigate('ChooseMuscleScreen', { workout: workout, backHandler: (backHandler - 2) });
            }
            return true;
        });
        workout = this.props.navigation.getParam('workout', null);
        index = this.props.navigation.getParam('index', workout.exercises.length - 1);
        var exo = workout.exercises[index];
        this.setState({
            exerciseName: exo.name,
            sets: exo.series,
            reps: exo.reps,
            rest: exo.rest,
            weight: exo.weight,
        });
        Expo.ScreenOrientation.allow(Expo.ScreenOrientation.Orientation.PORTRAIT_UP);
    }
    removeExercise() {
        var exos = workout.exercises;
        exos.pop();
        workout.exercises = exos;
        this.props.navigation.navigate('ChooseMuscleScreen', { workout: workout, backHandler: (backHandler - 1) })
    }

    editExerciseConfig() {
        if (!isNaN(this.state.reps) && !(this.state.reps === "")
            && !isNaN(this.state.sets) && !(this.state.sets === "")
            && !isNaN(this.state.rest) && !(this.state.rest === "")
            && !isNaN(this.state.weight) && !(this.state.weight === ""))
        {
            if (this.state.reps == 0 || this.state.sets == 0)
            {
                alert("You have to do at least one rep/set");
            }
            else
            {
                var exo = workout.exercises[index];
                exo.reps = this.state.reps;
                exo.series = this.state.sets;
                exo.rest = this.state.rest;
                exo.weight = this.state.weight;
                workout.exercises[index] = exo;
                this.props.navigation.navigate('ResumeWorkoutScreen2', { workout: workout, backHandler: (backHandler + 1) });
            }
        }
        else
        {
            alert("You have to fill all the fields here");
        }
    }
    render() {
        return (
            <View style={{ flex: 1, marginTop: '5%' }}>
                <Card style={{ flex: 8}}>
                    <CardItem style={{ backgroundColor: 'black', alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold' }}>{this.state.exerciseName}</Text>
                    </CardItem>
                    <CardItem>
                        <Body style={{ justifyContent: 'center', alignItems: 'center' }}>
                            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                <Image resizeMode='contain' source={require('../../imgs/NoImageAvailable.jpg')} style={{ width: SCREEN_WIDTH * 0.6, height: SCREEN_WIDTH * 0.4 }} />
                            </View>

                           <View style={{marginRight: 5, marginLeft: 5, marginTop: 25}}>
                           <View style={styles.block}>
                                <View style={[styles.unit]}>
                                <Text>{this.state.sets} sets</Text>

                                    <TextInput
                                        style={{ height: 40, width: SCREEN_WIDTH * 0.3 }}
                                        placeholder="3"
                                        onChangeText={(text) => this.setState({ sets: text })}
                                    />
                                </View>
                                <View style={styles.unit}>
                                <Text>{this.state.reps} reps</Text>

                                    <TextInput
                                        style={{ height: 40, width: SCREEN_WIDTH * 0.3 }}
                                        placeholder="3"
                                        onChangeText={(text) => this.setState({ reps: text })}
                                    />
                                </View>
                            </View>
                            <View style={styles.block}>
                                <View style={styles.unit}>
                                <Text>Rest: {this.state.rest}sec</Text>

                                    <TextInput
                                        style={{ height: 40, width: SCREEN_WIDTH * 0.3 }}
                                        placeholder="4"
                                        onChangeText={(text) => this.setState({ rest: text })}
                                    />
                                </View>
                                <View style={styles.unit}>
                                <Text>Weight: {this.state.weight}kgs</Text>

                                    <TextInput
                                        style={{ height: 40, width: SCREEN_WIDTH * 0.3 }}
                                        placeholder="3"
                                        onChangeText={(text) => this.setState({ weight: text })}
                                    />
                                </View>
                            </View>
                           </View>
                            
                        </Body>
                    </CardItem>
                </Card>
                <View style={{ flex: 2, justifyContent: 'center', alignItems: 'center' }}>
                    <TouchableOpacity
                        style={{ backgroundColor: '#b81717', padding: 10, borderColor: 'black', borderWidth: 1 }}
                        onPress={() => { this.editExerciseConfig() }}>
                        <Text style={{ color: 'white', fontWeight: 'bold' }}>ADD</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{ backgroundColor: '#b81717', padding: 10, borderColor: 'black', borderWidth: 1 }}
                        onPress={() => { this.removeExercise() }}>
                        <Text style={{ color: 'white', fontWeight: 'bold' }}>CANCEL</Text>
                    </TouchableOpacity>
                </View>

            </View>
        );
    }
}
const styles = StyleSheet.create({
    block: {
        flexDirection: 'row',
    },
    unit: {
        width: SCREEN_WIDTH * 0.5 - 10,
        padding: 10,
        borderColor: '#bfbfbf',
        borderRadius: 10,
        borderWidth: 1,
        margin:2
    }
})