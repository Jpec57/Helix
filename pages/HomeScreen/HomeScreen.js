import React from 'react';
import { StyleSheet, Text, View, Dimensions, Image, TouchableHighlight, FlatList, AsyncStorage, Platform, Vibration} from 'react-native';
import { Container, Content, Card, CardItem, Thumbnail } from 'native-base';
import { ViewPager } from 'rn-viewpager';
import {
  createStackNavigator,
} from 'react-navigation';
import renderIf from '../../node_modules/render-if';

import RoundButton from '../../components/roundButton';
import PopupDialog from 'react-native-popup-dialog';
import PopUpWindow from '../../components/PopUpWindow';
import * as firebase from 'firebase';
import { KeepAwake } from 'expo';


const SCREEN_HEIGHT = Dimensions.get("window").height;
const SCREEN_WIDTH = Dimensions.get("window").width;
var uid = null;
var loves = [];
var nbLoves = [];
var users = [];

const LOVE_IMGS = [
  require('../../imgs/heart_empty.png'),
  require('../../imgs/heart_full.png')
];
const IMGS = [
  { id: "1", uri: require('../../imgs/home.jpg') },
  { id: "2", uri: require('../../imgs/caution.jpg') },
]
export default class HomeScreen extends React.Component {
  static navigationOptions = {
    header: null
  };
  constructor(props) {
    super(props);
    this.getUid();
    thot = this;
    this.state = {
      username: 'None',
      selectedSet: 6,
      page: 1,
      communityWorkouts: [],
      loves: [],
      nbLoves: [],
      countdown: 25,
      showCountDown: false,
    }
    Expo.ScreenOrientation.allow(Expo.ScreenOrientation.Orientation.PORTRAIT_UP);
    console.disableYellowBox = true;
    Expo.Audio.setIsEnabledAsync(true);
  }

  componentDidMount() {
    this._activate();
  }

  _activate = () => {
    KeepAwake.activate();
  }

  _deactivate = () => {
    KeepAwake.deactivate();
  }

  componentWillUnmount() {
    this._deactivate();
  }

  getUid = async () => {
    try {
      uid = await AsyncStorage.getItem('uid', null);
      if (uid == null) {
        this.props.navigation.navigate('LoginScreen');
      }
    } catch (error) {
      alert(error);
    }
  };

  createOrGoToPersonalWorkout() {
    var that = this;
    var goal = null;
    var ref = firebase.database().ref('/Profiles/' + uid + "/personal");
    ref.once('value', function (snapshot) {
      var persoWorkout = null;
      if (snapshot.exists()) {

        persoWorkout = snapshot.val();
        persoWorkout["path"] = '/Profiles/' + uid + '/personal';
        //Test if goal hasn't changed 
        firebase.database().ref('Profiles/' + uid + '/goal').once('value', function (s) {
          goal = s.val();
        }).then(() => {
          if (goal != persoWorkout["goal"]) {
            that.setExoWithGoal(goal, persoWorkout);
          }
          else {
            that.props.navigation.navigate('ResumeWorkoutScreen', { workout: persoWorkout, modif: true });
          }
        });
      }
      else {
        firebase.database().ref('Profiles/' + uid + '/goal').once('value', function (s) {
          goal = s.val();
        }).then(() => {
          firebase.database().ref('baseWorkouts/0').once('value', function (snapshot) {
            persoWorkout = snapshot.val();
            persoWorkout["goal"] = goal;
            //Set exercises to match the user's goal
            that.setExoWithGoal(goal, snapshot.val());
          });
        });
      }
    });
  }

  setExoWithGoal(goal, workout) {
    var recomReps = 5;
    var recomRest = 90;
    if (goal == "Lose weight") {
      recomReps = 20;
      recomRest = 30;
    }
    else if (goal == "Gain weight") {
      recomReps = 10;
      recomRest = 60;
    }
    workout["exercises"].forEach(function (exo) {
      exo["reps"] = recomReps;
      exo["rest"] = recomRest;
      if (exo["time"] == undefined) {
        exo["time"] = 0;
      }
    });
    var ref = firebase.database().ref('/Profiles/' + uid + "/personal");
    ref.set(workout);
    this.props.navigation.navigate('ResumeWorkoutScreen', { workout: workout, modif: true });
  }

