import * as React from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import BackIcon from '../../icons/BackIcon';
import WebView from 'react-native-webview';
import {dictionary2Trans} from '../../../app/utils/LanguageUtils';

interface PolicyPreviewProps {
  navigation?: any;
}

const PolicyPreview: React.FC<PolicyPreviewProps> = ({
  navigation,
}: PolicyPreviewProps) => {
  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          height: 35,
          marginBottom: 15,
        }}>
        <TouchableOpacity
          accessibilityLabel="Back"
          style={{
            position: 'absolute',
            left: 20,
            top: 0,
            padding: 4,
            paddingRight: 12,
          }}
          onPress={() => navigation.goBack()}>
          <BackIcon width={25} height={25} fill="#000" />
        </TouchableOpacity>
        <Text
          style={{
            color: '#000',
            fontFamily: 'Poppins-Medium',
            fontSize: 15,
          }}>
          {dictionary2Trans('Terms & Privacy')}
        </Text>
      </View>
      <WebView
        source={{uri: 'https://vnpublisher.com/privacypolicy.html'}}
        style={{flex: 1}}
      />
    </View>
  );
};

export default PolicyPreview;

const styles = StyleSheet.create({
  container: {
    paddingTop: StatusBar.currentHeight,
    height: '100%',
    width: '100%',
    backgroundColor: '#fff',
  },
});
