import React from 'react';

import { TextInput, Platform, View } from 'react-native';

class TI extends React.Component {
  shouldComponentUpdate(nextProps) {
    return (
      Platform.OS !== 'ios' ||
      (this.props.value === nextProps.value &&
        (nextProps.defaultValue == undefined ||
          nextProps.defaultValue == '')) ||
      (this.props.defaultValue === nextProps.defaultValue &&
        (nextProps.value == undefined || nextProps.value == ''))
    );
  }

  render() {
    return <TextInput ref={this.props.textRef} {...this.props} />;
  }
}

export class InputToolBar extends React.Component {
  state = {
    text: '',
    height: 18
  };

  shouldComponentUpdate(nextProps, nextState) {
    return (
      this.state.text !== nextState.text ||
      this.state.height !== nextState.height
    );
  }

  componentDidUpdate(preProps, preState) {
    if (preState.height !== this.state.height) {
      this.props.onHeightChange &
        this.props.onHeightChange(this.state.height - 18);
    }
  }

  onSubmitEditing = () => {
    this.setState({
      text: ''
    });
    //https://github.com/facebook/react-native/issues/18843
    if (Platform.OS === 'ios') this.input.setNativeProps({ text: ' ' });
    setTimeout(() => {
      this.input.setNativeProps({ text: '' });
    }, 5);
    this.props.onSend && this.props.onSend(this.state.text);
  };

  onChangeText = text => {
    this.setState({ text: text });
  };

  render() {
    return (
      <View
        style={{
          height: this.props.toolBarHeight + this.state.height - 18,
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: 'rgba(200,200,200,0.1)',
          borderTopWidth: 1,
          borderTopColor: 'rgba(120,120,120,0.1)'
        }}
      >
        <View
          style={{
            borderRadius: 4,
            borderWidth: 1,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            borderColor: 'rgba(120,120,120,0.1)',
            backgroundColor: 'white',
            width: 150
          }}
        >
          <TI
            onContentSizeChange={e => {
              const native = e.nativeEvent;
              this.setState({
                height: native.contentSize.height
              });
            }}
            textRef={node => (this.input = node)}
            onChangeText={this.onChangeText}
            value={this.state.text}
            onSubmitEditing={this.onSubmitEditing}
            returnKeyType="send"
            style={{ fontSize: 15, flex: 1, marginBottom: 4 }}
            enablesReturnKeyAutomatically
            underlineColorAndroid="transparent"
            blurOnSubmit={false}
            numberOfLines={5}
            multiline
          />
        </View>
      </View>
    );
  }
}
