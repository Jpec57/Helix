import React from 'react';
import { StyleSheet, Text, FlatList, AsyncStorage, View, TouchableOpacity, Dimensions, TouchableHighlight, BackHandler, Image } from 'react-native';
import { Container, Content, Header, Icon, Body } from 'native-base';
import { ViewPager } from 'rn-viewpager';
import CustomHeader from '../../components/CustomHeader';

import SkillCard from '../../components/SkillCard';
import WorkoutNameListItem from '../../components/WorkoutNameListItem';
import * as firebase from 'firebase';
import PopUpWindow from '../../components/PopUpWindow';
import PopupDialog from 'react-native-popup-dialog';
import renderIf from '../../node_modules/render-if';
import DrawerContent from '../../components/DrawerContent';



var uid = null;
const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH = Dimensions.get('window').width;
var skillImgs= [require("../../imgs/back_lever.png"), require("../../imgs/front_lever.png"), require("../../imgs/muscle_up.png"), require("../../imgs/oap.png"), require("../../imgs/dips.png"), require("../../imgs/L-Sit.png")]

export default class AllWorkoutsScreen extends React.Component {
  static navigationOptions = {
    header: null
  };
  constructor(props) {
    super(props);
    console.ignoredYellowBox = [
      'Setting a timer'
    ];
    this.state = {
      toggleDrawer: false,
      filter: "FullBody",
      skillWorkouts: [],
      skillLevels: [],
      skillPercents: [],
      skillChoice: "FrontLever",
      workouts: [],
      perso: [],
      username: "Jpec",
      workoutFilter: [],
      uid: null,
    }
    this._handleBackPress = this._handleBackPress.bind(this);
    BackHandler.addEventListener('hardwareBackPress', this._handleBackPress);

  }

  componentDidMount() {
    this.chargeFilter();
    this.getUid();
    this.retrieveSkills();
    Expo.ScreenOrientation.allow(Expo.ScreenOrientation.Orientation.PORTRAIT_UP);
  }

