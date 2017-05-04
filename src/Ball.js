import React, {Component} from 'React';
import { View, Animated } from 'react-native';

class Ball extends React.Component {

    componentWillMount() {
        this.position = new Animated.ValueXY(0,0);
        Animated.spring(this.position, {
            toValue: { x: 200, y: 500}
        }).start(); 
    }

    render() {
        return(
            <Animated.View style={this.position.getLayout()}>
                <View style={styles.ballView}/>
            </Animated.View>
        );
    }
}

const styles = {
    ballView: {
        height: 60,
        width: 60,
        borderRadius: 30,
        borderWidth: 30,
        backgroundColor: 'black'
    }
}

export default Ball; 