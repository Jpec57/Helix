import React, { Component } from 'react';
import { View, Text, Image, StyleSheet, Button, TextInput, Dimensions,  AsyncStorage, BackHandler } from 'react-native';
import * as firebase from 'firebase';
import { StackActions, NavigationActions } from 'react-navigation';
import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from 'react-native-simple-radio-button';



var uid = null;
const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

export default class EditProfileScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            text: "Enter something",
            age: "18",
            pseudo: "Enter a pseudo",
            height: "178",
            weight: {849167414: 78},
            goal: "Get stronger",
            gender: "Male",
            love: [],
            workouts: [],
            xp: 0,
            skills: undefined,
        };
        console.ignoredYellowBox = [
            'Setting a timer'
        ];
        this._handleBackPress = this._handleBackPress.bind(this);
        this.checkPersoData = this.checkPersoData.bind(this);

    }
    componentDidMount() {
        this.loadPersoData();
        BackHandler.addEventListener('hardwareBackPress', this._handleBackPress);
    }

    _handleBackPress() {
        this.props.navigation.navigate('ProfileScreen');
        return true;
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this._handleBackPress);
    }
    componentWillReceiveProps() {

        const resetAction = StackActions.reset({
            index: 0,
            actions: [NavigationActions.navigate({ routeName: 'HomeScreen' })],
        });
        this.props.navigation.dispatch(resetAction);
    }

    loadPersoData = async () => {
        var that = this;
        try {
            uid = await AsyncStorage.getItem('uid', null);
            if (uid !== null) {
                already = true;
                firebase.database().ref('/Profiles/').once('value', function (snapshot) {
                    if (snapshot.hasChild(uid)) {
                        var userData = snapshot.child(uid).val();
                        if (userData.skills == undefined) {
                            userData.skills = [];
                        }
                        if (userData.workouts == undefined)
                        {
                            userData.workouts = [];
                        }
                        if (!snapshot.child(uid).child("age")) {
                        }
                        else {
                            if (userData.love == undefined) {
                                that.setState({
                                    pseudo: userData.pseudo,
                                    age: userData.age,
                                    height: userData.height,
                                    weight: userData.weight,
                                    goal: userData.goal,
                                    gender: userData.gender,
                                    skills: userData.skills,
                                    xp: userData.xp,
                                    workouts: userData.workouts
                                });
                            }
                            else {
                                that.setState({
                                    pseudo: userData.pseudo,
                                    age: userData.age,
                                    height: userData.height,
                                    weight: userData.weight,
                                    goal: userData.goal,
                                    gender: userData.gender,
                                    xp: userData.xp,
                                    love: userData.love,
                                    skills: userData.skills,
                                    workouts: userData.workouts
                                });
                            }
                        }
                    }
                });
            } else {
                console.log("FIRST");
            }
        } catch (error) {
            alert("Error");
        }
    };


    checkPersoData() {
        var that = this;
        if (that.state.skills == undefined)
        {
            this.setState({
                skills: {
                    "BackLever": {
                      "level": 1,
                      "reps": [0, 0, 0, 0]
                    },
                    "FrontLever": {
                      "level": 1,
                      "reps": [0, 0, 0, 0]
                    },
                    "MuscleUp": {
                      "level": 1,
                      "reps": [0, 0, 0, 0]
                    },
                    "OAP": {
                      "level": 1,
                      "reps": [0, 0, 0, 0]
                    },
                    "Planche": {
                      "level": 1,
                      "reps": [0, 0, 0, 0]
                    },
                    "V-Sit": {
                      "level": 1,
                      "reps": [0, 0, 0, 0]
                    }
                  }
            }, ()=>{
                firebase.database().ref('/Profiles/' + uid).set({
                    pseudo: that.state.pseudo,
                    age: that.state.age,
                    height: that.state.height,
                    weight: that.state.weight,
                    goal: that.state.goal,
                    gender: that.state.gender,
                    workouts: that.state.workouts,
                    love: that.state.love,
                    skills: that.state.skills,
                    xp: that.state.xp,
                }).then(()=>{
                    that.props.navigation.navigate('HomeScreen', { maj: 'true' });
                })
            })
        }
        else
        {
            firebase.database().ref('/Profiles/' + uid).set({
                pseudo: that.state.pseudo,
                age: that.state.age,
                height: that.state.height,
                weight: that.state.weight,
                goal: that.state.goal,
                gender: that.state.gender,
                workouts: that.state.workouts,
                love: that.state.love,
                skills: that.state.skills,
                xp: that.state.xp,
            }).then(()=>{
                that.props.navigation.navigate('HomeScreen', { maj: 'true' });
            })
        }

 
    }


    render() {
        return (
            <View style={{ flex: 1 }}>
                <View style={{ flex: 1, backgroundColor: 'red' }}>
                    <Image
                        style={{ flex: 1, resizeMode: 'contain' }}
                        source={require('../../imgs/haltere.png')}
                    />
                </View>
                <View style={{ flex: 2, alignItems: 'center', flexDirection: 'column' }}>
                    <Text style={{ fontWeight: 'bold', fontSize: 25, marginBottom: '5%' }}> Set your personal data </Text>
                    <View style={{ flexDirection: 'row' }}>
                        <Text>Pseudo: </Text>
                        <TextInput
                            style={{ height: 40, width: 120,marginTop: -10, marginLeft: 5, marginRight: 5}}
                            onChangeText={(text) => this.setState({ pseudo: text })}
                            value={this.state.pseudo}
                        />
                    </View>


                    <View style={{ flexDirection: 'row' }}>
                        <Text>Age: </Text>
                        <TextInput
                            style={{ height: 40, width:40, marginTop: -10, marginLeft: 5, marginRight: 5}}
                            onChangeText={(text) => this.setState({ age: text })}
                            value={this.state.age}
                        />
                    </View>

                    <View style={{ flexDirection: 'row' }}>
                        <Text>Height: </Text>
                        <TextInput
                            style={{ height: 40, width:40, marginTop: -10, marginLeft: 5, marginRight: 5}}
                            onChangeText={(text) => this.setState({ height: text })}
                            value={this.state.height}
                        />
                        <Text>cm</Text>
                    </View>

                    <View style={{ flexDirection: 'row' }}>
                        <Text>Gender: </Text>
                        <RadioForm
          radio_props={[
            {label: 'Male', value: 'Male' },
            {label: 'Female', value: 'Female' }
          ]}
          initial={0}
          buttonSize={15}
          formHorizontal={true}
          onPress={(value) => {this.setState({value:value})}}
        />


                    </View>
                    <View style={{ flexDirection: 'row', marginTop: 5}}>
                        <Text>Goal:    </Text>
                        <View style={{height: 50, width: SCREEN_WIDTH * 0.45}}>
                        <RadioForm
          radio_props={[
            {label: 'Get stronger', value: 'Get stronger' },
            {label: 'Lose weight', value: 'Lose weight' },
            {label: 'Gain weight', value: 'Gain weight'}
          ]}
          initial={0}
          buttonSize={15}
          onPress={(value) => {
              this.setState({
                  value:value
                });
                console.log(this.state.value)
            }}
        />

                        </View>
                    </View>


                </View>
                <View style={styles.footer}>
                        <Button
                            onPress={this.checkPersoData}
                            title="Done"
                            color="#000000"
                            accessibilityLabel="Edit your profile"
                        />
                    </View>
            </View>

        );
    }
}

const styles = StyleSheet.create({
    footer: {
        position: 'absolute',
        height: 150,
        left: 0, 
        top: SCREEN_HEIGHT - 150, 
        width: SCREEN_WIDTH,
     }
});
/*
                        <Picker
                                                    selectedValue={this.state.gender}
                                                    style={{ height: 50, width: 0.5 * SCREEN_WIDTH }}
                                                    onValueChange={(itemValue, itemIndex) => this.setState({ gender: itemValue })}>
                                                    <Picker.Item label="Male" value="Male" />
                                                    <Picker.Item label="Female" value="Female" />
                                                </Picker>

                                                                        <Picker
                            selectedValue={this.state.goal}
                            style={{ height: 50, width: 0.5 * SCREEN_WIDTH }}
                            onValueChange={(itemValue, itemIndex) => this.setState({ goal: itemValue })}>
                            <Picker.Item label="Lose weight" value="lose" />
                            <Picker.Item label="Gain weight" value="gain" />
                            <Picker.Item label="Get stronger" value="strong" />
                        </Picker>
*/