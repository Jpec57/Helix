import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableHighlight, FlatList, ScrollView, BackHandler} from 'react-native';
import * as firebase from 'firebase';
import ExercisePanel from '../../components/ExercisePanel';
import SearchBar from 'react-native-searchbar';

var workout = null;
var backHandler = 0;

export default class ChooseExerciseScreen extends Component {
    static navigationOptions = {
        title: 'Choose an exercise',
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
        console.ignoredYellowBox = [
            'Setting a timer'
        ];
        this.state = {
            search: false,
            exercises: null,
            results: [],
            newExo: {
                "description": "",
                "hold": false,
                "img": "",
                "material": [],
                "difficulty": 0.4,
                "name": "",
                "reps": 12,
                "rest": 60,
                "restBtw": 60,
                "series": 3,
                "superset": "Non",
                "tempo": 2,
                "weight": 80
            },
        };
        this._handleResults = this._handleResults.bind(this);

    }
    componentDidMount() {
        this.loadDatabaseExercises();
        backHandler = this.props.navigation.getParam('backHandler', 0);
        var that = this;
        BackHandler.addEventListener('hardwareBackPress', function() {
            if (backHandler == 0)
            {
                that.props.navigation.navigate('HomeScreen');
            }
            else
            {
                that.props.navigation.navigate('ChooseMuscleScreen', { workout: workout, backHandler: (backHandler - 1)});
            }
            return true;
          });
        workout = this.props.navigation.getParam('workout', null);
        Expo.ScreenOrientation.allow(Expo.ScreenOrientation.Orientation.PORTRAIT_UP);
    }

    loadDatabaseExercises() {
        var that = this;
        var exercisesArray = [];
        var muscle = this.props.navigation.getParam('muscle', 'Chest');
        firebase.database().ref('/exercises/' + muscle)
            .on('value', function (snapshot) {
                for (s in snapshot.val()) {
                    var d = snapshot.child(s);
                    exercisesArray.push({
                        name: JSON.stringify(s),
                        description: d.child('description').val(),
                        difficulty: d.child('difficulty').val(),
                        hold: d.child('hold').val(),
                        material: d.child('material').val(),
                        muscles: d.child('muscles').val(),
                        img: null
                    });
                }
                that.setState({
                    exercises: exercisesArray,
                    results: exercisesArray,
                });
            }
            );
    }

    addSelectedExercise(item) {
        var newExo = {
            "description": item.description,
            "hold": item.hold,
            "img": item.img,
            "material": item.material,
            "muscles": item.muscles,
            "difficulty": item.difficulty,
            "name": item.name,
            "reps": 12,
            "rest": 60,
            "restBtw": 60,
            "series": 3,
            "superset": "Non",
            "tempo": 2,
            "weight": 80
        };
        var oldExercisesArray = workout.exercises;
        oldExercisesArray.push(newExo);

        //Update the needed material and used muscles in the workout
        var oldMusclesArray = workout.muscles;
        var oldMaterialArray = workout.material
        for (i = 0; i < item.muscles.length; i++) {
            oldMusclesArray.push(item.muscles[i]);
        }
        for (i = 0; i < item.material.length; i++) {
            oldMaterialArray.push(item.material[i]);
        }
        workout.material = oldMaterialArray;
        workout.muscles = oldMusclesArray;
        this.props.navigation.navigate('CompleteExerciseScreen', { workout: workout, backHandler: (backHandler + 1)});
    }

    handleBodySize()
    {
        if (this.state.search)
        {
            return {
                backgroundColor: '#fff',
                flex: 2,
                alignItems: 'center',
                justifyContent: 'center',
              }
        }
        else
        {
            return {
                backgroundColor: '#fff',
                flex: 5,
                alignItems: 'center',
                justifyContent: 'center',
              }
        }
    }

    handleFooterSize()
    {
        if (this.state.search)
        {
            return {
                backgroundColor: '#bfbfbf',
                flex: 5,
                alignItems: 'center',
                justifyContent: 'center',
              }
        }
        else
        {
            return {
                backgroundColor: '#bfbfbf',
                flex: 2,
                alignItems: 'center',
                justifyContent: 'center',
              }
        }
    }

    _renderItem = ({ item }) => (
        <TouchableHighlight
        onPress={() => {
            this.addSelectedExercise(item);
        }}>
        <ExercisePanel title={item.name}>

                <Text>{item.description}</Text>
        </ExercisePanel>
        </TouchableHighlight>

    );

    _handleSearch(hide)
    {
        var old = this.state.search;
        var that= this;
        if (hide && !old){
            return;
        }
        this.setState({search: !old}, ()=> {
            if (that.state.search)
            {
                this.searchBar.show();
            }
            else
            {
                this.searchBar.hide();
            }
        });
    }
    _renderRow = (rowItem, rowId, sectionId) => <Text>{rowItem.title}</Text>;
    _renderSection = (section, sectionId) => <Text>{section}</Text>;
    _handleResults(results) {
        this.setState({results});
        console.log(JSON.stringify(results));
      }

    render() {
        return (
            <View style={{ flex: 1 }}>

                <View style={this.handleBodySize()}>
                <TouchableHighlight
                    style={{width: '100%'}}
                    onPress={()=> this._handleSearch(true)}>
                    <FlatList
                        data={this.state.results}
                        renderItem={this._renderItem}
                        keyExtractor={(item, index) => index.toString()}
                    />
                    </TouchableHighlight>
                </View>
                <View style={this.handleFooterSize()}>
                <TouchableHighlight
                        style={{ backgroundColor: 'red', padding: 10, borderColor: 'black', borderWidth: 1 }}
                        onPress={()=> this._handleSearch()}>
                        <Text style={{ color: 'white', fontSize: 30 }}>{this.state.search ? "CLOSE" : "SEARCH"}</Text>
                    </TouchableHighlight>
                    <SearchBar
                        ref={(ref) => this.searchBar = ref}
                        data={this.state.exercises}
                        handleResults={this._handleResults}
                        allDataOnEmptySearch
                    />
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
        backgroundColor: '#fff',
        flex: 5,
    },
    footer: {
        backgroundColor: '#bfbfbf',
        flex: 2,
        alignItems: 'center',
        justifyContent: 'center',
    }
});

/*
                <View style={styles.header}>
                    <Text style={{ color: 'white', fontSize: 30 }}>Choose an exercise</Text>
                </View>
*/
