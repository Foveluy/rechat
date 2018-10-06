import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  Keyboard,
  Animated
} from 'react-native';
import { InputToolBar } from './inputToolBar';

const IPHONEX_PREFIX = 32;
const TOOL_BAR_HEIGHT = 40;

class ChatBubble extends React.PureComponent {
  _onPress = () => {
    this.props.onPressItem(this.props.id);
  };

  render() {
    const textColor = this.props.selected ? 'red' : 'black';

    const bubblePosition =
      this.props.bubblePosition === 'left'
        ? {}
        : { justifyContent: 'flex-end' };

    return (
      <TouchableOpacity
        onPress={this._onPress}
        style={{ ...bubblePosition, flexDirection: 'row' }}
      >
        <View
          style={{
            padding: 8,
            backgroundColor: '#95de64',
            marginTop: 16,
            marginBottom: this.props.idx === 0 ? 16 : 0,
            borderRadius: 4
          }}
        >
          <Text style={{ color: textColor, fontSize: 15 }}>
            {this.props.title}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }
}

const Mock = () => {
  let _mock = [];
  for (let index = 0; index < 10; index++) {
    _mock.push({
      id: index,
      title: `${100 * index}`
    });
  }
  return _mock;
};

export default class App extends React.Component {
  static defaultProps = {
    dismissKeyBoardWhenScroll: true
  };

  state = {
    selected: new Map(),
    messegeContainerHeight: new Animated.Value(0),
    message: Mock()
  };

  _keyExtractor = (item, index) => item.id + '';

  _onPressItem = (id: string) => {
    // updater functions are preferred for transactional updates
    this.setState(state => {
      // copy the map rather than modifying state.
      const selected = new Map(state.selected);
      selected.set(id, !selected.get(id)); // toggle
      return { selected };
    });
  };

  onKeyboardWillShow = e => {
    const height = e.endCoordinates ? e.endCoordinates.height : e.end.height;
    this.keyboardHeight = height;
    Animated.spring(this.state.messegeContainerHeight, {
      toValue: height + 32 - (TOOL_BAR_HEIGHT - 32) + IPHONEX_PREFIX + 2,
      duration: 100,
      friction: 9
    }).start();
    // this.setState(
    //   {
    //     messegeContainerHeight:
    //   },
    //   () => {
    //
    //   }
    // );
  };
  keyboardWillHide = () => {
    Animated.spring(this.state.messegeContainerHeight, {
      toValue: this.getMaxHeight() - IPHONEX_PREFIX,
      duration: 100,
      friction: 15
    }).start();
    // this.setState({
    //   messegeContainerHeight:
    // });
  };

  componentDidMount() {
    this.keyboardHeight = 0;
    Keyboard.addListener('keyboardWillShow', this.onKeyboardWillShow);
    // Keyboard.addListener(
    //   'keyboardDidShow',
    //   props.invertibleScrollViewProps.onKeyboardDidShow
    // );
    Keyboard.addListener('keyboardWillHide', this.keyboardWillHide);
    // Keyboard.addListener('keyboardDidHide', this.onKeyboardDidHide);
  }

  _renderItem = ({ item, index }) => {
    return (
      <ChatBubble
        idx={index}
        bubblePosition={item.id % 3 == 0 ? 'left' : 'right'}
        id={item.id}
        onPressItem={this._onPressItem}
        selected={!!this.state.selected.get(item.id)}
        title={item.title}
      />
    );
  };
  onInitLayout = e => {
    const { layout } = e.nativeEvent;
    if (layout.height <= 0) {
      return;
    }
    this.setMaxHeight(layout.height);
    this.setState({
      messegeContainerHeight: new Animated.Value(layout.height - IPHONEX_PREFIX)
    });
  };

  setMaxHeight = height => {
    this.height = height;
  };

  getMaxHeight = () => this.height;

  onSend = text => {
    this.setState({
      message: [{ id: new Date(), title: text }].concat(this.state.message)
    });
  };

  onInputToolBarHeightChange = height => {
    Animated.spring(this.state.messegeContainerHeight, {
      toValue:
        this.keyboardHeight +
        32 -
        (TOOL_BAR_HEIGHT - 32) +
        IPHONEX_PREFIX +
        2 -
        height,
      duration: 100,
      friction: 9
    }).start();
  };

  render() {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ flex: 1 }} onLayout={this.onInitLayout}>
          <Animated.View style={{ height: this.state.messegeContainerHeight }}>
            <FlatList
              // scrollEventThrottle={32}
              ref={flatlist => (this.flatlist = flatlist)}
              data={this.state.message}
              extraData={this.state}
              keyExtractor={this._keyExtractor}
              renderItem={this._renderItem}
              inverted={true}
            />
          </Animated.View>
          <InputToolBar
            onHeightChange={this.onInputToolBarHeightChange}
            toolBarHeight={TOOL_BAR_HEIGHT}
            onSend={this.onSend}
          />
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  }
});
