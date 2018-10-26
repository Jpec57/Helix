import React, { Component } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, BackHandler, TouchableHighlight, Image, WebView, AsyncStorage} from 'react-native';
import * as firebase from 'firebase';
const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;
var uid = null;

export default class OtherProfile extends Component {
    constructor(props) {
        super(props);
        console.ignoredYellowBox = [
            'Setting a timer'
        ];
        this.getUid();
        var u = this.props.navigation.getParam('user', null);
        this.retrieveUserData(u);
        this.state = {
            pseudo: "Friend",
            title: "Battle-Hardened",
            xp: 0,
            height: 180,
            weight: 80,
            gender: "Male",
            age: 18,
            user: u,
            friends: ["Jpec"]
        }
        this._handleBackPress = this._handleBackPress.bind(this);
        BackHandler.addEventListener('hardwareBackPress', this._handleBackPress);
    }

    getUid = async () => {
        try {
          uid = await AsyncStorage.getItem('uid', null);
          if (uid == null)
          {
            this.props.navigation.navigate('LoginScreen');
          }
        } catch (error) {
          alert(error);
        }
      };

      sendPostMessage(post) {
          console.log(post);
        this.webView.postMessage(post);
    }

      getMuscleLvl(val)
      {
          if (val < 50)
          {
              return (0);
          }
          else if (50 <= val && val < 100)
          {
              return (1);
          }
          else if (100 <= val && val < 150)
          {
              return (2);
          }
          else if (150 <= val && val < 200)
          {
              return (3);
          }
          else
          {
              return (4);
          }
      }
  
      setMuscleColors()
      {
          var that = this;
          var muscleString = "";
          var index = 0;
          console.log(this.state.user);
          firebase.database().ref('Profiles/'+this.state.user+'/muscleXp').once('value', function(s){
              var val = s.val();
              for (var prop in val) {
                    console.log("SING ALONG");
                  muscleString += (""+ that.getMuscleLvl(val[prop]) + ";");
                  index++;
              }
              muscleString += "P";
          }).then(()=>{
              console.log("-------");
              console.log(muscleString);
              console.log("-------");
  
              if (muscleString === "" || muscleString === "P")
              {
                  muscleString = "0;0;0;0;0;0;0;0;0;0;0;0;P";
              }
              this.sendPostMessage(muscleString);
          });
      }
    

    _handleBackPress() {
        this.props.navigation.navigate('HomeScreen');
        return true;
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this._handleBackPress);
    }

    retrieveUserData(uid) {
        var that = this;
        firebase.database().ref('Profiles/' + uid).once('value', function (snapshot) {
            var val = snapshot.val();
            var weight = 80;
            if (snapshot.child("weight").exists()){
                weight = val["weight"]["0"];
            }
            that.setState({
                pseudo: val["pseudo"],
                title: "Battle-Hardened",
                xp: val["xp"],
                height: val["height"],
                weight: weight,
                gender: val["gender"],
                age: 18,
            });
        });
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
            <View style={{ flex: 1, marginTop: '5%' }}>
                <View style={{ backgroundColor: 'black', height: 0.3 * SCREEN_HEIGHT }}>
                    <View style={styles.center}>
                        <Text style={[styles.title, { fontSize: 25 }]}>{this.state.pseudo}</Text>

                        <TouchableHighlight
                            onPress={this._pickImage}>
                            <View style={{ borderRadius: 15, backgroundColor: '#fff', margin: 10 }}>
                                <Image
                                    style={{ height: 100, width: 100, resizeMode: 'contain' }}
                                    source={require('../../imgs/haltere.png')}
                                />
                            </View>

                        </TouchableHighlight>
                        <Text style={styles.title}>- {this.state.title} -</Text>
                        <Text style={styles.title}>{this.state.xp}xp</Text>
                    </View>
                </View>
                <View style={styles.addFriend}>
                    <TouchableHighlight onPress={() => {
                        var f = this.state.user;
                        var friends = [];
                        var already = false;
                        var ref = firebase.database().ref('Profiles/'+ uid + '/friends');
                        ref.once('value', function(snapshot){
                            if (snapshot.exists())
                            {
                                friends = Object.values(snapshot.val());
                                for (var i = 0; i < friends.length; i++)
                                {
                                    if (friends[i] == f)
                                    {
                                        friends.pop(i);
                                        already = true;
                                    }
                                }
                            }
                            if (!already)
                            {
                                friends.push(f);
                            }
                        }).then(()=>{
                            ref.set(friends);
                        });
                        }}>
                        <Image source={require("../../imgs/profil.png")} alt="addFriend" style={{width: 50, height: 50}}/>
                    </TouchableHighlight>
                </View>

                <ScrollView style={styles.scrollView}>
                    <View style={styles.container}>

                        <Text style={{ fontWeight: 'bold' }}>Personal Data</Text>
                        <View style={styles.container}>
                            <Text>Height: {this.state.height}cm</Text>
                            <Text>Weight : {this.state.weight}kgs</Text>
                            <Text>Gender: {this.state.gender}</Text>
                            <Text>Age: {this.state.age}</Text>

                        </View>
                        <Text style={{ fontWeight: 'bold' }}>Skills</Text>
                        <View style={styles.container}>
                            <Text>Here are the badges</Text>

                        </View>
                    </View>

                    <View style={styles.web}>
                    <WebView
                                ref={(webView) => this.webView = webView}
                                scalesPageToFit={false}
                                injectedJavaScript={patchPostMessageJsCode}
                                scrollEnabled={false}
                                onLoadEnd={()=>this.setMuscleColors()}
                                source={require("../Anatomy.html")}
                                onMessage={this.onMessage} />
                    </View>
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    center: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        margin: '5%'
    },
    title: {
        color: 'white'
    },
    scrollView: {
        height: 0.6 * SCREEN_HEIGHT,
        width: SCREEN_WIDTH,
    },
    web: {
        margin: -10,
        height: SCREEN_WIDTH,
        width: SCREEN_WIDTH,
    },
    addFriend: {
        alignSelf: 'flex-end',
        alignItems: 'center',
        marginTop: -25,
        backgroundColor: 'red',
        padding: 10,
        width: 50,
        height: 50,
        borderRadius: 15,
        marginRight: 10,
        justifyContent: 'center'
    }
});