/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  StatusBar,
  Button,
  Platform,
} from 'react-native';

import {Colors} from 'react-native/Libraries/NewAppScreen';

import RNPytorch from 'react-native-pytorch';
import ImagePicker from 'react-native-image-picker';

const App = () => {
  const [results, setResults] = useState([]);
  RNPytorch.loadModel('model.pt', 'labels.txt')
    .then(() => console.log('done'))
    .catch((err) => console.log(err));

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView
        style={{justifyContent: 'center', alignItems: 'center', flex: 1}}>
        <View>
          <Button
            title="Press me"
            color="#f194ff"
            onPress={() => {
              ImagePicker.showImagePicker({}, async (response) => {
                try {
                  if (!response.uri) {
                    return;
                  }
                  const filePath =
                    Platform.OS === 'android' ? response.path : response.uri;
                  // console.time('inferrece');
                  const result = await RNPytorch.predict(filePath);
                  // console.timeEnd('inferrece');
                  console.log(result);
                  setResults(result.slice(0, 3));
                } catch (err) {
                  console.log('err', err);
                }
              });
            }}
          />
          {results.map((result) => (
            <Text>{`${result.label} - ${result.confidence}`}</Text>
          ))}
        </View>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
});

export default App;
