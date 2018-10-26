import React, { PureComponent } from 'react';
import {withNavigation} from 'react-navigation';

import { View, Text, Image, StyleSheet, Dimensions, ScrollView, Button} from 'react-native';
const SCREEN_WIDTH = Dimensions.get("window").width;

class SkillWorkout extends React.PureComponent {
    goTrain(w)
    {
        console.log("PATH: "+ this.props.path);
        if (this.props.progress)
        {
            w["skillPath"] = this.props.path;

        }
        console.log(JSON.stringify(w));
        this.props.navigation.navigate('ResumeWorkoutScreen', {workout: w, skill: this.props.progress})
    }

    render() {
        const {navigation } = this.props;
        return (
            <View style={{ flex: 1, backgroundColor: this.props.currentLevel ? '#fff' : '#8F8E8D', margin: '2%' }}>
                <View style={styles.header}>
                    <Text style={{ color: 'white' }}>{this.props.wName}</Text>
                </View>
                <View style={styles.body}>
                    <ScrollView horizontal={true}>
                        <View style={styles.imgs}>
                            <View style={styles.center}>
                                <Text style={styles.exoName}>{this.props.exoNames[0]}</Text>
                            </View>
                            <Image
                                source={this.props.source[0]}
                                style={styles.img}
                            />
                            <View style={styles.center}>
                                <Text style={styles.reps}>3 * {this.props.exoReps[0]}</Text>
                            </View>
                        </View>
                        <View style={styles.imgs}>
                            <View style={styles.center}>
                                <Text style={styles.exoName}>{this.props.exoNames[1]}</Text>
                            </View>
                            <Image
                                source={this.props.source[1]}
                                style={styles.img}
                            />
                            <View style={styles.center}>
                                <Text style={styles.reps}>3 * {this.props.exoReps[1]}</Text>
                            </View>
                        </View>
                        <View style={styles.imgs}>
                            <View style={styles.center}>
                                <Text style={styles.exoName}>{this.props.exoNames[2]}</Text>
                            </View>
                            <Image
                                source={this.props.source[2]}
                                style={styles.img}
                            />
                            <View style={styles.center}>
                                <Text style={styles.reps}>3 * {this.props.exoReps[2]}</Text>
                            </View>
                        </View>
                        <View style={styles.imgs}>
                            <View style={styles.center}>
                                <Text style={styles.exoName}>{this.props.exoNames[3]}</Text>
                            </View>
                            <Image
                                source={this.props.source[3]}
                                style={styles.img}
                            />
                            <View style={styles.center}>
                                <Text style={styles.reps}>3 * {this.props.exoReps[3]}</Text>
                            </View>
                        </View>
                    </ScrollView>
                </View>
                <Button
                        title="Go"
                        onPress={()=>{
                            if (this.props.currentLevel)
                            {
                                this.goTrain(this.props.workout);
                            }
                        }}
                        />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    header: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'black',
        padding: 5,
    },
    body: {
        flex: 4,
        flexDirection: 'row',
    },
    imgs: {
        padding: 10
    },
    img: {
        resizeMode: 'contain',
        width: SCREEN_WIDTH / 4,
        padding: 2,
        height: SCREEN_WIDTH / 4,
    },
    reps: {
        fontStyle: 'italic'
    },
    center: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    exoname: {
        fontSize: 20,
        fontWeight: 'bold',
    }
});
export default withNavigation(SkillWorkout)
