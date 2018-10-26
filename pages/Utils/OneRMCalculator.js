import React, { Component } from 'react';
import { View, Text, StyleSheet, FlatList, Dimensions, TextInput } from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;

var data = [{ reps: 1, p: 1.0 }, { reps: 2, p: 0.95 }, { reps: 3, p: 0.93 }, { reps: 4, p: 0.9 }, { reps: 5, p: 0.87 }, { reps: 6, p: 0.85 }, { reps: 7, p: 0.83 }, { reps: 8, p: 0.80 }, { reps: 9, p: 0.77 }, { reps: 10, p: 0.75 }];
export default class OneRMCalculator extends Component {
    constructor(props) {
        super(props);
        this.state = {
            one: 100,
        };
    }
//                <Text>{(item.p * this.state.one).toFixed(2)}</Text>

    _renderItems = ({ item, index }) => (
        <View style={{ flex: 1, flexDirection: 'row', margin: 10 }}>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ fontWeight: 'bold' }}>
                    {item.reps}
                </Text>
            </View>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <TextInput
                            style={{ height: 40, width: 50}}
                            value={this.state.one}
                            placeholder={((item.p * this.state.one).toFixed(2)).toString()}
                            keyboardType = 'numeric'
                            onChangeText={(text) => {
                                this.setState({
                                    one: text * (1/ item.p)
                                });
                            }}
        value={this.state.text}
                        />
            </View>
        </View>
    );

    render() {
        return (
            <View style={{ flex: 1 }}>
                <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ fontSize: 25 }}>1RM Calculator</Text>
                </View>
                <View style={{ alignItems: 'center', marginTop: '5%', marginBottom: '5%'}}>
                    <View style={{ backgroundColor: '#b81717', width: 100, padding: 10, alignItems: 'center' }}>
                        <Text style={{fontWeight: 'bold', color:'white'}}>1RM</Text>
                    </View>
                    <View style={{alignItems: 'center', justifyContent:'center', borderWidth: 1, borderColor: 'gray',width: 100}}>
                        <TextInput
                            style={{ height: 42, width: 50, marginLeft: 15}}
                            value={this.state.one}
                            placeholder={(this.state.one).toString()}
                            keyboardType = 'numeric'
                            onChangeText={(text) => {
                                this.setState({
                                    one: text
                                });
                            }}
        value={this.state.text}
                        />
    </View>
                </View>
                <View style={styles.table}>
                    <View style={styles.firstRow}>
                        <View style={styles.cell}>
                            <Text style={styles.firstRowContent}>Reps</Text>
                        </View>
                        <View style={styles.cell}>
                            <Text style={styles.firstRowContent}>Weight</Text>
                        </View>
                    </View>
                    <FlatList
                        data={data}
                        extraData={this.state}
                        renderItem={this._renderItems}
                        keyExtractor={(item, index) => index.toString()}
                    />
                </View>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
    },
    table: {
        flex: 1,
        borderWidth: 1,
        borderColor: 'black',
        margin: 15
    },
    firstRow: {
        flexDirection: 'row',
        backgroundColor: 'black',
        justifyContent: 'center',
        alignItems: 'center',
    },
    cell: {
        width: SCREEN_WIDTH * 0.4,
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    firstRowContent: {
        fontSize: 20,
        color: 'white',
    }
});