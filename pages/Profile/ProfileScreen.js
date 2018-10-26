import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, Button, FlatList, AsyncStorage, ScrollView, Dimensions, BackHandler, TouchableHighlight, WebView } from 'react-native';
import * as firebase from 'firebase';
import { ImagePicker } from 'expo';
import PopupDialog from 'react-native-popup-dialog';
import PopUpWindow from '../../components/PopUpWindow';
import { ViewPager } from 'rn-viewpager';
import GridView from 'react-native-gridview';
import renderIf from '../../node_modules/render-if';
import SearchBar from 'react-native-searchbar';


const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;
var uid = null;
var all = null;

export default class ProfileScreen extends Component {
    static navigationOptions = {
        title: 'Profile',
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
        console.disableYellowBox = true;
        this.state = {
            pseudo: "Jpec",
            title: "Battle-Hardened",
            xp: 0,
            height: 180,
            weight: 80,
            gender: "Male",
            age: 18,
            friendsUid: [],
            friends: [],
            minMuscle: null,
            maxMuscle: null,
            search: false,
            searchFriends: ["Sophie"]
        }
        this._handleBackPress = this._handleBackPress.bind(this);
        this._handleResults = this._handleResults.bind(this);
        this.sendPostMessage = this.sendPostMessage.bind(this);
        this._renderSearchFriends = this._renderSearchFriends.bind(this);
        BackHandler.addEventListener('hardwareBackPress', this._handleBackPress);
    }
    componentDidMount() {
        if (this.props.navigation.getParam('maj', null) != null) {
            this.forceUpdate();
        }
        this.getUid().then(() => {
            this.editProfile();
            this.setFriends();
            this.setSearchFriends();
        });
    }
    componentWillUnmount()
    {

    }

    getUid = async () => {
        try {
            uid = await AsyncStorage.getItem('uid', null);
        } catch (error) {
            alert(error);
        }
    };

