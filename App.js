import React, {useState, useEffect} from 'react';
import Splash from './screens/Splash';
import JokeScreen from './screens/JokeScreen';
const App = () => {
  const [loading, setLoading] = useState(true);
  const [jokeData, setJokeData] = useState();

  useEffect(() => {
    fetch('https://quiet-ravine-27720.herokuapp.com/jokes')
      .then(res => res.json())
      .then(data => {
        setJokeData(data);
        setLoading(false);
      })
      .catch(() => {});
  }, []);

  return loading ? <Splash /> : <JokeScreen jokes={jokeData} />;
};

export default App;