  componentDidMount() {
    this.loadCommunityWorkouts(true);
  }

  loadCommunityWorkouts(all) {
    var that = this;
    var j = -1;
    var commWorkouts = [];
    var friends = [];
    firebase.database().ref('Profiles/' + uid + '/friends').once('value', function (s) {
      var val = s.val();
      for (var prop in val) {
        friends.push(val[prop]);
      }
    }).then(() => {
      firebase.database().ref('/trainings').on('value', function (snapshot) {
        snapshot.forEach(function (child) {
          child.forEach(function (superchild) {
            superchild.forEach(function (object) {
              j++;
              var val = object.val();
              if (friends.length == 0 && all == true) {
                users.push(superchild.key)
                val["id"] = j;
                val["path"] = (Number.MAX_SAFE_INTEGER + val["lastTime"]) + '/' + superchild.key + '/' + object.key + '/';
                var r = firebase.database().ref('/Profiles/' + uid + '/love/' + val["path"]).once('value', function (s) {
                  s.exists() ? loves.push(true) : loves.push(false);
                });
                nbLoves.push(val["love"]);
                val["key"] = '/trainings/' + child.key + '/' + superchild.key + '/' + object.key;
                commWorkouts.push(val);
              }
              for (var i = 0; i < friends.length; i++) {
                if (superchild.key == friends[i] || all == true) {
                  users.push(superchild.key)
                  val["id"] = j;
                  val["path"] = (Number.MAX_SAFE_INTEGER + val["lastTime"]) + '/' + superchild.key + '/' + object.key + '/';
                  var r = firebase.database().ref('/Profiles/' + uid + '/love/' + val["path"]).once('value', function (s) {
                    s.exists() ? loves.push(true) : loves.push(false);
                  });
                  nbLoves.push(val["love"]);
                  val["key"] = '/trainings/' + child.key + '/' + superchild.key + '/' + object.key;
                  commWorkouts.push(val);
                }
              }
            });
          });
        });
        that.setState({
          communityWorkouts: commWorkouts,
          loves: loves,
          nbLoves: nbLoves
        });
      });
    });
  }

  addRemoveToLike(path, id) {
    this.setState({
      loves: loves
    });
    var ref = firebase.database().ref('/Profiles/' + uid + '/love/' + path);
    if (loves[id]) {
      ref.remove();
    }
    else {
      ref.set({
        love: 1,
      });
    }
    var previousLove = nbLoves[id];
    var ref2 = firebase.database().ref('trainings/' + path + "/love");
    loves[id] ? previousLove = previousLove + 1 : previousLove = previousLove - 1;
    nbLoves[id] = previousLove;
    ref2.set(previousLove);
    this.setState({
      nbLoves: nbLoves
    });
  }