  _handleBackPress() {
    this.props.navigation.navigate('HomeScreen');
    return true;
  }
  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this._handleBackPress);
  }
  getUid = async () => {
    try {
      uid = await AsyncStorage.getItem('uid', null);
      this.retrieveWorkouts();
    } catch (error) {
      alert("Error");
    }
  };

  /*
      FIREBASE METHODS
  */

  /*
    Retrieve all the available skills
  */

  retrieveSkills() {
    var that = this;
    var skillsRef = firebase.database().ref('skills/');
    var skillsArray = [];
    var sworkouts = [];
    skillsRef.once('value', function (skill) {
      skill.forEach(function (skillVal) {
        var skillName = skillVal.key;
        sworkouts = [];
        skillVal.forEach(function (w) {
          sworkouts.push(w.val());
        });
        skillsArray.push({ name: skillName, workout: sworkouts });
      });
      that.setState({ skillWorkouts: skillsArray });
      that.setSkillLevel();
    });
  }
  /*
    Retrieve the current level in each skill for the user and calculate his progress
  */

  async setSkillLevel() {
    //Retrieve the current level
    var levelArray = [];
    var wait = false;
    var ref = firebase.database().ref('/Profiles/' + uid + '/skills/');
    if (uid == null || uid == undefined) {
      this.props.navigation.navigate('LoginScreen');
    }

    ref.once('value', function (skill) {
      if (!skill.exists()) {
        wait = true;
      }
      else {
        skill.forEach(function (s) {
          var val = s.val();
          var lvlUnit = { name: s.key, reps: val["reps"], level: val["level"] };
          lvlUnit["expectedReps"] = { "0": 12, "1": 10, "2": 8 };
          levelArray.push(lvlUnit);
        });
      }
    }).then(() => {
      if (wait) {
        ref.set(
          {
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
        ).then(() => {
          ref.once('value', function (skill) {
            skill.forEach(function (s) {
              var val = s.val();
              var lvlUnit = { name: s.key, reps: val["reps"], level: val["level"] };
              lvlUnit["expectedReps"] = { "0": 12, "1": 10, "2": 8 };
              levelArray.push(lvlUnit);
            });
          }).then(
            () => this.other(levelArray)
          );

        });
      }
      else {
        this.other(levelArray);
      }
    });
  }


  other(levelArray) {
    var refs = [];
    for (var i = 0; i < levelArray.length; i++) {
      var l = JSON.stringify(levelArray[i]);
      var n = levelArray[i]["name"];
      var l = levelArray[i]["level"];
      refs.push('/skills/' + n + "/Workout" + l + "/exercises");
    }
    var expectedReps = null;
    var val = null;
    firebase.database().ref(refs[0]).once('value', function (snapshot1) {
      val = snapshot1.val();
      expectedReps = [val["0"]["reps"], val["1"]["reps"], val["2"]["reps"]];
      levelArray[0]["expectedReps"] = expectedReps;

    }).then(() => {
      firebase.database().ref(refs[1]).once('value', function (snapshot2) {
        val = snapshot2.val();
        expectedReps = [val["0"]["reps"], val["1"]["reps"], val["2"]["reps"]];
        levelArray[1]["expectedReps"] = expectedReps;
      }).then(() => {
        firebase.database().ref(refs[2]).once('value', function (snapshot3) {
          val = snapshot3.val();
          expectedReps = [val["0"]["reps"], val["1"]["reps"], val["2"]["reps"]];
          levelArray[2]["expectedReps"] = expectedReps;
        }).then(() => {
          firebase.database().ref(refs[3]).once('value', function (snapshot4) {
            val = snapshot4.val();
            expectedReps = [val["0"]["reps"], val["1"]["reps"], val["2"]["reps"]];
            levelArray[3]["expectedReps"] = expectedReps;
          }).then(() => {
            firebase.database().ref(refs[4]).once('value', function (snapshot5) {
              val = snapshot5.val();
              expectedReps = [val["0"]["reps"], val["1"]["reps"], val["2"]["reps"]];
              levelArray[4]["expectedReps"] = expectedReps;
            }).then(() => {
              firebase.database().ref(refs[5]).once('value', function (snapshot6) {
                val = snapshot6.val();
                expectedReps = [val["0"]["reps"], val["1"]["reps"], val["2"]["reps"]];
                levelArray[5]["expectedReps"] = expectedReps;
              }).then(() => {
                this.calculatePercentSkill(levelArray);
              });
            });
          });
        });
      });
    });
  }

  calculatePercentSkill(arr) {
    var sworkouts = this.state.skillWorkouts;
    var percent = 1;
    for (var i = 0; i < arr.length; i++) {
      arr[i]["workout"] = sworkouts[i]["workout"];
      percent1 = arr[i]["reps"][0] / arr[i]["expectedReps"][2];
      percent2 = arr[i]["reps"][1] / arr[i]["expectedReps"][2];
      percent3 = arr[i]["reps"][2] / arr[i]["expectedReps"][2];
      percent = (percent1 + percent2 + percent3) / 3;
      arr[i]["percent"] = percent;
    }
    this.setState({
      skillWorkouts: arr
    });

  }

  /*
    Retrieve all the pre made workouts and personal workouts
  */
  retrieveWorkouts = function () {
    var that = this;
    var workoutsRef = firebase.database().ref('/routines/' + this.state.filter);
    workoutsRef.on('value', function (snapshot) {
      var wArray = [];
      snapshot.forEach(w => {
        var val = w.val();
        wArray.push({
          name: val.name,
          exercises: val.exercises,
          username: val.username,
          muscles: val.muscles,
          lastTime: val.lastTime,
          material: val.material,
          cycle: val.cycle,
          description: val.description,
          points: val.points,
          path: '/routines/' + that.state.filter + '/' + w.key,
        });
      });
      that.setState({ workouts: wArray });
    });
    var perso = [];
    var persoRef = firebase.database().ref('/Profiles/' + uid + '/workouts/');
    persoRef.on('value', function (snapshot) {
      snapshot.forEach(w => {
        var val = w.val();
        perso.push({
          name: val.name,
          exercises: val.exercises,
          username: val.username,
          muscles: val.muscles,
          lastTime: val.lastTime,
          material: val.material,
          cycle: val.cycle,
          description: val.description,
          points: val.points,
          path: '/Profiles/' + uid + '/workouts/' + w.key
        });
      });
      that.setState({ perso: perso });
    });
  }

  /*
      FILTER METHODS
  */
  chargeFilter() {
    var that = this;
    var filtersArray = [];
    firebase.database().ref('/workoutFilters/')
      .once('value', function (snapshot) {
        snapshot.val().forEach(element => {
          filtersArray.push(element);
        });
      }).then(() => {
        that.setState({
          workoutFilter: filtersArray
        });
      });
  }

  setFilter(item) {
    var that = this;
    this.popupDialog.dismiss();
    this.setState({
      filter: item,
    }, () =>
        that.retrieveWorkouts()
    );
  }

  goToSkill(item) {
    this.props.navigation.navigate('SkillsScreen', { workouts: item, key: "Profiles/" + uid + "/skills/", keyW: item.name });
  }

  /*
  RENDERING METHODS FOR FLATLISTS
*/
  _renderSeparator = () => (
    <View style={{ height: 1, backgroundColor: "grey" }} />
  );

  _renderItem = ({ item }) => (
    <WorkoutNameListItem text={item.name} data={item}
    />
  );

  _renderSkills = ({ item, index }) => (
    <View>
      <TouchableHighlight
        onPress={() => this.goToSkill(item)}>
        <SkillCard source={skillImgs[index]} wName={item.name} level={item.level} progress={Math.floor(100 * item.percent)} />
      </TouchableHighlight>
    </View>
  );

  _renderList = ({ item, index }) => (
    <TouchableHighlight
      style={{
        padding: 5,
        borderWidth: 1,
        borderColor: 'black',
        backgroundColor: 'white'
      }}
      onPress={this.setFilter.bind(this, item)}>
      <Text>{item}</Text>
    </TouchableHighlight>

  );

  /*
  END RENDERING METHODS
  */

  render() {
    var popUp = this.state.popUp;
    return (
      <ViewPager
        style={styles.container}
        ref={viewPager => { this.viewPager = viewPager; }}
        initialPage={1}>

        <View
          style={styles.container}
          key="0">
          <Container>
            <CustomHeader title="Skills" context={this} onPress={() => {
              var old = this.state.toggleDrawer;
              this.setState({
                toggleDrawer: !old
              });
            }} />
            <View style={{ marginBottom: '5%' }}>

              <FlatList
                data={this.state.skillWorkouts}
                extraData={this.state.skillWorkouts}
                renderItem={this._renderSkills}
                keyExtractor={(item, index) => index.toString()}
              />
            </View>
          </Container>
          {renderIf(this.state.toggleDrawer == true)(
            <View style={{ flexDirection: 'row',  zIndex: 10,  width: SCREEN_WIDTH, height: SCREEN_HEIGHT }}>
              <DrawerContent viewPager={this.viewPager} context={this}></DrawerContent>
              <TouchableHighlight onPress={() => {
                this.setState({
                  toggleDrawer: false
                });
              }}>
                <View style={{ width: SCREEN_WIDTH * 0.25, height: SCREEN_HEIGHT }}>
                </View>
              </TouchableHighlight>
            </View>
          )}
        </View>

        <View
          style={styles.container}
          key="1">

          <Container>
            <CustomHeader title="Routines" onPress={() => {
              var old = this.state.toggleDrawer;
              this.setState({
                toggleDrawer: !old
              });
            }} />

            <TouchableHighlight
              style={styles.head}
              onPress={() => this.popupDialog.show()}>
              <View style={{ padding: 10 }} >
                <Text
                  style={styles.content}>
                  {this.state.filter}
                </Text>
              </View>
            </TouchableHighlight>
            <View>
              <FlatList
                data={this.state.workouts}
                extraData={this.state.workouts}
                renderItem={this._renderItem}
                ItemSeparatorComponent={this._renderSeparator}
                keyExtractor={(item, index) => index.toString()}
              />
            </View>

          </Container>

          {renderIf(this.state.toggleDrawer == true)(
            <View style={{ flexDirection: 'row',  zIndex: 10,width: SCREEN_WIDTH, height: SCREEN_HEIGHT }}>
              <DrawerContent viewPager={this.viewPager} context={this}></DrawerContent>
              <TouchableHighlight onPress={() => {
                this.setState({
                  toggleDrawer: false
                });
              }}>
                <View style={{ width: SCREEN_WIDTH * 0.25, height: SCREEN_HEIGHT }}>
                </View>
              </TouchableHighlight>
            </View>
          )}

          <PopupDialog
            ref={(popupDialog) => { this.popupDialog = popupDialog; }}
            dialogStyle={styles.popup}
            containerStyle={{ zIndex: 10, elevation: 10 }}
            width={0.8}
            height={0.5}
          >
            <PopUpWindow
              title="Choose a muscle to filter the workouts"
              content={
                <View>
                  <FlatList
                    style={{ marginTop: '5%', marginBottom: '5%' }}
                    data={this.state.workoutFilter}
                    ItemSeparatorComponent={this._renderSeparator}
                    renderItem={this._renderList}
                    keyExtractor={(item, index) => index.toString()}
                  />
                </View>
              }
            />
          </PopupDialog>
        </View>

        <View
          style={styles.container}
          key="2">
          <Container>
            <CustomHeader title="Personal" onPress={() => {
              var old = this.state.toggleDrawer;
              this.setState({
                toggleDrawer: !old
              });
            }} />
            <TouchableHighlight
              style={styles.head}
              onPress={() => { this.props.navigation.navigate('ChooseMuscleScreen', { renderControl: true }) }}>
              <View style={{ padding: 10 }} >
                <Text
                  style={styles.content}>
                  CREATE A WORKOUT
                </Text>
              </View>
            </TouchableHighlight>

            <View>
              <FlatList
                data={this.state.perso}
                extraData={this.state.perso}
                ItemSeparatorComponent={this._renderSeparator}
                renderItem={this._renderItem}
                keyExtractor={(item, index) => index.toString()}
              />
            </View>

          </Container>
          {renderIf(this.state.toggleDrawer == true)(
            <View style={{ flexDirection: 'row', width: SCREEN_WIDTH, height: SCREEN_HEIGHT }}>
              <DrawerContent viewPager={this.viewPager} context = {this}></DrawerContent>
              <TouchableHighlight onPress={() => {
                this.setState({
                  toggleDrawer: false
                });
              }}>
                <View style={{ width: SCREEN_WIDTH * 0.25, height: SCREEN_HEIGHT }}>
                </View>
              </TouchableHighlight>
            </View>
          )}
        </View>
      </ViewPager>

    );
  }
}

const styles = StyleSheet.create({

  drawerHeader: {
    height: 200,
    backgroundColor: 'white'
  },
  drawerImage: {
    height: 150,
    width: 150,
    borderRadius: 75
  },
  item: {
    flex: 1,
    flexDirection: 'row',
    marginLeft: '10%'
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  head: {
    alignItems: 'center',
    padding: 5,
    backgroundColor: 'black'
  },
  content: {
    color: 'white',
    fontSize: 30,
    fontWeight: 'bold',
  },
  icon: {
    width: 24,
    height: 24,
  },
  button: {
    marginBottom: 30,
    width: 260,
    alignItems: 'center',
    backgroundColor: '#2196F3'
  },
  buttonText: {
    padding: 20,
    color: 'white'
  },
  itemList: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'red',
  },
  popup: {
    borderColor: 'black',
    borderRadius: 15
  },
});
