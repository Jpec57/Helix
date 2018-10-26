import React, { Component } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import ProgressBar from './ProgressBar';

export default class SkillCard extends Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    }
    render() {
        return (
            <View style={{ flex: 1, backgroundColor: '#fff', margin: '2%' }}>
                <View style={styles.header}>
                    <Text style={{color: 'white'}}>{this.props.wName}</Text>
                </View>
                <View style={styles.body}>
                    <Image
                        source={this.props.source}
                        style={{
                            resizeMode: 'contain',
                            maxWidth: 100,
                            maxHeight: 100,
                        }}
                    />
                    <View style={{ flex: 1 }}>
                        <View style={{flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginRight: 10, marginLeft: 10}}>
                        <Text>Level {this.props.level}/5</Text>
                        <Text>{this.props.progress}%</Text>
                        </View>
                        <View style={{marginBottom: '5%'}}>
                        <ProgressBar progress={this.props.progress}></ProgressBar>
                        </View>
                    </View>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    header: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'black',
        padding: 5,
    },
    body: {
        flex: 4,
        flexDirection: 'row',
    }
});
