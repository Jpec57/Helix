import React, { Component } from 'react';
import { View, Text, StyleSheet, AsyncStorage, Button, TextInput, BackHandler} from 'react-native';
import { VictoryLine, VictoryChart, VictoryTheme, VictoryAxis } from "victory-native";
import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from 'react-native-simple-radio-button';
import * as firebase from 'firebase';

var uid = null;
var month = 5;
var semester = 15;
var year = 30;
var that = null;

export default class WeightControlScreen extends Component {
    constructor(props) {
        super(props);
        console.ignoredYellowBox = [
            'Setting a timer'
        ];
        this.state = {
            weight: "80",
            weightArray: [],
            mode: "Locale",
            data: [
                { x: 1, y: 2 },
                { x: 2, y: 3 },
                { x: 3, y: 5 },
                { x: 4, y: 4 },
                { x: 5, y: 7 }
            ],
        };
        this._handleBackPress = this._handleBackPress.bind(this);
        
    }

    componentDidMount() {
        that = this;
        this.getUid();
        BackHandler.addEventListener('hardwareBackPress', this._handleBackPress);

    }

    _handleBackPress()
    {
        this.props.navigation.navigate('ProfileScreen');
        return true;
    }

    componentWillUnmount(){
        BackHandler.removeEventListener('hardwareBackPress', this._handleBackPress);
      }

    getUid = async () => {
        try {
            uid = await AsyncStorage.getItem('uid', null);
            this.setView(month);
        } catch (error) {
            alert("Error " + error);
        }
    };

    setView(val) {
        var x, y;
        var weightArray = [];
        firebase.database().ref('Profiles/' + uid + '/weight').limitToLast(val).on('value', function (snapshot) {
            snapshot.forEach(function (w) {

                x = w.key;
                y = w.val();
                weightArray.push({
                    x: new Date(+x).toLocaleDateString(),
                    y: y
                });
            });

            that.setState({
                data: weightArray,
                weightArray: snapshot.val()
            });
        });
    }

    updateWeight() {
        firebase.database().ref('Profiles/' + uid + '/weight/' + Math.floor(Date.now())).set(parseInt(that.state.weight));
    }

    render() {
        return (
            <View style={styles.container}>
                <Text style={{ fontSize: 25 }}>Weight Tracker</Text>
                <VictoryChart width={350} theme={VictoryTheme.material}>
                    <VictoryAxis
                        style={{
                            axis: { stroke: '#000' },
                            axisLabel: { fontSize: 16 },
                            ticks: { stroke: '#000' },
                            grid: { stroke: '#B3E5FC', strokeWidth: 0.25 }
                        }} dependentAxis
                    />
                    <VictoryAxis
                        style={{
                            axis: { stroke: '#000' },
                            axisLabel: { fontSize: 16 },
                            ticks: { stroke: '#000' },
                            tickLabels: { fontSize: 12, padding: 1, angle: 45, verticalAnchor: 'middle', textAnchor: 'start' }
                        }}
                    />


                    <VictoryLine
                        style={{
                            tickLabels: { fontSize: 5, padding: 1, angle: 45, verticalAnchor: 'middle', textAnchor: 'start' },
                            data: {
                                stroke: "#c43a31", strokeWidth: 3
                            }
                        }}
                        data={this.state.data}
                    />
                </VictoryChart>
                <View style={styles.precision}>
                <Text style={{fontWeight: 'bold'}}>Select a precision: </Text>
                <RadioForm
          radio_props={[
            {label: 'Locale', value: 'Locale' },
            {label: 'Intermediate', value: 'Itermediate' },
            {label: 'Large', value: 'Large' },
          ]}
          initial={0}
          buttonSize={15}
          formHorizontal={true}
          onPress={(value) => {
              this.setState({mode: value});
              if (value == "Locale") {
                this.setView(month);
            }
            else if (value == "Intermediate") {
                this.setView(semester);
            }
            else {
                this.setView(year);
            }
            }}
        />

                </View>
                
                <View style={{ marginTop: '5%' }}>
                    <Text style={{fontWeight: 'bold'}}>Enter a new weight: </Text>
                    <View style={{ flexDirection: 'row', justifyContent:'center', alignItems: 'center' }}>
                        <TextInput
                            style={{ margin: 5, height: 40, width: 40, marginTop:10 }}
                            onChangeText={(text) => this.setState({ weight: text + "" })}
                            value={this.state.weight}
                        />
                        <Text style={{marginTop: 10}}>kgs</Text>

                    </View>

                </View>

                <Button
                    title="Update your weight"
                    color="#b81717"
                    onPress={this.updateWeight} />
            </View>
        );
    }
}



const styles = StyleSheet.create({
    container: {
        flex: 0.75,
        marginTop: '5%',
        alignItems: "center",
        backgroundColor: "#f5fcff"
    },
    precision: {
        borderColor: "grey",
        borderRadius: 10,
        borderWidth: 1,
        padding: 10
    }
});
