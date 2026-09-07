  import { Text, View, StyleSheet, Image } from 'react-native';


 export default function AssetExample() {
   return (
     <View style={styles.container}>


     </View>
   );
 }



 const styles = StyleSheet.create({
   container: {
     backgroundColor: 'pink',
     alignItems: 'center',
     justifyContent: 'center',
     padding: 24,
     flex: 1,

   },
   paragraph: {
     margin: 24,
     marginTop: 0,
     fontSize: 14,
     fontWeight: 'bold',
     textAlign: 'center',
   },
   logo: {
     height: 128,
     width: 128,
   }
 });