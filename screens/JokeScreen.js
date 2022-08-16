/* eslint-disable radix */
import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  ToastAndroid,
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Fontisto from 'react-native-vector-icons/Fontisto';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Share from 'react-native-share';
import Clipboard from '@react-native-clipboard/clipboard';

const JokeScreen = props => {
  const jokeData = props.jokes;

  const initialJokeState = {
    _id: '',
    joke: '',
    likeCount: '',
    dislikeCount: '',
    liked: false,
    disliked: false,
  };

  const [joke, setJoke] = useState(initialJokeState);
  const [previousJoke, setProviousJoke] = useState(initialJokeState);

  useEffect(() => {
    getRandomJoke();
    setProviousJoke('');
  }, []);

  const getRandomJoke = () => {
    setProviousJoke(joke);
    const appJoke = jokeData[Math.floor(Math.random() * jokeData.length)];
    setJoke({
      _id: appJoke._id,
      joke: appJoke.joke,
      likeCount: appJoke.likeCount,
      dislikeCount: appJoke.dislikeCount,
      liked: false,
      disliked: false,
    });
  };

  const getPreviousJoke = () => {
    setJoke(previousJoke);
    setProviousJoke('');
  };

  const decreaseAppLike = () => {
    setJoke(prevState => ({
      ...prevState,
      likeCount: parseInt(prevState.likeCount) - 1,
      liked: !prevState.liked,
    }));
    fetch(
      `https://quiet-ravine-27720.herokuapp.com/jokes/${joke._id}/removeLike`,
      {
        method: 'PATCH',
      },
    );
  };

  const increaseAppLike = () => {
    setJoke(prevState => ({
      ...prevState,
      likeCount: parseInt(prevState.likeCount) + 1,
      liked: !prevState.liked,
    }));
    fetch(
      `https://quiet-ravine-27720.herokuapp.com/jokes/${joke._id}/addLike`,
      {
        method: 'PATCH',
      },
    );
  };

  const increaseAppDislike = () => {
    setJoke(prevState => ({
      ...prevState,
      dislikeCount: parseInt(prevState.dislikeCount) + 1,
      disliked: !prevState.disliked,
    }));
    fetch(
      `https://quiet-ravine-27720.herokuapp.com/jokes/${joke._id}/addDislike`,
      {
        method: 'PATCH',
      },
    );
  };
  const decreaseAppDislike = () => {
    setJoke(prevState => ({
      ...prevState,
      dislikeCount: parseInt(prevState.dislikeCount) - 1,
      disliked: !prevState.disliked,
    }));
    fetch(
      `https://quiet-ravine-27720.herokuapp.com/jokes/${joke._id}/removeDislike`,
      {
        method: 'PATCH',
      },
    );
  };

  const likeJoke = () => {
    if (!joke.liked) {
      increaseAppLike();
      if (joke.disliked) {
        decreaseAppDislike();
      }
    } else if (joke.liked) {
      decreaseAppLike();
    }
  };

  const dislikeJoke = () => {
    if (!joke.disliked) {
      increaseAppDislike();
      if (joke.liked) {
        decreaseAppLike();
      }
    } else if (joke.disliked) {
      decreaseAppDislike();
    }
  };

  const shareJoke = () => {
    const options = {
      message: `Did you hear this funny joke: \n\n ${joke.joke}`,
      title: "Let's Laugh Together",
      subject: "Let's Laugh Together",
    };
    Share.open(options).catch(err => {
      err && console.log(err);
    });
  };

  const copyJoke = () => {
    Clipboard.setString(joke.joke);
    ToastAndroid.show('Joke Copied', ToastAndroid.SHORT);
  };

  const iconSize = 20;
  return (
    <View style={styles.container}>
      <View style={styles.banner}>
        <Image
          style={styles.bannerImage}
          source={require('../images/joke-diary-logo-img.png')}
        />
      </View>
      <View style={styles.innerContainer}>
        <View style={styles.jokeContainer}>
          <TouchableOpacity onPress={copyJoke}>
            <MaterialIcons
              name={'content-copy'}
              size={25}
              color={'white'}
              style={styles.copyIcon}
            />
          </TouchableOpacity>
          <ScrollView>
            <Text style={styles.text}>{joke ? joke.joke : ''}</Text>
          </ScrollView>
        </View>
        <View style={styles.actionButtons}>
          <View style={styles.leftActionButtons}>
            <TouchableOpacity style={styles.likeButton} onPress={likeJoke}>
              <Fontisto
                name={'smiley'}
                size={iconSize}
                color={`${joke.liked ? '#1d9adc' : 'grey'}`}
              />
              <Text style={styles.actionButtonText}>{joke.likeCount}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.dislikeButton}
              onPress={dislikeJoke}>
              <Fontisto
                name={'expressionless'}
                size={iconSize}
                color={`${joke.disliked ? '#f3253a' : 'grey'}`}
              />
              <Text style={styles.actionButtonText}>{joke.dislikeCount}</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={styles.rightActionButtons}
            onPress={shareJoke}>
            <FontAwesome name={'share-square-o'} size={iconSize} />
          </TouchableOpacity>
        </View>
        <View style={styles.seperator} />
        <View style={styles.buttonConatiner}>
          <TouchableOpacity onPress={getPreviousJoke} disabled={!previousJoke}>
            <View
              style={
                previousJoke ? styles.prevbutton : styles.disabledPreviousButton
              }>
              <AntDesign
                name={'arrowleft'}
                size={iconSize}
                color={previousJoke ? '#FFBA00' : 'grey'}
              />
              <Text
                style={
                  previousJoke
                    ? styles.prevButtonText
                    : styles.disabledPrevButtonText
                }>
                Previous
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={getRandomJoke}>
            <View style={styles.nextButton}>
              <Text style={styles.nextButtonText}>Next</Text>
              <AntDesign name={'arrowright'} size={iconSize} color={'white'} />
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  banner: {
    backgroundColor: '#FFBA00',
    height: 144,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bannerImage: {
    height: 67,
    width: 95,
  },
  innerContainer: {
    width: '90%',
  },
  jokeContainer: {
    height: '68%',
    // height: 461,
    width: '100%',
    marginTop: 16,
    backgroundColor: '#A56EFF',
    paddingTop: 10,
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 20,
    borderRadius: 30,
    borderColor: '#B6B6B6',
    shadowColor: '#000000',
    shadowOffset: {width: 0, height: 5},
    shadowOpacity: 25,
    elevation: 5,
    // alignItems: 'flex-end',
  },
  copyIcon: {
    width: '100%',
    textAlign: 'right',
  },
  text: {
    // color: '#31135e',
    color: '#FFFFFF',
    fontSize: 24,
    whiteSpace: 'pre-wrap',
  },
  actionButtons: {
    height: 32,
    marginTop: 5,
    paddingLeft: 20,
    paddingRight: 20,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  leftActionButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightActionButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  likeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  dislikeButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButtonText: {
    marginLeft: 5,
  },
  seperator: {
    borderBottomColor: '#D8D8D8',
    borderBottomWidth: 2,
    marginTop: 10,
    marginBottom: 10,
  },
  buttonConatiner: {
    width: '100%',
    height: 36,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  prevbutton: {
    height: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: 100,
    backgroundColor: 'transparent',
    borderColor: '#FFBA00',
    borderWidth: 1,
    borderRadius: 8,
  },
  prevButtonText: {
    color: '#FFBA00',
    marginLeft: 10,
  },
  disabledPreviousButton: {
    height: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: 100,
    backgroundColor: 'transparent',
    borderColor: 'grey',
    borderWidth: 1,
    borderRadius: 8,
  },
  disabledPrevButtonText: {
    color: 'grey',
    marginLeft: 10,
  },
  nextButton: {
    height: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: 100,
    backgroundColor: '#FFBA00',
    borderRadius: 8,
  },
  nextButtonText: {
    color: 'white',
    marginRight: 10,
  },
  buttonText: {
    marginRight: 20,
  },
});

export default JokeScreen;
