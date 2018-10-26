import React from 'react';
import { StyleSheet, Text, View} from 'react-native';
import * as firebase from 'firebase';
import HomeScreen from './pages/HomeScreen/HomeScreen';
import LoginScreen from './pages/LoginScreen/LoginScreen';
import AllWorkoutsScreen from './pages/AllWorkouts/AllWorkouts';
import InWorkoutScreen from './pages/AllWorkouts/InWorkout';
import SkillsScreen from './pages/AllWorkouts/Skills';
import ResumeWorkoutScreen from './pages/AllWorkouts/ResumeWorkout';
import InExerciseScreen from './pages/AllWorkouts/InExercise';
import ResumeWorkoutScreen2 from './pages/CreateWorkout/ResumeWorkout';
import ChooseMuscleScreen from './pages/CreateWorkout/ChooseMuscle';
import CompleteExerciseScreen from './pages/CreateWorkout/CompleteExercise';
import ChooseExerciseScreen from './pages/CreateWorkout/ChooseExercise';
import ProfileScreen from './pages/Profile/ProfileScreen';
import OtherProfile from './pages/Profile/OtherProfile';
import WeightControlScreen from './pages/Profile/WeightControlScreen';
import EditProfileScreen from './pages/Profile/EditProfileScreen';
import EndWorkoutScreen from './pages/AllWorkouts/EndWorkout';
import NewScreen from './pages/NewScreen';
import RankingScreen from './pages/Profile/Ranking';
import OneRMCalculator from './pages/Utils/OneRMCalculator';
import {createStackNavigator} from 'react-navigation'

const firebaseConfig = {
  apiKey: "AIzaSyC2fYoFpCw5QWvzFb_cMxAK6mnHxxLgs9U",
  authDomain: "jpecapp57.firebaseapp.com",
  databaseURL: "https://jpecapp57.firebaseio.com",
  projectId: "jpecapp57",
  storageBucket: "jpecapp57.appspot.com",
  messagingSenderId: "675470854771"
};

firebase.initializeApp(firebaseConfig);


class App extends React.Component {
  render() {
    return (
      <RootNavigator {...this.props}/>
    );
  }
}

export default RootNavigator =  createStackNavigator({
  RankingScreen: {
    screen: RankingScreen
  },
  LoginScreen: {
    screen: LoginScreen
  },
  AllWorkoutsScreen: {
    screen: AllWorkoutsScreen
  },
  ProfileScreen: {
    screen: ProfileScreen
  },
  OneRMCalculator: {
    screen: OneRMCalculator
  },
  HomeScreen: {
    screen: HomeScreen
  },
  ChooseMuscleScreen: {
    screen: ChooseMuscleScreen,
  },
  CompleteExerciseScreen : {
    screen: CompleteExerciseScreen,
  },
  WeightControlScreen: {
    screen: WeightControlScreen
  },
  EditProfileScreen: {
    screen: EditProfileScreen
  },
  OtherProfile: {
    screen: OtherProfile
  },
  NewScreen: {
    screen: NewScreen,
  },
  EndWorkoutScreen: {
    screen: EndWorkoutScreen
  },
  ChooseExerciseScreen: {
    screen: ChooseExerciseScreen,
  },
  ResumeWorkoutScreen2: {
    screen: ResumeWorkoutScreen2,
  },
  InExerciseScreen : {
    screen: InExerciseScreen,
  },
  InWorkoutScreen: {
    screen: InWorkoutScreen
  },
  ResumeWorkoutScreen: {
    screen: ResumeWorkoutScreen
  },
  SkillsScreen: {
    screen: SkillsScreen,
  },
},
)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
});
