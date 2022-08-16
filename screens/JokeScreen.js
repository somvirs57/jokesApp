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
  const [joke, setJoke] = useState({
    _id: '',
    joke: '',
    likeCount: '',
    dislikeCount: '',
  });
  const [previousJoke, setProviousJoke] = useState({
    _id: '',
    joke: '',
    likeCount: '',
    dislikeCount: '',
  });
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [appLikeCount, setAppLikeCount] = useState();
  const [appDislikeCount, setAppDislikeCount] = useState();

  useEffect(() => {
    getRandomJoke();
  }, []);

  const getRandomJoke = () => {
    setProviousJoke(joke);
    const appJoke = jokeData[Math.floor(Math.random() * jokeData.length)];
    setJoke(appJoke);
    setAppLikeCount(appJoke.likeCount);
    setAppDislikeCount(appJoke.dislikeCount);
    setDisliked(false);
    setLiked(false);
  };

  const getPreviousJoke = () => {
    setJoke(previousJoke);
    setProviousJoke('');
  };

  const sendLike = async () => {
    fetch(
      `https://quiet-ravine-27720.herokuapp.com/jokes/${joke._id}/addLike`,
      {
        method: 'PATCH',
      },
    );
  };
  const likeJoke = () => {
    if (!liked) {
      setLiked(prevState => !prevState);
      // eslint-disable-next-line radix
      setAppLikeCount(prevCount => parseInt(prevCount) + 1);
      sendLike();
      if (disliked) {
        setDisliked(false);
        // eslint-disable-next-line radix
        setAppDislikeCount(prevCount => parseInt(prevCount) - 1);
      }
    } else if (liked) {
      setLiked(prevState => !prevState);
      // eslint-disable-next-line radix
      setAppLikeCount(prevCount => parseInt(prevCount) - 1);
    }
  };

  const dislikeJoke = () => {
    if (!disliked) {
      setDisliked(prevState => !prevState);
      // eslint-disable-next-line radix
      setAppDislikeCount(prevCount => parseInt(prevCount) + 1);
      if (liked) {
        setLiked(false);
        // eslint-disable-next-line radix
        setAppLikeCount(prevCount => parseInt(prevCount) - 1);
      }
    } else if (disliked) {
      setDisliked(prevState => !prevState);
      // eslint-disable-next-line radix
      setAppDislikeCount(prevCount => parseInt(prevCount) - 1);
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
                color={`${liked ? '#1d9adc' : 'grey'}`}
              />
              <Text style={styles.actionButtonText}>{appLikeCount}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.dislikeButton}
              onPress={dislikeJoke}>
              <Fontisto
                name={'expressionless'}
                size={iconSize}
                color={`${disliked ? '#f3253a' : 'grey'}`}
              />
              <Text style={styles.actionButtonText}>{appDislikeCount}</Text>
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
