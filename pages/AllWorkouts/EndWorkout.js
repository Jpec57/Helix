import React, { Component } from 'react';
import {  View, Text, StyleSheet, Image, Button, FlatList, WebView, AsyncStorage} from 'react-native';
import * as firebase from 'firebase';
import ProgressBar from '../../components/ProgressBar';
import { StackActions, NavigationActions } from 'react-navigation';

var uid = null;
var wExos = null;
var wPath = null;
var skill = false;

export default class EndWorkoutScreen extends Component {
    static navigationOptions = {
        header: null
      };
    constructor(props)
    {
        super(props);
        this.state = {
            exercises: [],
            path: "",
            doneExercises: [],
            muscleInvolvements: null,
            arrayItem: [],
            weight: 80,
            points: 0,
            percent: 75,
            lvl: 0
        };
    }

    componentWillReceiveProps() {

        const resetAction = StackActions.reset({
          index: 0,
          actions: [NavigationActions.navigate({ routeName: 'AllWorkoutsScreen' })],
        });
        this.props.navigation.dispatch(resetAction);
      }

      sendPostMessage(post) {
        var that = this;
        if (post == null){
            post = "2;3;2;3;3;3;4;2;4;0;1;1";
        }
        setTimeout(
            () => {
                that.webView.postMessage(post);
            },
        1000);
    }

    componentDidMount()
    {
        var that = this;
        var workout = this.props.navigation.getParam('workout', null);
        wPath = workout.path;
        wExos = workout.exercises;
        this.getUid().then(()=>{
            if (workout !== null)
            {
                that.setState({
                    exercises: workout.exercises,
                    path: workout.path
                });
            }
            var key = that.props.navigation.getParam('key', null);
            if (key != null)
            {
                that.loadFirebaseReps(workout, key);
            }
            if ((workout["skillPath"] != null) && (workout["skillPath"] != undefined)){
                skill = workout["skillPath"];
            }
        });

    }

    checkIfImprovementsSkills(reference, exos)
    {
        var oldReps = [];
        var reps = [];
        var bestReps = [];
        var currentLevel = null;
        var expectedReps = [];
        firebase.database().ref(reference).once('value', function(snapshot){
            var val = snapshot.val();
            currentLevel = val["level"];
            firebase.database().ref('skills/'+snapshot.key+"/Workout"+currentLevel+"/exercises").once('value', function(snap){
                var val2 = null;
                snap.forEach(function(child){
                    val2 = snap.val();
                    expectedReps.push(val2["reps"]);
                });
            }).then(()=>{
                oldReps = val["reps"];
                exos.forEach(function(exo){
                    reps.push(exo.reps);
                });
                for (var i = 0; i < exos.length; i++)
                {
                    bestReps.push((reps[i] > oldReps[i]) ? reps[i] : oldReps);
                }
                bestReps = [0, 0, 0, 0];
                var up = true; 
                for (var i = 0; i < 4; i++)
                {
                    try
                    {
                        if (reps[i] < expectedReps[i])
                        {
                            up = false;
                        }
                    }
                    catch(e)
                    {
                        up = false;
                        reps.push(0);
                    }
                }
                if (up)
                {
                    firebase.database().ref(reference).set({
                        level: currentLevel + 1,
                        reps: [0,0,0,0]
                    })
                }
                else
                {
                    firebase.database().ref(reference).child("bestReps")
                    .set(bestReps);
                }
            });
        });
    }

    modifyTraining()
    {
        var arr = this.state.arrayItem;
        var val = this.state.exercises;

        for (var i = 0; i < arr.length; i++)
        {
            if (arr[i].expectedReps + 3 <= arr[i].reps / arr[i].series)
            {
                if (arr[i].time >= 3)
                {
                    this.getMoreDifficultExercise(arr[i].muscles[0], arr[i].difficulty, i);
                    val[""+i].time = 0;
                }
                else
                {
                    val[""+i].time = val[""+i].time + 1;
                }
            }
            else if (arr[i].expectedReps - 3 > arr[i].reps / arr[i].series)
            {
                if (arr[i].time <= -3)
                {
                    this.getEasierExercise(arr[i].muscles[0], arr[i].difficulty, i);
                    val[""+i].time = 0;
                }
                else
                {
                    val[""+i].time = arr[i].time - 1;
                }
            }
        }
        //Modify database
        firebase.database().ref('/Profiles/'+uid+'/personal/exercises').set(val);
    }

