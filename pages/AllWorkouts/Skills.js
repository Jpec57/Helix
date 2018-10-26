import React from 'react';
import { StyleSheet, Text, View, Button, TouchableHighlight, BackHandler, FlatList} from 'react-native';
import { Container, Content, Header, Form, Input, Item, Label} from 'native-base';
import SkillWorkout from '../../components/SkillWorkout';
import * as firebase from 'firebase';

var key = null;
var keyW = null;

export default class SkillsScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        workouts: null,
        lvl: 1,
    };
  }

  componentDidMount() {
    var that = this;
    var workouts = this.props.navigation.getParam('workouts', null);
    key = this.props.navigation.getParam('key', null);
    keyW = this.props.navigation.getParam('keyW', null);
    this.createOrUpdatePersoSkills();
    this.updateWorkouts(workouts.workout);
    BackHandler.addEventListener('hardwareBackPress', this._handleBackPress);

  }

  _handleBackPress()
  {
    that.props.navigation.navigate('AllWorkoutsScreen');
    return true;
  }

  componentWillUnmount()
  {
    BackHandler.removeEventListener('hardwareBackPress', this._handleBackPress);
  }

  createOrUpdatePersoSkills()
  {
    var that = this;
    var lvl = 1;
    var rps = [0, 0, 0];
    var reps1 = 0;
    var reps2 = 0;
    var reps3 = 0;
    var reps4 = 0;
    var ref = firebase.database().ref(key);
    ref.once('value', function(skills){
      if (skills.hasChild(keyW))
      {
        lvl = skills.child(keyW).child("level").val();
        var repsObject = skills.child(keyW).child("reps").val();
        reps1 = repsObject["0"];
        reps2 = repsObject["1"];
        reps3 = repsObject["2"];   
        reps3 = repsObject["2"];      
      }
      else
      {
        ref.child(keyW).set({
          level: lvl,
          reps: rps
        });
      }
    }).then(()=>{
      that.setState({
        lvl: lvl,
        reps1: reps1,
        reps2: reps2,
        reps3: reps3,
        reps4: reps4,
      });
    });
  }

  updateWorkouts(w)
  {
    this.setState({workouts: w});
  }


  _renderSkills = ({ item, index }) => (
    <View>

    <SkillWorkout wName={item.name} 
    currentLevel={this.state.lvl > index ? true : false}
    workout={item}
    path = {key + keyW}
    exoNames={[item.exercises[0].name, item.exercises[1].name, item.exercises[2].name, item.exercises[3].name]}
    source={[require('../../imgs/dips.png'), require('../../imgs/dips.png'), require('../../imgs/dips.png'), require('../../imgs/dips.png')]}
    exoReps={[item.exercises[0].reps, item.exercises[1].reps, item.exercises[2].reps, item.exercises[3].reps]}
    progress={this.state.lvl == index + 1} />
        </View>
  );

  render() {
    return (
      <View style={styles.container}>
<View>
<FlatList
          data={this.state.workouts}
          extraData={this.state.workouts}
          renderItem={this._renderSkills}
          keyExtractor={(item, index) => index.toString()}
        />
</View>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: '5%',
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
});