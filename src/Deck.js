import React, {Component} from 'React';
import { 
  View, 
  Animated, 
  PanResponder, 
  Dimensions,
  LayoutAnimation,
  UIManager
} from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SWIP_HOLD = 0.25 * SCREEN_WIDTH;
const SWIP_OUT_DURATION = 250;
class Deck extends React.Component {
    static defaultProps = {
         onSwipRight: () => {},
         onSwipLeft: () => {}
    }

    constructor(props) {
        super(props);
        const position = new Animated.ValueXY();
        const panResponder = PanResponder.create({
            onStartShouldSetPanResponder: () =>  true,
            onPanResponderMove: (event, gesture) => {
                position.setValue({ x:  gesture.dx , y: gesture.dy });
            },
            onPanResponderRelease: (event, gesture) => {
                if(gesture.dx > SWIP_HOLD){
                    // alert('swip Right')
                    this.forceSwip('right');
                }else if (gesture.dy < -SWIP_HOLD){
                    // alert('swip Left')
                    this.forceSwip('left');
                }else {
                    this.resetPosition();
                }
            }
        });
        this.state = { panResponder, position, index: 0 }
    }

    componentWillUpdate() {
      UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
      LayoutAnimation.spring();
    }

    resetPosition() {
        Animated.spring(this.state.position, {
            toValue: { x:0, y:0 }
        }).start();
    }

    forceSwip(direction) {
        const x = direction === 'right' ? SCREEN_WIDTH : -SCREEN_WIDTH;
        Animated.timing(this.state.position, {
            toValue: { x: x, y: 0},
            duration: SWIP_OUT_DURATION
        }).start(() => this.onSwipComplete(direction));
    }

    onSwipComplete(direction){
        const { onSwipLeft, onSwipRight, data } = this.props;
        const item = data[this.state.index];

        direction === 'right' ? onSwipRight(item) : onSwipLeft(item)
        this.state.position.setValue({ x: 0, y: 0 })
        this.setState({ index: this.state.index + 1})
    }

    getCardStyle () {
        const { position } = this.state;
        const rotate = position.x.interpolate({
            inputRange: [-SCREEN_WIDTH * 1.5, 0 , SCREEN_WIDTH * 1.5],
            outputRange: ['-120deg', '0deg', '120deg']
        })
        return {
            ...this.state.position.getLayout(),
            transform: [{ rotate }]
        }
    }
    renderCards() {
        if(this.state.index >= this.props.data.length){
            return this.props.renderNoMoreCards();
        }
        return this.props.data.map((item, i) => {
            if(i < this.state.index){
                return null;
            }
            if(i === this.state.index){
                return (
                    <Animated.View
                        key={item.id}
                        style={[this.getCardStyle(), styles.cardStyle]}
                        {...this.state.panResponder.panHandlers}
                        >
                        {this.props.renderCard(item)}
                    </Animated.View>
                )
            }
            return (
                <Animated.View key={item.id} style={[styles.cardStyle, {top: 10 * (i - this.state.index)}]}>
                  {this.props.renderCard(item)}
                </Animated.View>
              );
                
        }).reverse()
    }
    render() {
        return(
            <View>
                {this.renderCards()}
            </View>
        );
    }
}

const styles = {
    cardStyle: {
        position: 'absolute',
        width: SCREEN_WIDTH
    }
    
}

export default Deck; 