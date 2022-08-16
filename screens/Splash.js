import React from 'react';
import {View, Image, StyleSheet} from 'react-native';

const Splash = () => {
  return (
    <View style={styles.container}>
      <Image source={require('../images/joke-diary-logo-img.png')} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFBA00',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Splash;
