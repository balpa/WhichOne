import React from 'react'
import { Text, View, StyleSheet, ScrollView, Image, useWindowDimensions, Animated, Platform } from 'react-native'
import { Button, Icon, Input } from 'react-native-elements'
import { useState, useEffect } from 'react'
import { auth } from '../firebase'
import { db } from '../firebase'
import * as ImagePicker from 'expo-image-picker';
import { ImageBrowser } from 'expo-image-picker-multiple'
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, setDoc, updateDoc, arrayUnion, getDoc } from "firebase/firestore";
import { useNavigation } from '@react-navigation/native'

function UploadPhoto({ }) {

  const user = auth.currentUser

  const navigation = useNavigation()

  const [image, setImage] = useState([])
  const [postUniqueID, setPostUniqueID] = useState(new Date().getTime()) // unique id for each post. created using date ms
  const [isLoaded, setIsLoaded] = useState(false)
  const [descriptionText, setDescriptionText] = useState("")
  const [shadowSettings, setShadowSettings] = useState({})

  const storage = getStorage()
  // const postRef = ref(storage, `Users/${user.uid}/posts/${postUniqueID}/`) // storage'da postun yerini belirleme

  const window = useWindowDimensions()    // hook to get the window dimensions

  let height4posts = (window.width * 3) / 4    // height of the post calculated by the width of the screen
  let height4postcontainer = ((window.width * 3) / 4) + 50   // height of the post container calculated by the width of the screen plus the gap needed for likes comments etc. section

  // TODO: Animation removes buttons after picking an image. need to fix animations

  // const YAnimTop = new Animated.Value(-500)
  // const YAnimBottom = new Animated.Value(500)

  // useEffect(() => {
  //   Animated.timing(YAnimTop, {
  //     toValue: 0,
  //     duration: 500,
  //     useNativeDriver: true,
  //   }).start()
  // }, [])

  // useEffect(() => {
  //   Animated.timing(YAnimBottom, {
  //     toValue: 0,
  //     duration: 500,
  //     useNativeDriver: true,
  //   }).start() 
  // } , [])

  useEffect(() => {
    if (Platform.OS == 'android') { setShadowSettings({ elevation: 10 }) }
    else if (Platform.OS == 'ios') {
      setShadowSettings({
        shadowColor: '#171717',
        shadowOffset: { width: -1, height: 3 },
        shadowOpacity: 0.5,
        shadowRadius: 5,
      })
    }
  }, [])

  // for selecting multiple images. current library not good. need to find a better way
  const ImageBrowserComponent = () => {
    return (<ImageBrowser onChange={(num, onSubmit) => { }} callback={(callback) => { }} />)
  }

  useEffect(() => {         // set description character limit max to 50
    if (descriptionText.length > 50) {
      alert("Description cannot be longer than 100 characters")
      setDescriptionText(descriptionText.substring(0, 50))
    }
  }, [descriptionText])


  // camera permissions
  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
        if (status !== 'granted') alert('Sorry, we need camera roll permissions to make this work!')
      }
    })();
  }, [])

  useEffect(() => {
    if (isLoaded) navigation.navigate('HomePage')
  }, [isLoaded])

  // image picker from library NEED TO ADD MULTIPLE SELECTION (need another library)
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    })

    // if image is selected, set image uri to state
    if (!result.cancelled && image.length < 5) {
      setImage(oldArray => [...oldArray, result.uri]);
    }
    else if (image.length >= 5) alert("You can only upload up to 5 images")
  }

  //upload image blob to firebase storage
  async function upload() {

    let uniqID = new Date().getTime() // unique id for each post. created using date ms
    setPostUniqueID(uniqID)

    if (image) {
      updateDoc(doc(db, "posts", `${user.uid}`), {
        postID: arrayUnion(postUniqueID)
      })
      setDoc(doc(db, "posts", `${user.uid}`, `${postUniqueID}`, "postData"), {
        photoCount: image.length,
        // photoURLs: []
      })

      await getDoc(doc(db, "postInfo", `${postUniqueID}`))    // set post info on postInfo collection
        .then((document) => {
          setDoc(doc(db, "postInfo", `${postUniqueID}`), {
            photoCount: image.length,
            userID: user.uid,
            date: new Date().toLocaleString(),
            likes: [],
            comments: [],
            photoURLs: [],
            name: user.displayName,
            description: descriptionText
          })
        })


      image.map(async (img, index) => {

        const photoRef = ref(storage, `Users/${user.uid}/posts/${postUniqueID}/photo${index + 1}`) // storage'da fotoğrafın yerini belirleme (post unique id içinde)

        await setDoc(doc(db, "posts", `${user.uid}`, `${postUniqueID}`, `photo${index + 1}`), {   // set details for each photo
          postID: postUniqueID,
          isLiked: false,
          userID: user.uid,
          userName: user.displayName,
        })

        const imgInside = await fetch(img)
        const imgInsideBlob = await imgInside.blob()  // convert image to blob

        uploadBytes(photoRef, imgInsideBlob)

          // updates photo's url in the post's document tree in db
          .then(async () => {
            const downloadURL = await getDownloadURL(photoRef)

            await updateDoc(doc(db, "posts", `${user.uid}`, `${postUniqueID}`, `photo${index + 1}`), { // add image url to photos field in db
              imageURL: downloadURL,
            })

            await updateDoc(doc(db, 'postInfo', `${postUniqueID}`), {      // add image urls to postInfo-postid
              photoURLs: arrayUnion(downloadURL)
            })

            await getDoc(doc(db, "posts", `${user.uid}`, `${postUniqueID}`, `postData`))   // get postData and check if imageURLs exist. if not, create and add etc
              .then((document) => {

                if (document.data().imageURLs === undefined) {
                  setDoc(doc(db, 'posts', `${user.uid}`, `${postUniqueID}`, `postData`), {
                    imageURLs: [downloadURL],
                  })
                }                     // SOMETIMES IT DOESN'T ADD ALL URLS TO THE ARRAY. NEED TO FIX
                else {
                  updateDoc(doc(db, 'posts', `${user.uid}`, `${postUniqueID}`, `postData`), {
                    imageURLs: arrayUnion(downloadURL),
                  })
                }
              })
          })
      })

      setIsLoaded(true)
    }
  }

  return (
    <View style={styles.component}>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'space-evenly' }}>
        <Animated.View style={[styles.addButtonIconWrapper, shadowSettings]}>
          <Button title={<Icon name="collections" color="white" />} onPress={pickImage} titleStyle={{ color: "black", fontSize: 25 }} buttonStyle={styles.createPostButtons} />
        </Animated.View>
        <ScrollView style={styles.scrollViewStyling} horizontal={true} minimumZoomScale={1} maximumZoomScale={2} pagingEnabled={true} pinchGestureEnabled={true}>
          {image.map((img, index) => {
            return (
              <>
                <View style={styles.imageContainer}>
                  <Image source={{ uri: img }} style={{ width: window.width - 2, height: height4posts }} />
                  <Text style={{ color: "black" }}>{`${index + 1}/${image.length}`}</Text>
                  <Button onPress={() => { console.log("need to add this") }} title='remove' />
                </View>
              </>
            )
          })
          }
        </ScrollView>
        <View
          style={{
            position: 'absolute',
            bottom: 150,
          }}>
          <Text>Description: {descriptionText}</Text>
        </View>
        <View
          style={{
            position: 'absolute',
            width: '100%',
            height: 50,
            bottom: 90,
          }}>
          <Input style={styles.textInput} placeholder="Add a description" onChangeText={(text) => setDescriptionText(text)} value={descriptionText} />
        </View>
        <Animated.View style={[styles.uploadIconWrapper, shadowSettings]}>
          <Icon name="send" color="white" />
          <Button title="Upload" onPress={() => upload()} titleStyle={{ color: "white", fontSize: 25 }} buttonStyle={styles.createPostButtons} />
        </Animated.View>
      </View>
    </View>
  )
}

export default UploadPhoto

const styles = StyleSheet.create({
  component: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
    zIndex: 10,
    backgroundColor: 'white'
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
    top: "50%"
  },
  imageContainer: {
    flexDirection: "column",
    alignItems: "center",
  },
  textInput: {

  }

})