    getEasierExercise(muscle, diff, i)
    {
        var d = diff;
        var e = wExos[i+""];
        var oldName = e["name"];
        e["name"] = "NTM";
        var first = true;
        var ref = firebase.database().ref('exercises/'+ muscle);
        ref.once('value', function(snapshot){
            snapshot.forEach(function(exo){
                var val = exo.val();
                if (exo.child('difficulty').val() <=  diff)
                {
                    if (first)
                    {
                        e["description"] = val["description"];
                        e["hold"]=val["hold"];
                        e["material"]=val["material"];
                        e["muscles"]=val["muscles"];
                        e["difficulty"]=val["difficulty"];
                        e["name"]=exo.key;
                        d = exo.child('difficulty').val();
                        first = false;
                    }
                    else
                    {
                        if (d <= exo.child('difficulty').val())
                        {
                            console.log("EVEN LOWER");
                            console.log(exo.key);
                            e["name"]=exo.key;
                            e["description"] = val["description"];
                            e["hold"]=val["hold"];
                            e["material"]=val["material"];
                            e["muscles"]=val["muscles"];
                            e["difficulty"]=val["difficulty"];
                            d = exo.child('difficulty').val();
                        }
                    }
                }
            });
            if (first)
            {
                e["name"] = oldName;
            }
            firebase.database().ref(wPath+'/exercises/' + i).set(e);  
        });
    }

    getMoreDifficultExercise(muscle, diff, i)
    {
        var d = diff;
        var e = wExos[i+""];
        var oldName = e["name"];
        e["name"] = "NTM";
        var first = true;
        var ref = firebase.database().ref('exercises/'+ muscle);
        ref.once('value', function(snapshot){
            snapshot.forEach(function(exo){
                var val = exo.val();
                if (exo.child('difficulty').val() >  diff)
                {
                    if (first)
                    {
                        e["description"] = val["description"];
                        e["hold"]=val["hold"];
                        e["material"]=val["material"];
                        e["muscles"]=val["muscles"];
                        e["difficulty"]=val["difficulty"];
                        e["name"]=exo.key;
                        d = exo.child('difficulty').val();
                        first = false;
                    }
                    else
                    {
                        if (d > exo.child('difficulty').val())
                        {
                            console.log("EVEN BETTER");
                            console.log(exo.key);
                            e["name"]=exo.key;
                            e["description"] = val["description"];
                            e["hold"]=val["hold"];
                            e["material"]=val["material"];
                            e["muscles"]=val["muscles"];
                            e["difficulty"]=val["difficulty"];
                            d = exo.child('difficulty').val();
                        }
                    }
                }
            });
            if (first)
            {
                e["name"] = oldName;
            }
            firebase.database().ref(wPath+'/exercises/' + i).set(e);  
        });
    }

    getUid = async () => {
        var that = this;
        try {
            uid = await AsyncStorage.getItem('uid', null);
            firebase.database().ref('/Profiles/'+uid+'/weight').once('value', function(snapshot)
            {
                that.setState({
                    weight: snapshot.val()
                })
            })
        } catch (error) {
            alert("Error");
        }
    };

    setLevelNxp()
    {
        var that = this;
        var xp = 0;
        firebase.database().ref('/Profiles/'+uid+'/xp').once('value', function (snapshot) {
            xp = snapshot.val();
        }).then(()=>{
            var lvl = 10;
            console.log('/Profiles/'+uid+'/xp');
            console.log(xp);
            if (30000 <= xp)
            {
                lvl = 8;
                start = 30000;
                end = 30000;
            }
            else if (22500 <= xp)
            {
                lvl = 7;
                start = 22500;
                end = 30000;
            }
            else if (20000 <= xp)
            {
                lvl = 6;
                start = 20000;
                end = 22500;
            }
            else if (15000 <= xp)
            {
                lvl = 5;
                start = 15000;
                end = 20000;
            }
            else if (10000 <= xp)
            {
                lvl = 4;
                start = 10000;
                end = 15000;
            }
            else if (7500 <= xp)
            {
                lvl = 3;
                start = 7500;
                end = 10000;
            }
            else if (4500 <= xp)
            {
                lvl = 2;
                start = 4500;
                end = 7500;
            }
            else if (2500 <= xp)
            {
                lvl = 1;
                start = 2500;
                end = 45000;
            }
            else
            {
                lvl = 0;
                start = 0;
                end = 2500;
            }

            lvl++;
            var percent = 1;

            if (xp < 30000)
            {
                percent = 100 * ((xp - start) / (end - start));
                console.log("PERCENT: "+ percent);
                console.log(lvl);
                
            }
            that.setState({
                percent: percent,
                lvl: lvl
            });
        });
    }

