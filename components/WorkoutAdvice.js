import React, { Component } from 'react';
import { View, Text, StyleSheet, Dimensions, PanResponder, Animated, Image, TouchableHighlight } from 'react-native';
import renderIf from '../node_modules/render-if';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
const NUMBER_PAGES = 4;
const ARTICLES = [
    { id: "1", uri: require('../imgs/human.png'),
     text: " \
     Whatever your goal is, it is highly recommended that you do only up to 8 exercises. You also had better focusing on two exercises per muscle (or muscle portions in case of a split routine).\
     " },
     { id: "2", uri: require('../imgs/icon.png'), text: "\
     You should always start with the skills you are working on so as to keep a proper form while performing them.\n\n \
After around 15’, you should move onto strength work, that is to say all the exercises you consider as difficult, really exhausting.\n\n \
Finally, you should be doing some conditioning to get the last bit of your strength out.\
     " },
    { id: "3", uri: require('../imgs/icon.png'), text: "\
    Be sure to rest properly and to do the right number of reps depending on your main goal.\n\
If you are targeting a gain in strength, don’t drop too much your rest time and stay around 1’30/3’ and stay with a low number of reps such as 3 or 5.\n\
If you are looking for muscle gains, 1’ is sufficient with sets of 10 to 12 reps.\n\
If you are here for losing fat or simply a gain in endurance, 25’’ of rest between sets of 15 to 20 reps is optimal.\
    " },
]

export default class WorkoutAdvice extends Component {
    constructor(props) {
        super(props);
        this.position = new Animated.ValueXY();
        this.rotate = this.position.x.interpolate({
            inputRange: [-(SCREEN_WIDTH * 0.45), 0, (SCREEN_WIDTH * 0.45)],
            outputRange: ['-10deg', '0deg', '10deg'],
            extrapolate: 'clamp',
        });
        this.rotateAndTranslate = {
            transform: [{
                rotate: this.rotate,

            }, ...this.position.getTranslateTransform()
            ]
        };

        this.nextCardScale = this.position.x.interpolate({
            inputRange: [-(SCREEN_WIDTH * 0.45), 0, (SCREEN_WIDTH * 0.45)],
            outputRange: [1, 0.8, 1],
            extrapolate: 'clamp',
        });
        //Enable to make the dragged view disappear 
        this.swipedCardPosition = new Animated.ValueXY({ x: 0, y: -SCREEN_HEIGHT * 2 })
        this.state = {
            currentIndex: 0
        };
    }
    componentWillReceiveProps()
    {
        this.setState({ currentIndex: 0})
    }
    componentWillMount() {
        this.PanResponder = PanResponder.create({
            onStartShouldSetPanResponder: (evt, gestureState) => true,
            onPanResponderMove: (evt, gestureState) => {
                this.position.setValue({ x: gestureState.dx, y: gestureState.dy });
            },
            onPanResponderRelease: (evt, gestureState) => {

                if (-gestureState.dx > 120 || gestureState.dy > 50) {

                    Animated.timing(this.position, {
                        toValue: ({ x: 0, y: -SCREEN_HEIGHT }),
                        duration: 400
                    }).start(() => {

                        this.setState({ currentIndex: this.state.currentIndex + 1 })
                        this.position.setValue({ x: 0, y: 0 })

                    })
                }
                else if (gestureState.dx > 120 || -gestureState.dy > 50)
                {
                    Animated.timing(this.position, {
                        toValue: ({ x: 0, y: -SCREEN_HEIGHT }),
                        duration: 400
                    }).start(() => {

                        if (this.state.currentIndex > 0)
                        {
                            this.setState({ currentIndex: this.state.currentIndex - 1 })
                        }
                        this.position.setValue({ x: 0, y: 0 })

                    })
                }
                else {
                    Animated.spring(this.position, {
                        toValue: ({ x: 0, y: 0 })
                    }).start()
                }
            },
        })
    }