  _renderCommunity = ({ item, index }) => (
    <Card>
      <CardItem >
        <TouchableHighlight style={{ flex: 1 }} onPress={() => {
          console.log("UID: " + users[index]);
          this.props.navigation.navigate('OtherProfile', { user: users[index] });
        }}>
          <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }}>
            <Thumbnail source={require('../../imgs/caution.jpg')} />
            <Text>{item.username}</Text>
            <Text note>{new Date(-1 * item.lastTime).toLocaleString()}</Text>
          </View>

        </TouchableHighlight>

      </CardItem>

      <CardItem cardBody>
        <View>
          <View style={{ width: 0.8 * SCREEN_WIDTH, height: 0.3 * SCREEN_HEIGHT, padding: 0 }}>
            <Image style={{ flex: -1, resizeMode: 'contain', marginLeft: '-30%', alignSelf: 'baseline' }} source={require('../../imgs/caution.jpg')} />

          </View>
          <TouchableHighlight
            style={{ padding: 10, justifyContent: 'center', alignItems: 'center' }}
            onPress={() => {
              var nom = item.name + " FROM " + item.username;
              this.props.navigation.navigate('ResumeWorkoutScreen2', { workout: item, wname: nom })
            }}>
            <Text style={{ margin: '5%' }}>
              {item.name}
            </Text>
          </TouchableHighlight>

        </View>
      </CardItem>
      <CardItem>
        <View style={{ flex: 1, flexDirection: 'row' }}>
          <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{ color: '#87838B' }}>
              {this.state.nbLoves[item.id]}
            </Text>
            <TouchableHighlight onPress={() => {
              if (loves[item.id] == false) {
                loves[item.id] = true;
                console.log("THIS LOVE: " + loves[item.id]);
              }
              else {
                loves[item.id] = false;
                console.log("THIS HATE: " + loves[item.id]);
              }
              this.addRemoveToLike(item.path, item.id);

            }}>
              <View>

                <Image source={LOVE_IMGS[this.state.loves[item.id] ? 1 : 0]}
                  style={{ marginLeft: 10, width: 30, height: 30 }}
                  key={this.state.loves[item.id]}
                />
              </View>

            </TouchableHighlight>
          </View>
          <View style={{ flex: 1, justifyContent: 'center' }}>

            <Text style={{ color: '#87838B', textAlign: 'right' }}>{item.points} POINTS</Text>
          </View></View>
      </CardItem>
    </Card>
  );

  launchCountDown(time) {
    var currentSet = this.state.selectedSet;
    if (currentSet > 1) {
      currentSet--;
    }
    else {
      currentSet = 6;
    }
    this.setState({
      selectedSet: currentSet,
      showCountDown: true,
      countdown: time
    }, this.setTimer());
  }

  resetTimer() {
    this.setState({
      showCountDown: false
    });
    clearInterval(myTimer);
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

  setTimer() {
    var that = this;
    myTimer = setInterval(function () {
      var newCountDown = that.state.countdown - 1;
      if (newCountDown == 3) {
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
      that.setState({
        countdown: newCountDown,
      });
      if (newCountDown == 0) {
        that.resetTimer();
      }
    }, 1000);
  }

  setSelectedSet(set) {
    this.setState({
      selectedSet: set,
    });
  }
  render() {
    const { navigation } = this.props;
    this.loadCountdown();
    return (
      <ViewPager
        ref={viewPager => { this.viewPager = viewPager; }}
        style={styles.viewPager}
        initialPage={this.props.navigation.getParam("page", this.state.page)}>

        <View
          key="0">

          <View style={{ flex: 1, backgroundColor: '#f0f0f0' }}>
            <View style={{ flex: 1, backgroundColor: '#f0f0f0', alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ fontSize: 30 }}>Quick Chronometer</Text>

            </View>
            <View style={{ flex: 1, backgroundColor: 'black', flexDirection: 'row', marginTop: '5%' }}>
              <TouchableHighlight onPress={() => { this.setSelectedSet(1) }} style={[styles.setBoxes, this.state.selectedSet == 1 ? { backgroundColor: '#b81717' } : {}]}>
                <Text style={styles.inSetBoxes}>1</Text>
              </TouchableHighlight>
              <TouchableHighlight onPress={() => { this.setSelectedSet(2) }} style={[styles.setBoxes, this.state.selectedSet == 2 ? { backgroundColor: '#b81717' } : {}]}>
                <Text style={styles.inSetBoxes}>2</Text>
              </TouchableHighlight>
              <TouchableHighlight onPress={() => { this.setSelectedSet(3) }} style={[styles.setBoxes, this.state.selectedSet == 3 ? { backgroundColor: '#b81717' } : {}]}>
                <Text style={styles.inSetBoxes}>3</Text>
              </TouchableHighlight>
              <TouchableHighlight onPress={() => { this.setSelectedSet(4) }} style={[styles.setBoxes, this.state.selectedSet == 4 ? { backgroundColor: '#b81717' } : {}]}>
                <Text style={styles.inSetBoxes}>4</Text>
              </TouchableHighlight>
              <TouchableHighlight onPress={() => { this.setSelectedSet(5) }} style={[styles.setBoxes, this.state.selectedSet == 5 ? { backgroundColor: '#b81717' } : {}]}>
                <Text style={styles.inSetBoxes}>5</Text>
              </TouchableHighlight>
              <TouchableHighlight onPress={() => { this.setSelectedSet(6) }} style={[styles.setBoxes, this.state.selectedSet == 6 ? { backgroundColor: '#b81717' } : {}]}>
                <Text style={styles.inSetBoxes}>6</Text>
              </TouchableHighlight>
            </View>
            <View style={{ flex: 4, backgroundColor: '#f0f0f0', margin: '2%' }}>
              {renderIf(this.state.showCountDown == false)(
                <View flex={1}>
                  <View style={styles.chronoContainer}>
                    <TouchableHighlight style={styles.chronoButton} onPress={() => { this.launchCountDown(25) }}>
                      <View>
                        <Text style={styles.chronoText}>25"</Text>
                      </View>
                    </TouchableHighlight>
                    <TouchableHighlight style={styles.chronoButton} onPress={() => { this.launchCountDown(60) }}>
                      <View>
                        <Text style={styles.chronoText}>1'</Text>
                      </View>
                    </TouchableHighlight>
                  </View>
                  <View style={styles.chronoContainer}>

                    <TouchableHighlight style={styles.chronoButton} onPress={() => { this.launchCountDown(90) }}>
                      <View>
                        <Text style={styles.chronoText}>1'30</Text>
                      </View>
                    </TouchableHighlight>
                    <TouchableHighlight style={styles.chronoButton} onPress={() => { this.launchCountDown(120) }}>
                      <View>
                        <Text style={styles.chronoText}>2'</Text>
                      </View>
                    </TouchableHighlight>
                  </View>
                  <View style={styles.chronoContainer}>
                    <TouchableHighlight style={styles.chronoButton} onPress={() => { this.launchCountDown(180) }}>
                      <View>
                        <Text style={styles.chronoText}>3'</Text>
                      </View>
                    </TouchableHighlight>
                    <TouchableHighlight style={styles.chronoButton} onPress={() => { this.launchCountDown(300) }}>
                      <View>
                        <Text style={styles.chronoText}>5'</Text>
                      </View>
                    </TouchableHighlight>

                  </View>
                </View>
              )}

              {renderIf(this.state.showCountDown == true)(
                <View style={{ flex: 1 }}>
                  <View style={{ flex: 3, alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ fontSize: 35 }}>{this.state.countdown}</Text>
                  </View>
                  <TouchableHighlight style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#b81717' }} onPress={() => { this.resetTimer() }}>
                    <Text style={{ color: 'white', fontSize: 25 }}>SKIP</Text>
                  </TouchableHighlight>
                </View>

              )}

            </View>
          </View>
        </View>

        <View
          key="1">

          <View style={{ flex: 1, backgroundColor: '#f0f0f0' }}>
            <Image
              source={require('../../imgs/home.jpg')}
              style={{ flex: 1, height: null, width: null, resizeMode: 'contain' }}
            ></Image>
          </View>
          <View style={styles.middleButton}>
            <RoundButton
              text="MY PROFILE"
              borderRadius={20}
              borderWidth={2}
              borderColor='black'
              backgroundColor='white'
              textStyle={styles.textButton}
              onPress={() => {
                this.props.navigation.navigate('ProfileScreen');
              }} />
          </View>
          <View style={{ flex: 2, padding: 10, marginTop: 15 }}>
            <View style={{ marginTop: '5%', marginBottom: '5%', justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ fontStyle: 'italic', fontSize: 25, marginLeft: '-10%' }}>
                "It never gets easier,</Text>
              <Text style={{ fontStyle: 'italic', fontSize: 25, marginLeft: '15%' }}>
                you just get better"</Text>
            </View>
            <View style={{ flex: 1, alignItems: 'center' }}>
              <View style={{ marginTop: '10%', marginBottom: '5%' }}>
                <Text style={{ fontSize: 20, fontStyle: 'italic', marginBottom: 10 }}>My personal workout:</Text>
                <RoundButton
                  text="WORKOUT"
                  borderColor='black'
                  backgroundColor='black'
                  borderWidth={2}
                  borderRadius={5}
                  textStyle={styles.secondButton}
                  onPress={() => { this.createOrGoToPersonalWorkout() }} />
              </View>
              <View style={{ marginTop: '5%' }}>
                <TouchableHighlight onPress={() => {
                  this.popupDialog.show()
                }}>
                  <View style={{ flexDirection: 'row' }}>
                    <Image source={require("../../imgs/exit.png")} style={{ width: 25, height: 25 }} />
                    <Text style={{ marginLeft: 10 }}>Log Out</Text>
                  </View>
                </TouchableHighlight>
              </View>
              <View style={{ flex: 1, marginTop: '10%', backgroundColor: '#CDCBC7', width: SCREEN_WIDTH, justifyContent: 'center', alignItems: 'center' }}>
                <RoundButton
                  text="ALL WORKOUTS"
                  borderColor='black'
                  backgroundColor='#CDCBC7'
                  borderWidth={0}
                  borderRadius={0}
                  textStyle={styles.textButton}
                  onPress={() => {
                    this.props.navigation.navigate('AllWorkoutsScreen');
                  }} /></View>
            </View>
          </View>
          <PopupDialog
            ref={(popupDialog) => { this.popupDialog = popupDialog; }}
            dialogStyle={styles.popup}
            containerStyle={{ zIndex: 10, elevation: 10 }}
            width={0.8}
            height={0.3}
          >
            <PopUpWindow
              title="Log Out"
              text="Do you really want to log out ?"
              yes={() => {
                var that = this;
                firebase.auth().signOut().then(function () {
                  AsyncStorage.removeItem('uid', () => { });
                  that.props.navigation.navigate('LoginScreen');
                }).catch(function (error) {
                  alert(error)
                });
              }}
              no={() => {
                this.popupDialog.dismiss();
              }}
            />
          </PopupDialog>
        </View>

        <View
          style={{ flex: 1 }}
          key="2">
          <Container>
            <Content>
              <View style={{ backgroundColor: 'black', padding: '5%', justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ color: 'white', fontSize: 30 }}>Community Workouts</Text>
              </View>
              <View style={{ flexDirection: "row" }}>
                <TouchableHighlight
                  style={{ padding: 10, flex: 1, backgroundColor: 'black', alignSelf: 'center' }}
                  onPress={() => {
                    this.loadCommunityWorkouts(true)
                  }}>
                  <Text style={{ fontSize: 18, color: 'white', alignSelf: 'center' }}>All</Text>
                </TouchableHighlight>
                <TouchableHighlight
                  style={{ padding: 10, flex: 1, backgroundColor: 'black' }}
                  onPress={() => {
                    this.loadCommunityWorkouts(false)
                  }}>
                  <Text style={{ fontSize: 18, color: 'white', alignSelf: 'center' }}>Friends</Text>
                </TouchableHighlight>
              </View>

              <FlatList
                data={this.state.communityWorkouts}
                extraData={this.state}
                renderItem={this._renderCommunity}
                keyExtractor={(item, index) => index.toString()}
              />

            </Content>
          </Container>
        </View>
      </ViewPager >
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',

  },
  viewPager: {
    flex: 1,
    padding: 0,
    margin: 0,
  },
  top: {
    backgroundColor: '#ff0000',
    flex: 0.3
  },
  topWidth: {
    flexDirection: 'row',
    flex: 1,
  },
  body: {
    flex: 0.7,
    alignItems: 'stretch',
    backgroundColor: '#000000'
  },
  textButton: {
    fontSize: 25,
  },
  secondButton: {
    color: 'white',
    fontSize: 25,
  },
  middleButton: {
    position: 'absolute',
    top: '28%',
    right: '15%',
    alignItems: 'center',
    left: '15%',
    padding: 5
  },
  icon: {
    width: 24,
    height: 24,
  },
  popup: {
    borderColor: 'black',
    borderRadius: 15
  },
  setBoxes: {
    flex: 1,
    margin: 10,
    borderWidth: 1,
    borderColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black'
  },
  inSetBoxes: {
    color: 'white',
    //fontWeight: 'bold',
    fontSize: 20
  },
  chronoContainer: {
    flexDirection: 'row',
    flex: 1,
  },
  chronoButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 5,
    backgroundColor: '#CDCBC7'
  },
  chronoText: {
    fontSize: 20
  }

});
