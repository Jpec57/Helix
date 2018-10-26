import React from 'react';
import { StyleSheet, View, AsyncStorage, Button, BackHandler, Text } from 'react-native';
import { Container, Form, Input, Item, Label } from 'native-base';
import * as firebase from 'firebase';
import {
  createStackNavigator,
} from 'react-navigation';
var userData = null;

export default class LoginScreen extends React.Component {
  constructor(props) {
    super(props)
    this.state = ({
      email: '',
      password: ''
    });
    console.ignoredYellowBox = [
      'Setting a timer'
    ];
    BackHandler.addEventListener('hardwareBackPress', this._handleBackPress);

  }
  static navigationOptions = {
    header: () => null
  }

  _handleBackPress() {
    return true;
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this._handleBackPress);
  }

  navigateToScreen = (route) => () => {
    const resetAction = StackActions.reset({
      index: 0,
      key: null,
      actions: [NavigationActions.navigate({ routeName: route })],
    });
    this.props.navigation.dispatch(resetAction);
  }

  componentDidMount() {
    var that = this;
    firebase.auth().onAuthStateChanged(function (user) {
      userData = user;
      if (user) {
        // User is signed in
        try {
          AsyncStorage.setItem('uid', user.uid);
        } catch (error) {
          // Error saving data
          alert(error.toString())
        }
        finally {
          that.goToEdit();
        }
      }
    });
    Expo.ScreenOrientation.allow(Expo.ScreenOrientation.Orientation.PORTRAIT_UP);
  }

  goToEdit() {
    var that = this;
    firebase.database().ref('/Profiles/')
      .once('value', function (snapshot) {
        if (snapshot.hasChild(userData.uid)) {
          that.props.navigation.navigate('HomeScreen');
        }
        else {
          that.props.navigation.navigate('EditProfileScreen');
        }
      });
  }

  signUpUser = (email, password) => {

    if (this.state.password.length < 6) {
      alert("Password: please enter at least 6 characters")
      return;
    }
    try {
      firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
        alert(error.message);
      });
    }
    catch (error) {
      alert(error.toString())
    }
  }

  loginUser = (email, password) => {
    var that = this;
    try {
      firebase.auth().signInWithEmailAndPassword(email, password).then(function (user) {
        console.log(user)
        that.goToEdit();
      })
      .catch(function(error) {
        alert(error.message);
      });
    }
    catch (error) {
      alert(error.toString())
    }
  }

  async loginWithFacebook() {
    const { type, token } = await Expo.Facebook.logInWithReadPermissionsAsync('114667769402634', { permissions: ['public_profile', 'email', 'user_gender'] })
    if (type == 'success') {
      var that = this;
      const credential = firebase.auth.FacebookAuthProvider.credential(token)
      firebase.auth().signInWithCredential(credential)
        .then(() => {
          that.goToEdit();
        })
        .catch((error) => {
          alert(error.message)
        })
    }
  }
  render() {
    const { navigate } = this.props.navigation;
    return (
      <Container >
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'black' }}>
          <Text style={{ color: 'white', fontSize: 25 }}>HELIX</Text>
        </View>
        <View style={styles.container}>

          <Form>

            <Item floatingLabel>
              <Label>Email</Label>
              <Input
                autoCorrect={false}
                autoCapitalize="none"
                onChangeText={(email) => this.setState({ email })} />

            </Item>

            <Item floatingLabel>
              <Label>Password</Label>
              <Input
                secureTextEntry={true}
                autoCorrect={false}
                autoCapitalize="none"
                onChangeText={(password) => this.setState({ password })}
              />
            </Item>

            <View style={{ marginTop: '10%' }}>
              <Button
                onPress={() => this.loginUser(this.state.email, this.state.password)}
                title="Login"
                color="#b81717"
                accessibilityLabel="Login"
              />
            </View>

            <View style={{ marginTop: 20 }}>
              <Button
                onPress={() => this.signUpUser(this.state.email, this.state.password)}
                title="Sign Up"
                color="#b81717"
                accessibilityLabel="Sign Up"
              />
            </View>

            <View style={{ marginTop: 20 }}>
              <Button
                onPress={() => this.loginWithFacebook()}
                title="Login with Facebook"
                color="#b81717"
                accessibilityLabel="Login with Facebook"
              />
            </View>
          </Form>
        </View>

      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 5,
    backgroundColor: '#fff',
  },
});
