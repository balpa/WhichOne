import React from "react";
import {
  View,
  StyleSheet,
  Animated,
  ActivityIndicator,
} from "react-native";
import { Button, Icon } from "react-native-elements";
import { useState, useEffect } from "react";
import { auth } from "../firebase";
import * as ImagePicker from "expo-image-picker";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import AsyncStorage from "@react-native-async-storage/async-storage";

function UploadAvatar() {
  const currentUser = auth.currentUser;
  const storage = getStorage();
  const avatarRef = ref(storage, `Users/${currentUser.uid}/avatars/avatar_image`) // storage'da avatarın yerini belirleme

  const [image, setImage] = useState(null)
  const [selectedTheme, setSelectedTheme] = useState("")
  const [textColorDependingOnTheme, setTextColorDependingOnTheme] = useState("")
  const [currentAvatar, setCurrentAvatar] = useState(null)

  const uploadButtonAnim = React.useRef(new Animated.Value(300)).current
  const addButtonAnim = React.useRef(new Animated.Value(-400)).current
  const currentAvatarAnim = React.useRef(new Animated.Value(-400)).current
  const currentAvatarTextAnim = React.useRef(new Animated.Value(-400)).current
  const imageAnim = React.useRef(new Animated.Value(0)).current

  useEffect(() => {
    setTimeout(() => {    //animations for buttons (gonna be earlier)
      Animated.spring(uploadButtonAnim, {
        toValue: 0,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }).start()

      Animated.spring(addButtonAnim, {
        toValue: 0,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }).start()
    }, 300)

    setTimeout(() => {    // animations for current avatar section
      Animated.spring(currentAvatarAnim, {
        toValue: 0,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }).start()

      Animated.spring(currentAvatarTextAnim, {
        toValue: 0,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }).start()
    }, 400)

  }, [])

  useEffect(() => {
    if (image) {
      Animated.timing(imageAnim, {
        toValue: 1,
        duration: 700,
        useNativeDriver: false
      }).start()
    }
  }, [image])

  getDownloadURL(ref(storage, `Users/${currentUser.uid}/avatars/avatar_image`)) // get avatar
    .then((url) => setCurrentAvatar(url))
    .catch((error) => console.log(error))

  useEffect(async () => {
    // get theme data from local storage (cache) ***HARDCODED***
    try {
      const value = await AsyncStorage.getItem("GLOBAL_THEME");
      if (value !== null) {
        setSelectedTheme(value);
        if (value == "light") setTextColorDependingOnTheme("black");
        else setTextColorDependingOnTheme("white");
      }
    } catch (e) {
      console.log(e);
    }
  }, []);

  useEffect(() => {
    (async () => {
      if (Platform.OS !== "web") {
        const { status } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          alert("Sorry, we need camera roll permissions to make this work!");
        }
      }
    })();
  }, []);

  // image picker from library
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    // if image is selected, set image uri to state
    if (!result.cancelled) {
      result.fileName = "avatar_image";
      setImage(result.uri);
    }
  };

  //upload image blob to firebase storage
  async function upload() {
    if (image) {
      const img = await fetch(image);
      const imgblob = await img.blob();

      uploadBytes(avatarRef, imgblob).then((snapshot) => {
        console.log("uploaded");
      });
    }
  }

  return (
    <View
      style={[
        styles.component,
        selectedTheme == "dark" ? { backgroundColor: "rgb(15,15,15)" } : {},
      ]}>
      <View
        style={{
          width: "100%",
          height: 110,
          justifyContent: "center",
          alignItems: "center",
        }}>
        <Animated.Text
          style={[
            selectedTheme == "dark"
              ? { color: "white", fontSize: 17, fontWeight: "900" }
              : { color: "black", fontSize: 17, fontWeight: "900" },
            { transform: [{ translateY: currentAvatarTextAnim }] }
          ]
          }
        >
          Current Avatar
        </Animated.Text>
        {currentAvatar == null ? <ActivityIndicator size="large" color="crimson" /> :
          <Animated.Image
            source={{ uri: currentAvatar }}
            style={[{ width: 60, height: 60, borderRadius: 60 / 2, marginBottom: 15 }, { transform: [{ translateY: currentAvatarAnim }] }]}
          />
        }
      </View>
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "space-evenly",
        }}
      >
        <Animated.View style={[styles.addButtonIconWrapper, { transform: [{ translateY: addButtonAnim }] }]}>
          <Button
            title={<Icon name="collections" color="white" />}
            onPress={pickImage}
            titleStyle={{ color: "black", fontSize: 25 }}
            buttonStyle={styles.createPostButtons}
          />
        </Animated.View>
        {image && (
          <Animated.Image source={{ uri: image }} style={[{ width: 200, height: 200 }, { transform: [{ scale: imageAnim }] }]} />
        )}
        <Animated.View style={[styles.uploadIconWrapper, { transform: [{ translateY: uploadButtonAnim }] }]}>
          <Icon name="send" color="white" />
          <Button
            title="Upload"
            onPress={() => upload()}
            titleStyle={{ color: "white", fontSize: 25 }}
            buttonStyle={styles.createPostButtons}
          />
        </Animated.View>
      </View>
    </View>
  );
}

export default UploadAvatar;

const styles = StyleSheet.create({
  component: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
    backgroundColor: "#ffffff",
    zIndex: 10,
    paddingBottom: 50,
    paddingTop: 25,
  },
  uploadIconWrapper: {
    position: "absolute",
    bottom: 0,
    marginBottom: 5,
    height: 60,
    flexDirection: "row",
    width: "80%",
    backgroundColor: "crimson",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
  },
  addButtonIconWrapper: {
    position: "absolute",
    top: -1,
    marginTop: 5,
    width: 70,
    height: 70,
    flexDirection: "row",
    backgroundColor: "crimson",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 70 / 2,
    zIndex: 20,
  },

  createPostButtons: {
    borderWidth: 0,
    backgroundColor: "transparent",
    justifyContent: "flex-start",
  },
  scrollViewStyling: {
    top: "50%",
  },
  imageContainer: {
    flexDirection: "column",
    alignItems: "center",
  },
});
