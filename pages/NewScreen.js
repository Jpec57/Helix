import React from 'react';
import {
  Text,
  PanResponder,
  Animated,
  FlatList,
  Dimensions,
  View
} from 'react-native';
import { Speech } from 'expo';
import { LayoutAnimation, UIManager } from 'react-native';


class SwipeableCard extends React.Component {
  translateY = new Animated.Value(0);
  _panResponder = PanResponder.create({
    onMoveShouldSetResponderCapture: () => true,
    onMoveShouldSetPanResponderCapture: () => true,
    onPanResponderMove: Animated.event([null, { dy: this.translateY }]),
    onPanResponderRelease: (e, { vy, dy }) => {
      if (Math.abs(vy) >= 0.5 || Math.abs(dy) >= 25) {
        console.log("Move from "+ (Math.abs(dy) / 25));
      } else {
        Animated.spring(this.translateY, {
          toValue: 0,
          bounciness: 10
        }).start();
      }
    }
  });

  render() {
    return (
      <View style={{margin: 10}}>
        <Animated.View
          style={{ transform: [{ translateY: this.translateY }], height: 25 }} {...this._panResponder.panHandlers}>
          <View style={{backgroundColor: 'green'}}>
          <Text style={{color: 'white'}}>
                  {this.props.title}
                  </Text>
          </View>

        </Animated.View>
      </View>

    );
  }
}


export default class NewScreen extends React.Component {
  titles = new Array(10).fill(null).map((_, i) => `Card #${i}`);


  constructor(props) {
    super(props);
    this.state = {
      closedIndices: [],
      test: ["One", "Two", "Three", "Four", "Five"]
    };
    UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
    this.shouldRender = this.shouldRender.bind(this);
    Speech.speak("3, 2, 1", {
      language: 'en',
      rate: 1,
    });
  }

  shouldRender(index) {
    return this.state.closedIndices.indexOf(index) === -1
  }

  _renderItem = ({ item }) => (
    <SwipeableCard title={item} onDismiss={()=>{console.log("OUPS");}}/>
  );

  render() {
    return (
      <View>
        <View style={{margin: 20}}>
        <FlatList
                data={this.state.test}
                extraData={this.state.test}
                renderItem={this._renderItem}
                keyExtractor={(item, index) => index.toString()}
              />
        </View>

        {this.titles.map((title, i) => this.shouldRender(i) &&
          <View key={i}><SwipeableCard title={title} onDismiss={() => {
            console.log("Dismissed");
/*
            if ([...new Array(this.titles.length)].slice(i + 1, this.titles.length).some(this.shouldRender)) {
              LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
            }
            this.setState({
              closedIndices: [...this.state.closedIndices, i]
            })
            */
          }} /></View>)}
      </View>
    );
  }
}
/*
export default class NewScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pan: new Animated.ValueXY(),
      exos: ["Dips", "Tractions"]
    };
  }
  static navigationOptions = {
    header: () => null
  }
  componentWillMount() {
    // Add a listener for the delta value change
    this._val = { x: 0, y: 0 }
    this.state.pan.addListener((value) => this._val = value);
    // Initialize PanResponder with move handling
    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: (e, gesture) => true,
      onPanResponderMove: Animated.event([
        null, { dx: this.state.pan.x, dy: this.state.pan.y }
      ]),

      onPanResponderGrant: (e, gestureState) => {
        // Set the initial value to the current state
        this.state.pan.setOffset({ x: this.state.pan.x._value, y: this.state.pan.y._value });
        this.state.pan.setValue({ x: 0, y: 0 });
      },
      onPanResponderRelease: (e, { vx, vy }) => {
        // Flatten the offset to avoid erratic behavior
        this.state.pan.flattenOffset();
      }

    });
  }

  _renderItem = ({ item }) => (
    <Text>{item}</Text>
  );

  render() {
    const panStyle = {
      transform: this.state.pan.getTranslateTransform()
    }
    return (
      <View>
        <FlatList
          data={this.state.exos}
          extraData={this.state.exos}
          renderItem={this._renderItem}
          keyExtractor={(item, index) => index.toString()}
        />
        <Animated.View
          {...this.panResponder.panHandlers}
          style={[panStyle, styles.circle]}
        >
        <Text>TEST</Text>
        </Animated.View>
        <Animated.View
          {...this.panResponder.panHandlers}
          style={[panStyle, styles.circle]}
        >
        <Text>TEST2</Text>
        </Animated.View>
      </View>
    );
  }
}
let CIRCLE_RADIUS = 30;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  circle: {
    backgroundColor: "skyblue",
    width: CIRCLE_RADIUS * 2,
    height: CIRCLE_RADIUS * 2,
    borderRadius: CIRCLE_RADIUS
  }
});
*/
