import React, {useState, Component} from 'react';
import {View, Text, StatusBar, StyleSheet, TouchableOpacity, Modal, Image, PermissionsAndroid, Platform, Alert, Dimensions,    } from 'react-native';
import {RNCamera} from 'react-native-camera';



export default function App(){
  const[type, SetType]= useState(RNCamera.Constants.Type.front);
  const[open, setOpen]= useState(false);
  const[capturedPhoto, setCapturedPhoto]=useState(null);
 



  async function takePicture(camera){
    const options={quality:0.5, base64: true};
    const data = await camera.takePictureAsync(options);

    setCapturedPhoto(data.uri);
    setOpen(true);
    console.log('FOTO TIRADA CAMERA'+ data.uri);
    //Chama função de salvar no álbum
    savePicture(data.uri);
  }
  async function hasAndroidPermission(){
    const permission=PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;

    const hasPermission = await PermissionsAndroid.check(permission);
    if(hasPermission){
      return true;
    }

    const status =  await PermissionsAndroid.request(permission);
    return status==='granted';
  }
  
  async function savePicture(data){
    if(Platform.OS ==='android'&& !(await hasAndroidPermission())){
      return;
    }

   

  }

  function toggleCam(){
    SetType(type===RNCamera.Constants.Type.front ? RNCamera.Constants.Type.back:RNCamera.Constants.Type.front);
  }

  return(
    <View style={styles.container}>
      
      <StatusBar hidden={true}/>
      <RNCamera 
      style={styles.preview}
      type={type}
      flashMode={RNCamera.Constants.FlashMode.auto}
      androidCameraPermissionOptions={{
        title:'Permissao camera',
        message: 'Nós precisamos de sua permissão para acessar a câmera',
        buttonPositive: 'Ok',
        buttonNegative: 'Cancelar'
        
      }}
      >
        {({camera, status, recordAndroidPermissionStatus})=>{
          if(status !== 'READY')return <View/>;
          return(
              <View style={styles.camera}>
                <TouchableOpacity
                onPress={()=>takePicture(camera)}
                style={styles.capture}
                >
                  <Text>
                    Tirar foto
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                onPress={()=>{}}
                style={styles.capture}
                >
                  <Text>
                    Álbum de fotos
                  </Text>
                </TouchableOpacity>

              </View>
             
          );

        }}

      </RNCamera>
        <View style={styles.composition}>
          <TouchableOpacity onPress={toggleCam}>
            <Text>Trocar</Text>
          </TouchableOpacity>
        </View>

      { capturedPhoto &&
        <Modal animationType="slide" transparent={false} visible={open}>
          <View style={{flex:1, justifyContent:'center',alignItems:'center', margin:20}}>
          <TouchableOpacity 
            style={{margin:10}}
            onPress={()=> setOpen(false)}
            >
            <Text>Fechar</Text>
          </TouchableOpacity>
          <Image
          resizeMode="contain"
          style={{width:350, height:450, borderRadius:15}}
          source={{uri: capturedPhoto}}
          />
          </View>

        </Modal>
      }

      


    </View>
  );
}

const styles=StyleSheet.create({
  container:{
    flex:1,
    justifyContent:'center',
  },
  preview:{
    flex:1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  camera:{
    marginBottom:35,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  capture:{
    flex:0,
    backgroundColor:'#FFF',
    fontSize:17,
    borderRadius:5,
    padding:15,
    paddingHorizontal:20,
    alignSelf:'center',
    margin:20,
  },
  composition:{
    backgroundColor:'#FFF',
    borderRadius:5,
    padding:10,
    height: 40,
    position: 'absolute',
    right: 25,
    top:60,


  }
});