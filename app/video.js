import { useCallback, useState } from 'react';
import { Alert, Button, StyleSheet, Text, View } from 'react-native'

import YouTubePlayer from 'react-native-youtube-iframe';

const Video = () => {

    const [playing ,setPlaying] = useState(false);

    const onStateChange = useCallback(state => {
        if(state === 'ended'){
            setPlaying(false);
            Alert.alert('video has finished playing!');
        }
    }, []);

    const togglePlaying = useCallback(() => {
        setPlaying(prev =! prev);
    },[]);


  return (
    <View style={{}}>
        <Text style={{fontFamily: "serif", fontSize: 16, fontWeight: 'bold', marginTop: 10, marginBottom: 10, paddingVertical:10, color: '#3A3D42',}}>Want to know more about Working Process of EvePlano? Watch this video to know how EvePlano contacts you and execute your event plans!</Text>
        <YouTubePlayer
        style={{ borderRadius:20, marginTop: 5}}
        height={230}
        play= {playing}
        videoId={'I-XjdcpfXoI'}
        onChangeState={onStateChange}
        />
        
    </View>
  )
}

export default Video

const styles = StyleSheet.create({
  container: {
  },
});
