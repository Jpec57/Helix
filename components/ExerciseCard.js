import React, { PureComponent } from 'react';
import { withNavigation } from 'react-navigation';
import { View, Text, TouchableOpacity, StyleSheet, Image, Dimensions } from 'react-native';
import { Container, Header, Content, Card, CardItem, Thumbnail, Button, Icon, Left, Right, Body } from 'native-base';
const SCREEN_WIDTH = Dimensions.get("window").width;

class WorkoutNameListItem extends React.PureComponent {
  constructor(props) {
    super(props)
  }
  render() {
    const { navigation } = this.props;
    return (
      <View style={{ width: SCREEN_WIDTH * 0.8 }}>
        <Card>
          <CardItem style={{ backgroundColor: '#b81717' }}>
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ color: 'white', fontSize: 20 }}>{this.props.name}</Text>
            </View>
          </CardItem>
          <CardItem>
            <Body>
              <View style={{ justifyContent: 'center' }}>
                <Image resizeMode='contain' source={require('../imgs/NoImageAvailable.jpg')} style={{ width: SCREEN_WIDTH * 0.6, height: SCREEN_WIDTH * 0.4 }} />
              </View>
              <View style={styles.row}>
                <View styles={{ width: '50%' }}>
                  <Text>{this.props.series} sets</Text>
                </View>
                <View styles={{ width: '50%' }}>
                  <Text>{this.props.reps}x</Text>
                </View>
              </View>
              <View style={styles.row}>
                <View>
                  <Text>Rest: {this.props.rest}sec</Text>
                </View>
                <View>
                  <Text>Weight: {this.props.weight}kgs</Text>
                </View>
              </View>
              <Text>
                Superset: {this.props.superset}
              </Text>
            </Body>
          </CardItem>
        </Card>
      </View>
    );
  }
}

const styles = StyleSheet.create({

})

export default withNavigation(WorkoutNameListItem)
