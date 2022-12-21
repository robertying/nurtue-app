import { useState } from "react";
import { Alert, NativeModules, Image, ScrollView, StyleSheet, Switch, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import BlueButton from "../components/BlueButton";
import BlueRingView from "../components/BlueRingView";
import Dialog from "../components/Dialog";
import MockPhoto from "../components/MockPhoto";
import OrangeButton from "../components/OrangeButton";
import Text from "../components/Text";
import TextButton from "../components/TextButton";
import Colors from "../constants/Colors";
import FontSize from "../constants/FontSize";
import { persistor, useAppSelector } from "../data/store";
import { getChildrenDescription } from "../lib/format";
import { ProfileStackScreenProps } from "../types/navigation";
import { Parent } from "../types/state";
import { UserSelection } from "./NewAgreement";

import { getAuth, onAuthStateChanged, updateProfile } from "firebase/auth";
import TermsCond from "../components/TermsCond";
import { TouchableHighlight, TouchableWithoutFeedback } from "react-native-gesture-handler";


const ProfileScreen: React.FC<ProfileStackScreenProps<"Profile">> = ({
  navigation,
  route,
}) => {  
  
  const insets = useSafeAreaInsets();

  const user = useAppSelector((state) => state.profileState.profile);

  const [unimpDialogOpen, setUnimpDialogOpen] = useState(false);
  const [termsDialogOpen, setTermsDialogOpen] = useState(false);
  

  // this feature is unimplemented 

  const handleUnimpDialogOpen = () => {
    setUnimpDialogOpen(true);
  };

  const handleUnimpDialogClose = () => {
    setUnimpDialogOpen(false);
  };

  const handleEditPress = () => {
    console.log("Push the edit profile screen")
    navigation.push("EditProfile")
  };

  // terms and conditions

  const handleTermsDialogOpen = () => {
    setTermsDialogOpen(true);
  };

  const handleTermsDialogClose = () => {
    setTermsDialogOpen(false);
  };

  const handleTerms = () => {
    handleTermsDialogOpen();
  };

  // privacy policy

  const handlePrivPol = () => {
    handleUnimpDialogOpen();
  };

  const handleMyPosts = () => {
    handleUnimpDialogOpen();
  };

  const handleReset = async () => {
    await persistor.purge();
    persistor.persist();
    NativeModules.DevSettings.reload();
  };

  const handleAddFamilyMember = () => {
    navigation.push("AddFamilyMember")
  }

  const handleDeleteFamilyMember = () => { 
    Alert.alert('Delete', 'Delete this family member?', [
      { text: 'Yes', onPress: () => {
        console.log("TODO: delete person from firestore") // should be async, awaiting deletion
        // once that's done...
        console.log("TODO: Reload 'My Family' or whole page to display current list")
      }},
      { text: 'No'},
    ])
  };

  const auth = getAuth();

  const [isEnabled, setIsEnabled] = useState(false);
  const togglePushNotifs = () => setIsEnabled(previousState => !previousState);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: insets.bottom + 40 }}
    >
      <BlueRingView
        style={styles.photoContainer}
        borderRadius={100}
        ringWidth={16}
      >
        {/* <MockPhoto style={styles.photo} name={user.user.photo} /> */}
        <Image style={styles.photo} source={{ uri: `${auth.currentUser?.photoURL}` }}/>
      </BlueRingView>
      <BlueRingView borderRadius={20}>
        <View style={styles.infoContainer}>
          <Text style={styles.nameText}>{auth.currentUser?.displayName}</Text>
          <Text>{getChildrenDescription(user.user as Parent)}</Text>
          <BlueButton shadow style={{marginTop: 12}} onPress={handleEditPress}>
            Edit My Info
          </BlueButton>
        </View>
      </BlueRingView>

      {/* LIST OF FAMILY MEMBERS... TRYING TO MOVE TO EDITPROFILE -CAT */}
    
      <View style={{marginBottom: 20}}>

        <View style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginTop: 20,
          paddingHorizontal: 10,
        }}>
          <Text style={styles.sectionText}>My Family</Text>
            <TouchableWithoutFeedback onPress={handleAddFamilyMember}>
              <Text style={{color: Colors.bluegreen}}>Add</Text>
            </TouchableWithoutFeedback>
         </View>

        {user.spouse && (
          <TouchableWithoutFeedback onPress={handleDeleteFamilyMember}>
            <UserSelection style={styles.userBox} user={user.spouse} />
          </TouchableWithoutFeedback>
          )}
        {user.children?.map((c) => (
          <TouchableWithoutFeedback>
            <UserSelection style={styles.userBox} key={c.user.id} user={c} />
          </TouchableWithoutFeedback>
          ))} 


      </View>

      <View style={styles.longButtonContainer}>
        <TextButton onPress={handleMyPosts}>
          My Posts
        </TextButton>
      </View>

      <View style={styles.longButtonContainer}>
        <Text style={{color: Colors.bluegreen, fontSize: FontSize.emphasis}}>Push Notifications</Text>
        <Switch
          value={isEnabled}
          onValueChange={togglePushNotifs}
        />
      </View>

      <View style={styles.longButtonContainer}>
        <TextButton onPress={handleTerms}>
          Terms & Conditions
        </TextButton>
      </View>

      <View style={styles.longButtonContainer}>
        <TextButton onPress={handlePrivPol}>
          Privacy Policy
        </TextButton>
      </View>

      <OrangeButton shadow style={{marginTop: 12}} onPress={handleReset}>
        Log Out
      </OrangeButton>

      {/* <TextButton style={styles.resetButton} onPress={handleReset}>
        Reset App (DEV ONLY)
      </TextButton> */}

      <Text style={{
        marginVertical: 30,
        textAlign: 'center',
        color: Colors.bluegreen,
        flexDirection: 'row',
      }}>Copyright 2022 - Nurtue, Inc.</Text>


      <Dialog isVisible={unimpDialogOpen} title="Unimplemented" type="success">
        <Text style={styles.dialogText}>
          This feature has not been implemented.
        </Text>
        <BlueButton
          style={styles.dialogButton}
          selected
          onPress={handleUnimpDialogClose}
        >
          Ok
        </BlueButton>
      </Dialog>

      <Dialog isVisible={termsDialogOpen} title="Terms & Conditions" type="success">
        <TermsCond/>
        <BlueButton
          style={styles.dialogButton}
          selected
          onPress={handleTermsDialogClose}
        >
          Ok
        </BlueButton>
      </Dialog>

      
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: Colors.lightblue,
  },
  longButtonContainer: {
    marginVertical: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    width: '100%',
    backgroundColor: "white",
    borderRadius: 25,
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    shadowColor: Colors.grey,
    shadowOffset: {
      width: 0,
      height: 4
    },
    shadowOpacity: .15,
  },
  photoContainer: {
    width: 160,
    height: 160,
    borderRadius: 80,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  photo: {
    width: 152,
    height: 152,
    borderRadius: 76,
  },
  infoContainer: {
    padding: 15,
    alignItems: "center",
  },
  nameText: {
    fontSize: FontSize.header,
    fontFamily: "semibold",
    marginBottom: 8,
    marginTop: -4,
  },
  sectionText: {
    fontFamily: "semibold",
  },
  editButton: {
    marginTop: 40,
  },
  dialogText: {
    marginTop: 10,
  },
  dialogButton: {
    marginTop: 20,
  },
  userBox: {
    marginTop: 10,
  },
});

export default ProfileScreen;