    renderArticles = () => {

        return ARTICLES.map((item, i) => {

            if (i == this.state.currentIndex - 1) {

                return (
                    <Animated.View key={item.id} style={this.swipedCardPosition.getLayout()}
                        {...this.PanResponder.panHandlers}
                    >
                        <View style={{ flex: 1, position: 'absolute', top: 0, left: 0 }}>
                            <View style={styles.page}>
                                <View style={{ flex: 4, backgroundColor: 'black' }}>
                                    <Image source={ARTICLES[i].uri}
                                        style={{ flex: 1, height: null, width: null, resizeMode: 'contain' }}
                                    ></Image>
                                </View>
                                <View style={{ flex: 5, padding: 5, justifyContent:'center', alignItems: 'center' }}>
                                    <Text>
                                        {item.text}
                                    </Text>
                                </View>
                                <View style={{ flex: 1, justifyContent: 'flex-end', alignItems:'flex-end'}}>
                                    <Text>{item.id} / {NUMBER_PAGES}</Text>
                                </View>
                            </View>
                        </View>
                    </Animated.View>
                )
            }
            else if (i < this.state.currentIndex) {
                return null
            }
            if (i == this.state.currentIndex) {

                return (

                    <Animated.View key={item.id} style={[this.rotateAndTranslate, this.position.getLayout()]}
                        {...this.PanResponder.panHandlers}
                    >
                        <View style={{ flex: 1, position: 'absolute', top: 0, left: 0 }}>
                            <View style={styles.page}>
                                <View style={{ flex: 4, backgroundColor: 'black' }}>
                                    <Image source={ARTICLES[i].uri}
                                        style={{ flex: 1, height: null, width: null, resizeMode: 'contain' }}
                                    ></Image>
                                </View>
                                <View style={{ flex: 5, padding: 5, justifyContent: 'center', alignItems: 'center'}}>
                                    <Text>
                                        {item.text}
                                    </Text>
                                </View>
                                <View style={{ flex: 1, justifyContent: 'flex-end', alignItems:'flex-end'}}>
                                    <Text>{item.id} / {NUMBER_PAGES}</Text>
                                </View>
                            </View>
                        </View>
                    </Animated.View>
                )
            }
            else {

                return (
                    <Animated.View key={item.id} style={{transform: [{scale: this.nextCardScale}]}}>
                        <View style={{ flex: 1, position: 'absolute', top: 0, left: 0 }}>
                            <View style={styles.page}>
                                <View style={{ flex: 4, backgroundColor: 'black' }}>
                                    <Image source={ARTICLES[i].uri}
                                        style={{ flex: 1, height: null, width: null, resizeMode: 'center' }}
                                    ></Image>
                                </View>
                                <View style={{ flex: 5, padding: 5,justifyContent:'center', alignItems: 'center' }}>
                                    <Text>
                                        {item.text}
                                    </Text>
                                </View>
                                <View style={{ flex: 1, justifyContent: 'flex-end', alignItems:'flex-end'}}>
                                    <Text>{item.id} / {NUMBER_PAGES}</Text>
                                </View>
                            </View>
                        </View>
                    </Animated.View>
                )

            }
        }).reverse()
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                <View style={{ flex: 1, position: 'absolute', top: 0, left: 0, zIndex: 5 }}>
                    <Animated.View style={styles.page}>
                        {renderIf(this.state.currentIndex == NUMBER_PAGES - 1)(
                            <View style={{ flex: 1 }}>
                                <View style={{ flex: 4, backgroundColor: 'black' }}>
                                    <Image source={'../imgs/icon.png'}
                                        style={{ flex: 1, height: null, width: null, resizeMode: 'contain' }}
                                    ></Image>
                                </View>
                                <View style={{ flex: 5, padding: 5, justifyContent:'center', alignItems: 'center'}}>
                                    <Text>
                                        You should now know enough to build your own workout.
                                    </Text>
                                    <TouchableHighlight style={{marginTop: 10, marginBottom: 10}} onPress={()=>{alert('INFO')}}>
                                    <Text>For more information about building your own workout, click here.</Text>
                                    </TouchableHighlight>
                                    <Text>
                                    Good luck and keep pushing !
                                    </Text>
                                    <View style={{marginTop: 15}}>
                                    <TouchableHighlight onPress={()=> this.props.context.popupDialog.dismiss()} style={{backgroundColor: '#b81717', padding: 10, borderRadius: 5, justifyContent: 'center', alignItems: 'center'}}>
                                        <Text style={{color: 'white'}}>Done</Text>
                                    </TouchableHighlight>
                                    </View>
                                </View>
                                <View style={{ flex: 1, justifyContent: 'flex-end', alignItems:'flex-end'}}>
                                    <Text>{NUMBER_PAGES} / {NUMBER_PAGES}</Text>
                                </View>
                            </View>
                        )}
                        {this.renderArticles()}
                    </Animated.View>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    page: {
        flex: 1,
        backgroundColor: 'white',
        margin: -10,
        padding: 10,
        width: 0.9 * SCREEN_WIDTH,
        height: 0.8 * SCREEN_HEIGHT,
        borderRadius: 15
    }
});