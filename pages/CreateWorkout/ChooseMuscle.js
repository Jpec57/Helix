import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableHighlight, BackHandler, WebView, Image, Animated} from 'react-native';
import PopupDialog from 'react-native-popup-dialog';
import WorkoutAdvice from '../../components/WorkoutAdvice';

var workout = null;
var backHandler = 0;

export default class ChooseMuscleScreen extends Component {
    static navigationOptions  = ({navigation}) => {
        const {params = {}} = navigation.state;
        return{
            title: 'Choose a muscle',
            headerStyle: {
              backgroundColor: '#000000',
            },
            headerRight: <TouchableHighlight onPress={()=>{
                params.method();
            }}>
            <Animated.Image source={require('../../imgs/question_mark.png')} title="help" style={[{marginBottom: params.animatedQuestion},{height: 25, width: 25, marginRight: 15}]} />
            </TouchableHighlight>,
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
        };
    };

    constructor(props) {
        super(props);
        console.disableYellowBox = true;
        this.state = {
            muscle: "Chest",
            post: "0;0;0;0;0;0;0;0;0;0;0;0;",
            help: false,
            currentIndex: 0,
            animatedQuestion: new Animated.Value(0)
        };
        this.webView = null;
        //this.position = new Animated.Value(0);
        this.onMessage = this.onMessage.bind(this);
        this.toggleHelp = this.toggleHelp.bind(this);
        first = this.props.navigation.getParam('renderControl', false);
    }

    sendPostMessage() {
        var post = this.props.navigation.getParam("muscleInvolvements", "0;0;0;0;0;0;0;0;0;0;0;0;");
        this.webView.postMessage(post);
    }

    onMessage(event) {
        var m = event.nativeEvent.data;
        this.setState({
            muscle: m
        });
    }

    _animatedSpring()
    {
        Animated.timing(this.state.animatedQuestion, {
            toValue: {x: 0, y: 15},
            duration: 1000
          }).start(()=>{
            Animated.timing(this.state.animatedQuestion, {
                toValue: {x: 0, y: 0},
                duration: 1000
              }).start(()=>{
                this._animatedSpring();
              });
          });
    }

    componentDidMount() {
        first = this.props.navigation.getParam('renderControl', false);
        backHandler = this.props.navigation.getParam('backHandler', 0);
        workout = this.props.navigation.getParam('workout', null);
        var that = this;
        BackHandler.addEventListener('hardwareBackPress', function () {
            if (backHandler <= 0) {
                that.props.navigation.navigate('HomeScreen');
            }
            else {
                that.props.navigation.navigate('ResumeWorkoutScreen', { workout: workout, backHandler: (backHandler - 1) });
            }
            return true;
        });
        if (workout == null) {
            workout = {
                "name": "Enter a workout name",
                "exercises": [],
                "username": "Jpec",
                "muscles": [],
                "lastTime": 0,
                "material": [],
                "cycle": false,
                "description": "None",
                "points": 0,
                "visible": true,
                "love": 0,
            }
        }
        this.props.navigation.setParams({
            method: this.toggleHelp
        });
        Expo.ScreenOrientation.allow(Expo.ScreenOrientation.Orientation.PORTRAIT_UP);
        this._animatedSpring();
    }

    toggleHelp()
    {
        var newHelp = !this.state.help;
        this.setState({
            help: newHelp
        });
        if (newHelp)
        {
            this.popupDialog.show();
        }
        else 
        {
            this.popupDialog.dismiss();
        }
    }

    render() {
        const patchPostMessageFunction = () => {
            var originalPostMessage = window.postMessage;
            var patchedPostMessage = function(message, targetOrigin, transfer) {
              originalPostMessage(message, targetOrigin, transfer);
            };
      
            patchedPostMessage.toString = () => {
              return String(Object.hasOwnProperty).replace(
                'hasOwnProperty',
                'postMessage'
              );
            };
            window.postMessage = patchedPostMessage;
          };
      
          const patchPostMessageJsCode =
            '(' + String(patchPostMessageFunction) + ')();';
        return (

            <View style={{ flex: 1 }}>
                            <PopupDialog
            ref={(popupDialog) => { this.popupDialog = popupDialog; }}
            dialogStyle={styles.popup}
            onDismissed={()=>{this.setState({
                help: false
            })}}
            containerStyle={{ zIndex: 10, elevation: 10, marginTop: '-15%'}}
            width={0.9}
            height={0.8}
          >
          <WorkoutAdvice context={this}/>
                    </PopupDialog>
                <View style={styles.body}>
                <WebView
                    ref={( webView ) => this.webView = webView}
                    scalesPageToFit={false}
                    javaScriptEnabled={true}
                    dataDetectorTypes='all'
                    onLoadEnd={()=>this.sendPostMessage()}
                    injectedJavaScript={patchPostMessageJsCode}
                    source={require("../Anatomy.html")}
                    onMessage={this.onMessage} />
                </View>
                <View style={styles.footer}>
                    <TouchableHighlight
                        style={{ backgroundColor: 'red', padding: 10, borderColor: 'black', borderWidth: 1 }}
                        onPress={() => {
                            this.props.navigation.navigate('ChooseExerciseScreen', { workout: workout, muscle: this.state.muscle, backHandler: (backHandler + 1) })
                        }}>
                        <Text style={{ color: 'white', fontSize: 30 }}>Choose {this.state.muscle}</Text>
                    </TouchableHighlight>
                </View>
            </View >
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
        flex: 6,
    },
    footer: {
        backgroundColor: '#bfbfbf',
        flex: 2,
        alignItems: 'center',
        justifyContent: 'center',
    },
    popup: {
        borderColor: 'black',
        borderRadius: 15,
        padding: 10
      },
      imgBump: {

      }
});