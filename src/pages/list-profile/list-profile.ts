import { EmiPage } from './../emi/emi';
import { Storage } from '@ionic/storage';
import { MYPROFILE } from './../../app/common';
import { HomePage } from './../home/home';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';

/**
 * Generated class for the ListProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-list-profile',
  templateUrl: 'list-profile.html',
})
export class ListProfilePage {
  MyProfiles: Array<any> = [];
  from: string =  '';

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public storage: Storage,
    public modal: ModalController) {

    console.log('ListProfilePage > Constructor');
    this.from = this.navParams.get('from');

    this.storage.get(MYPROFILE).then((val) => {
        if(!val) {
            this.storage.set(MYPROFILE, []);
        }
        this.MyProfiles = val;        
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ListProfilePage');
  }

  goHome() {
    this.navCtrl.setRoot(HomePage);
  }

  openProfile(item) {
    console.log(item); 
    //this.navCtrl.push(ViewProfilePage, {from: 'home'});
    const modal   =  this.modal.create('EditProfilePage', {data: item });
    modal.present();
    modal.onDidDismiss(data => {
        console.log('Modal closed');
        console.log(data);
        if(data) {
          data.from = 'listprofile';
          this.navCtrl.push(EmiPage, data);
        }
    });
  }

}
