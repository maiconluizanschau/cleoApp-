import { UserService } from './../user/user';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { Camera } from '@ionic-native/camera';

//novo
import { FirebaseListObservable, AngularFireDatabase, FirebaseObjectObservable } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { FirebaseApp } from 'angularfire2/firebase.app.module';
import * as firebase from 'firebase';
import { User } from '../../models/user.models';
//

@Injectable()
export class CameraProvider {

  items: FirebaseListObservable<any[]>;

  user: FirebaseObjectObservable<User>;


  constructor(private camera: Camera,
    private fb: FirebaseApp,
    private userService: UserService
    //
  ) {

    //let path = '/users/' + this.angularFireAuth.auth.currentUser.uid;
    //this.items = db.list(path);

    this.user = this.userService.currentUser;
  }
  getPictureFromCamera() {
    return this.getImage(this.camera.PictureSourceType.CAMERA, true);
  }

  // This method takes optional parameters to make it more customizable
  getImage(pictureSourceType, crop = false, quality = 50, allowEdit = true, saveToAlbum = true) {
    const options = {
      quality,
      allowEdit,
      destinationType: this.camera.DestinationType.DATA_URL,
      sourceType: pictureSourceType,
      encodingType: this.camera.EncodingType.PNG,
      saveToPhotoAlbum: saveToAlbum
    };

    // If set to crop, restricts the image to a square of 600 by 600
    if (crop) {
      options['targetWidth'] = 200;
      options['targetHeight'] = 200;
    }

    return this.camera.getPicture(options).then(imageData => {
      const base64Image = 'data:image/png;base64,' + imageData;
      return base64Image;
    }, error => {
      console.log('CAMERA ERROR -> ' + JSON.stringify(error));
    });
  }


  //FAZ O UPLOADO DA FOTO
  public uploadAndSave(item: any) {

    let storageRef = this.fb.storage().ref();//referencia a storage
    //let basePath = '/usersPhotos/' + this.angularFireAuth.auth.currentUser.uid;
    let fullPath = '/usersPhotos/' + item.key + '/' + item.key + '.png';
    let uploadTask = storageRef.child(fullPath).putString(item.fileToUpload, 'base64');

    uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
      (snapshot) => {
        //var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        //console.log(progress + "% done");
      },
      (error) => {
        console.error(error);
      },
      () => {
        let url = uploadTask.snapshot.downloadURL;//url da foto
        this.user.update({//update no user
          photo: url
        });

      });

  }
}