    calculatePoints(exos, key)
    {
        var points = 0;
        var d = 0;
        var t = 0;
        var w = 0;
        var r = 0;
        var arrName = ["Abs", "Back", "Biceps", "Butt", "Calves", "Chest", "Forearm", "Hamstrings", "Quadriceps", "Shoulders", "Trapezius", "Triceps"];
        var arrTot = [0,0,0,0,0,0,0,0,0,0,0,0];
        var muscleXp = [0,0,0,0,0,0,0,0,0,0,0,0];
        var exoXp = 0;
        exos.forEach(function(exo){
            let muscles = exo["muscles"];
            d = exo.difficulty;
            t = exo.tempo;
            w = exo.weight;
            r = exo.reps
            exoXp = 50 * d + t * 4 + 10 * (w / 80) + r;
            points = points + exoXp;
            muscles.forEach(function(m){
                for (var i = 0; i < arrName.length; i++)
                {
                  if (m == arrName[i])
                  {
                    arrTot[i] += 1;
                    muscleXp[i] += exoXp;
                  }
                }
            });
        });
        this.setState({
            points : points
        });
        var returnString = "";
        //Transform int to string
        for (var i =0; i < arrTot.length; i++)
        {
          returnString = returnString + arrTot[i] + ";";
        }
        returnString += "P";
        returnString.slice(0, -1);
        this.sendPostMessage(returnString);
        console.log("POINTS "+ points);
        //Add the gained xp to the training
        firebase.database().ref(key+'/points').set(points).then(()=>{
            console.log("ON A SET LES POINTS");
            this.setMuscleXp(muscleXp, arrName);
            //Add the gained xp to the users'
            firebase.database().ref('Profiles/'+ uid + "/xp").once('value', function(snapshot){
                points = snapshot.val() + points;
            }).then(()=>{
                firebase.database().ref('Profiles/'+ uid + "/xp").set(points).then(()=>{
                    this.setLevelNxp();
                });
            });
        });
    }

    setMuscleXp(arr, arrName)
    {
        var newObj = {};
        var previousXp = [];
        for (var i  = 0; i < arr.length; i++)
        {
            newObj[arrName[i]] = arr[i];
        }
        var ref = firebase.database().ref('Profiles/' + uid + '/muscleXp');
        ref.once('value', function(snap){
            if (snap.exists())
            {
                var index = 0;
                snap.forEach(function(child){
                    newObj[arrName[index]] += child.val();
                    previousXp.push(child.val());
                    index++;
                });
            }
        }).then(()=>{
            ref.set(newObj);
        });
    }

    combineWorkoutArrays(done)
    {
        var that = this;
        var finalArray = [];
        var i = 0;
        var goal = this.state.exercises;
        goal.forEach((e)=> {
            try
            {
                r = done[i].reps;

            }catch(e)
            {
                r = 0;
            }
            finalArray.push({
                name: e.name,
                reps: r,
                difficulty: e.difficulty,
                series: e.series,
                muscles: e.muscles,
                expectedReps: e.reps,
                time : e.time
            });
            i++;
        });
        this.setState({
            arrayItem: finalArray,
        }, ()=>{
            if (that.props.navigation.getParam('modif', false))
            {
                that.modifyTraining();
            }
        });

    }

    loadFirebaseReps(workout, key)
    {
        var that = this;
        firebase.database().ref(key).once('value', function(snapshot){
            var test = snapshot.val();
            console.log("AFTER");
            console.log(key);
            console.log(JSON.stringify(test));
            that.setState({
                doneExercises: test.exercises
            }, ()=>{
                that.combineWorkoutArrays(test.exercises);
                that.calculatePoints(test.exercises, key);
                if ((workout["skillPath"] != null) && (workout["skillPath"] != undefined))
                {
                    that.checkIfImprovementsSkills(skill, test.exercises);
                }
            });

        });
        
    }

    _renderItems = ({ item, index }) => (
        <View style={{flexDirection: 'row', justifyContent: 'space-between', margin: 10}}>
            <View style={{flexDirection: 'row'}}>
                <Text style={{fontWeight: 'bold'}}>
                    {Math.floor(item.reps / item.series)}
                </Text>
                <Image 
            source={require("../../imgs/green_triangle.png")} 
            style={{width: 20, height: 20, resizeMode: 'contain'}}/>
            </View>
            <Text>{item.name}</Text>
            <Text>{item.expectedReps}</Text>
            </View>
      );

  render() {
    return (
      <View style={{flex: 1, marginTop: '5%'}}>
      <View style={styles.pointSection}>
      <Text style={{color: 'white', fontSize: 40, fontWeight: 'bold'}}> {this.state.points} Points </Text>
      <Text style={{color: 'white'}}>Level {this.state.lvl}</Text>
      <ProgressBar progress={this.state.percent}/>
      </View>
      <View style={styles.bodySection}>
      <WebView
                    ref={( webView ) => this.webView = webView}
                    scalesPageToFit={false}
                    source={require("../Anatomy.html")}/>

      </View>
      <View style={styles.resumeSection}>
      <FlatList
                data={this.state.arrayItem}
                extraData={this.state.arrayItem}
                renderItem={this._renderItems}
                keyExtractor={(item, index) => index.toString()}
              />
      <Button
        title="CLOSE"
        color='black'
        onPress={()=> this.props.navigation.navigate('HomeScreen')} 
        />
      </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
    pointSection: {
        flex: 1,
        justifyContent : 'center',
        alignItems: 'center',
        backgroundColor: 'black'
    },
    bodySection: {
        flex: 2,
        backgroundColor: '#bfbfbf'
    },
    resumeSection: {
        flex: 3,
        backgroundColor: '#fff'
    }
});