    _handleBackPress() {
        this.props.navigation.navigate('HomeScreen');
        return true;
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this._handleBackPress);
    }

    chargeProfilePic() {
        var storageRef = firebase.storage().ref('Profiles/' + uid + '/lulu.jpg');
    }

    setFriends() {
        var friendsUid = [];
        var that =this;
        var friends = [];
        firebase.database().ref('Profiles/' + uid + '/friends').once('value', function (snapshot) {
            var val = snapshot.val();
            var i = 0;
            for (var prop in val) {
                friendsUid.push(val[prop]);
                firebase.database().ref('Profiles/'+friendsUid[i]+'/pseudo').once('value', function (snapshot) {
                    friends.push(snapshot.val());
                }).then(()=>{
                    that.setState({
                        friends: friends,
                        friendsUid: friendsUid
                    })
                });
                i++;
            }
        });
    }

    setSearchFriends()
    {
        var index = 0;
        var friends = [];
        firebase.database().ref('/Profiles').once('value', function(snapshot){
            snapshot.forEach(function(child){
                index++;
                var val = child.val();
                friends.push({uid: child.key, username: val["pseudo"]});
            });
        }).then(()=>{
            all = friends;
            this.setState({
                searchFriends: friends
            });
        });
    }

    selectTitle(xp) {
        var that = this;
        var currentLevel = 0;
        var titleFinal = "God of the holy dips";
        var first = true;
        firebase.database().ref('/titles').once('value', function (snapshot) {
            snapshot.forEach(function (titleObject) {
                var title = titleObject.val();
                if (first == true) {
                    if (xp < title.xp) {
                        currentLevel = title.xp;
                        titleFinal = titleObject.key;
                        condition = title.condition;
                        first = false;
                    }
                }
                else {
                    if (title.xp < currentLevel && xp < title.xp) {
                        currentLevel = title.xp;
                        titleFinal = titleObject.key;
                        condition = title.condition;
                    }
                }
            });
            that.setState({
                title: titleFinal
            });
        });
    }

    editProfile = async () => {
        {
            var that = this;
            firebase.database().ref('/Profiles/' + uid).on('value', function (snapshot) {
                var val = snapshot.val();
                var lastWeight = [];
                if (snapshot.child("weight").exists()) {
                    lastWeight = snapshot.child('weight').val();
                    lastWeight = lastWeight[Object.keys(lastWeight)[Object.keys(lastWeight).length - 1]];
                }
                that.setState({
                    pseudo: val.pseudo,
                    age: val.age,
                    height: val.height,
                    weight: lastWeight,
                    goal: val.goal,
                    gender: val.gender,
                    xp: val.xp,
                    love: val.love,
                });
                that.selectTitle(val.xp);
            });

        }
    }

    _pickImage = async () => {
        console.log("START");
        let result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            aspect: [4, 3],
        });

        if (!result.cancelled) {
            this.setState({ image: result.uri });
            console.log(result.uri);
        }
        else {
            console.log("FAILURE");
        }
    }

    sendPostMessage(post) {
        this.webView.postMessage(post);
    }

    onMessage(event) {
        var m = event.nativeEvent.data;
        //alert(m);
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
        var arrName = ["Abs", "Back", "Biceps", "Butt", "Calves", "Chest", "Forearm", "Hamstrings", "Quadriceps", "Shoulders", "Trapezius", "Triceps"];
        var min = 999999;
        var max = 0;
        var index = 0;
        var minMuscle = "";
        var maxMuscle = "";
        firebase.database().ref('Profiles/'+uid+'/muscleXp').once('value', function(s){
            var val = s.val();
            for (var prop in val) {
                if (min > val[prop])
                {
                    min = val[prop];
                    minMuscle = arrName[index]; 
                }
                if (max < val[prop])
                {
                    max = val[prop];
                    maxMuscle = arrName[index];
                }
                muscleString += (""+ that.getMuscleLvl(val[prop]) + ";");
                index++;
            }
            muscleString += "P";
        }).then(()=>{
            if (muscleString === "" || muscleString === "P")
            {
                muscleString = "0;0;0;0;0;0;0;0;0;0;0;0;P";
            }
            this.sendPostMessage(muscleString);
            this.setState({
                maxMuscle: maxMuscle,
                minMuscle: minMuscle
            });
        });
    }

    _handleResults(results) {
        this.setState({
            searchFriends: results
        });
      }

      _renderSearchFriends = ({ item, index }) => (
        <TouchableHighlight
          style={{
            padding: 5,
            borderWidth: 1,
            borderColor: 'black',
            backgroundColor: 'white'
          }}
          onPress={()=>{
              this.props.navigation.navigate('OtherProfile', { user: item["uid"] });
          }}>
          <Text>{item["username"]}</Text>
        </TouchableHighlight>
    
      );

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
            <ViewPager
                style={styles.viewPager}
                initialPage={0}>
                <View key="0" style={{ flex: 1}}>
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
                                <Text>Here are the badges (soon)</Text>
                                <TouchableHighlight onPress={() => {
                                    alert("SOON");
                                    //this.popupDialog.show()
                                }}>
                                    <Text>Reset your skills level (soon)</Text>
                                </TouchableHighlight>

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
                        <View style={{marginTop: 15, marginBottom: 15}}>
                            <Text>
                                HINT: You should focus on working more your {this.state.minMuscle} and less your {this.state.maxMuscle}.
                            </Text>
                        </View>

                        <Button
                            onPress={() => this.props.navigation.navigate('WeightControlScreen')}
                            title="Track your weight"
                            color="#b81717"
                            accessibilityLabel="Track your weight"
                        />
                        <Button
                            onPress={() => this.props.navigation.navigate('EditProfileScreen')}
                            title="Edit your profile"
                            color="#b81717"
                            accessibilityLabel="Edit your profile"
                        />
                    </ScrollView>
                    <PopupDialog
                        ref={(popupDialog) => { this.popupDialog = popupDialog; }}
                        dialogStyle={styles.popup}
                        containerStyle={{ zIndex: 10, elevation: 10 }}
                        width={0.8}
                        height={0.3}
                    >
                        <PopUpWindow
                            title="Reset your skill levels"
                            text="Are you sure you want to reset all your skill levels ? This cannot be undone"
                        />
                    </PopupDialog>
                </View>


                <View key="1" style={{ flex: 1 }}>
                    <View style={{ flex: 1, backgroundColor: 'black', justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold' }}>{this.state.pseudo}'s Friends</Text>
                    </View>
                    <View style={{ flex: 8 }}>
                    {renderIf(this.state.friends.length == 0 && this.state.search == false)(
                    <View style={{alignItems: 'center', justifyContent: 'center', margin: 20}}>
                    <Text style={{fontSize: 15}}>You don't have any friends for the moment. Why don't you look for one in the search bar ?</Text>
                    </View>
                    )}
                    {renderIf(this.state.search == false)(
                        <GridView
                        data={this.state.friends}
                        extraData={this.state}
                        dataSource={null}
                        itemsPerRow={3}
                        renderItem={(item, sectionID, rowID, itemIndex, itemID) => {
                            return (
                                <View style={styles.friendsContainer}>
                                    <TouchableHighlight
                                        onPress={() => {
                                            this.props.navigation.navigate('OtherProfile', {user: this.state.friendsUid[itemIndex]});
                                        }
                                    }>
                                        <View>
                                            <Image source={require("../../imgs/profil.png")} alt="profile_icon" style={{ width: (SCREEN_WIDTH / 4), height: (SCREEN_WIDTH / 4) }} />
                                            <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center', alignSelf: 'center' }}>
                                                <Text style={{
                                                    fontSize: 15,
                                                    alignSelf: 'center',
                                                    color: 'black',
                                                    fontWeight: 'bold',
                                                    textShadowColor: 'white',
                                                    textShadowOffset: { width: -1, height: 1 },
                                                    textShadowRadius: 5
                                                }}>{item}</Text>
                                            </View>
                                        </View>


                                    </TouchableHighlight>
                                </View>
                            );
                        }}
                    />
                    )}
                    {renderIf(this.state.search == true)(
                        <View>
                            <SearchBar
                        ref={(ref) => this.searchBar = ref}
                        data={all}
                        handleResults={this._handleResults}
                        allDataOnEmptySearch
                        hideBack={true}
                        showOnLoad
                    />
                    <View style={{marginTop: '20%'}}>
                        <Text>Looking for friends</Text>
<FlatList
                data={this.state.searchFriends}
                extraData={this.state}
                renderItem={this._renderSearchFriends}
                keyExtractor={(item, index) => index.toString()}
              />
</View>
</View>
                    )}
                    </View>
                    <View style={{flex: 2, backgroundColor: '#b81717'}}>
                    <TouchableHighlight onPress={()=>{
                        var old = this.state.search;
                        this.setState({
                            search: !old,
                        });
                    }}>
                    <View style={{width: '100%', height: '100%', justifyContent:'center', alignItems: 'center'}}>
                        <Text style={{fontSize: 15, fontWeight: 'bold', color:'white'}}>{this.state.search ? "Done searching" : "Search for friends"}</Text>
    
                    </View>
                        </TouchableHighlight>
</View>
                </View>
            </ViewPager>

        );
    }
}

const styles = StyleSheet.create({
    viewPager: {
        flex: 1,
        padding: 0,
        margin: 0,
    },
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
    popup: {
        alignItems: 'center',
        borderColor: 'black',
        borderRadius: 15
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
    friendsContainer: {
        maxWidth: SCREEN_WIDTH / 3,
        backgroundColor: '#b81717',
        borderWidth: 1,
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
        margin: 10,

    }
});