import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  SafeAreaView
} from 'react-native';

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
            borderRadius: 4
          }}
        >
          <Text style={{ color: textColor }}>{this.props.title}</Text>
        </View>
      </TouchableOpacity>
    );
  }
}

const Mock = () => {
  let _mock = [];
  for (let index = 0; index < 1000; index++) {
    _mock.push({
      id: index,
      title: `${100 * index}`
    });
  }
  return _mock;
};

export default class App extends React.Component {
  state = { selected: new Map() };

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

  componentDidMount() {
    setTimeout(() => {
      this.flatlist.scrollToEnd();
    }, 1300);
  }

  _renderItem = ({ item }) => (
    <ChatBubble
      bubblePosition={item.id % 3 == 0 ? 'left' : 'right'}
      id={item.id}
      onPressItem={this._onPressItem}
      selected={!!this.state.selected.get(item.id)}
      title={item.title}
    />
  );

  render() {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <FlatList
          ref={flatlist => (this.flatlist = flatlist)}
          data={Mock()}
          extraData={this.state}
          keyExtractor={this._keyExtractor}
          renderItem={this._renderItem}
        />
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
