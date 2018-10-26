import React from 'react'
import { StyleSheet, Text, View, Image, TouchableHighlight, Dimensions } from 'react-native';
import { withNavigation} from 'react-navigation'
import { Container, Content, Header, Form, Input, Item, Label, Icon, Left, Right, Body } from 'native-base';
import CustomHeader from './CustomHeader';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH = Dimensions.get('window').width;

class DrawerContent extends React.Component {
    render() {
        return (
            <View>
                <CustomHeader title="Drawer"/>
                              <View style={{ backgroundColor: '#fff', width: SCREEN_WIDTH * 0.75, height: SCREEN_HEIGHT, borderRightWidth: 2, borderColor: 'black' }}>

                <Container>
                    <Header style={styles.drawerHeader}>
                        <Body>
                            <Image
                                style={styles.drawerImage}
                                resizeMode='contain'
                                source={require('../imgs/caution.jpg')} />
                            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }} ><Text>Helix</Text></View>
                        </Body>
                    </Header>
                    <Content>
                        <View style={styles.container}>
                            <TouchableHighlight
                                onPress={
                                    () => {
                                        this.props.context.setState({
                                            toggleDrawer: false
                                          });
                                        this.props.navigation.navigate('HomeScreen');
                                    }
                                }>
                                <View style={styles.item}>
                                    <Icon
                                        style={styles.icon}
                                        name='home' />
                                    <Text style={{ marginTop: 5 }}>Home</Text>
                                </View>
                            </TouchableHighlight>

                            <TouchableHighlight
                                onPress={
                                    () =>
                                    {
                                        this.props.context.setState({
                                            toggleDrawer: false
                                          });
                                        this.props.navigation.navigate('ProfileScreen');
                                    }}>
                                <View style={styles.item}>
                                    <Image
                                        style={styles.icon}
                                        resizeMode='contain'
                                        source={require('../imgs/profil.png')} />
                                    <Text style={{ marginTop: 5 }}>Profil</Text>
                                </View>
                            </TouchableHighlight>
                            <TouchableHighlight
                                onPress={() => {
                                    this.props.context.setState({
                                        toggleDrawer: false
                                      });
                                    this.props.navigation.navigate('AllWorkoutsScreen');
                                    this.props.viewPager.setPage(0)}}>
                                <View style={styles.item}>
                                    <Image
                                        style={styles.icon}
                                        resizeMode='contain'
                                        source={require('../imgs/pullups.png')} />
                                    <Text style={{ marginTop: 5 }}>Skills</Text>
                                </View>
                            </TouchableHighlight>
                            <TouchableHighlight
                                onPress={() => {
                                    this.props.context.setState({
                                        toggleDrawer: false
                                      });
                                    this.props.navigation.navigate('AllWorkoutsScreen');
                                    this.props.viewPager.setPage(1);
                                    }}>
                                <View style={styles.item}>
                                    <Image
                                        resizeMode='contain'
                                        style={styles.icon}
                                        source={require('../imgs/haltere.png')} />
                                    <Text style={{ marginTop: 5 }}>Routines</Text>
                                </View>
                            </TouchableHighlight>
                            <TouchableHighlight
                                onPress={() => {
                                    this.props.context.setState({
                                        toggleDrawer: false
                                      });
                                    this.props.navigation.navigate('AllWorkoutsScreen');
                                    this.props.viewPager.setPage(2)}}>
                                <View style={styles.item}>
                                    <Image
                                        style={styles.icon}
                                        resizeMode='contain'
                                        source={require('../imgs/bookmark.png')} />
                                    <Text style={{ marginTop: 5 }}>Personal</Text>
                                </View>
                            </TouchableHighlight>

                                                        <TouchableHighlight
                                onPress={() => {
                                    this.props.context.setState({
                                        toggleDrawer: false
                                      });
                                    this.props.navigation.navigate('OneRMCalculator')}}>
                                <View style={styles.item}>
                                    <Image
                                        style={styles.icon}
                                        resizeMode='contain'
                                        source={require('../imgs/calculus.png')} />
                                    <Text style={{ marginTop: 5 }}>One RM Calculator</Text>
                                </View>
                            </TouchableHighlight>

                                                                                    <TouchableHighlight
                                onPress={() => {
                                    this.props.context.setState({
                                        toggleDrawer: false
                                      });
                                    this.props.navigation.navigate('HomeScreen', {"page": 0})}}>
                                <View style={styles.item}>
                                    <Image
                                        style={styles.icon}
                                        resizeMode='contain'
                                        source={require('../imgs/timer.png')} />
                                    <Text style={{ marginTop: 5 }}>Quick Chronometer</Text>
                                </View>
                            </TouchableHighlight>
                        </View>
                    </Content>
                </Container>
                
            </View>
</View>)
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'center',
    },
    drawerHeader: {
        height: 200,
        backgroundColor: 'white'
    },
    drawerImage: {
        height: 150,
        width: 150,
        borderRadius: 75
    },
    icon:
    {
        height: 34,
        width: 34,
        marginRight: 10,
    },
    item: {
        flex: 1,
        flexDirection: 'row',
        marginLeft: '10%'
    }
})

export default withNavigation(DrawerContent);