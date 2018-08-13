import { MYPROFILE, EmiDO } from './../../app/common';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
/**
 * Generated class for the EditProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

interface ProfileDO {
  id: number,
  profileName: string,
  loanDate: string,
  tenureType: boolean,
  principal: number,
  interest: number,
  tenure: number
}

@IonicPage()
@Component({
  selector: 'page-edit-profile',
  templateUrl: 'edit-profile.html',
})
export class EditProfilePage {

  principal: number;
  emi: number;
  interest: number;
  tenure: number;
  tenureType: boolean;
  loanDate: String = new Date().toISOString();
  id: number = null;  //  for ID  new Date().valueOf() to make it unique values;
  profileObj: ProfileDO;
  profileName: string;
  EmiResultSet: EmiDO;
  
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    private view: ViewController,
    public storage: Storage) {

    this.storage.get(MYPROFILE).then((val) => {
        if(!val) {
            this.storage.set(MYPROFILE, []);
        }
    });
  }

  ionViewWillLoad() {
    console.log('Edit Profile ionViewWillLoad');
    const data = this.navParams.get('data');
    console.log(data);
    this.EmiResultSet = data;
    this.principal = data.principal;
    this.interest = data.interest;
    this.tenure = data.tenure;
    this.tenureType = data.tenuretype;

    this.id = data.id;
    this.profileName = data.profileName;   
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EditProfilePage');
  }

  saveProfile(frm) {
    console.log('Save Profile');
    console.log(frm);

    // this.profileObj  =  {
    //   id: (this.id) ? this.id : new Date().valueOf(),
    //   profileName: frm.controls.profileName.value,
    //   loanDate: frm.controls.loanDate.value,
    //   tenureType: this.tenureType,
    //   principal: frm.controls.principal.value,
    //   interest: frm.controls.interest.value,
    //   tenure: frm.controls.tenure.value
    // }

    this.EmiResultSet.profileName = frm.controls.profileName.value;
    this.EmiResultSet.loanDate = frm.controls.loanDate.value;
    this.EmiResultSet.id = (this.id) ? this.id : new Date().valueOf();
    console.log(this.EmiResultSet);

    let storedList = [];
   
    
    this.storage.get(MYPROFILE).then((val) => {
      if(val) {
        console.log('Inside GET Storage');
        storedList = val;
        console.log(val);

        if(!this.isStoredValueExist(storedList, this.EmiResultSet.id)) {
          storedList.push(this.EmiResultSet);
          this.storage.set(MYPROFILE, storedList);
        } else {
          console.log('Already exisit, then pick that item and modify it');
          for( var i = 0, len = storedList.length; i < len; i++ ) {
           
            if(storedList[i].id === this.id) {
              storedList[i] = this.EmiResultSet;
              break;
            }
          }

          this.storage.set(MYPROFILE, storedList);
        }
      }
    });

    this.closeModal(true);
  }

  isStoredValueExist(storedList, id: number) {
    var temp;
    for( var i = 0, len = storedList.length; i < len; i++ ) {
        temp = storedList[i];
        if(temp.id === id) {
          return true;
        }
    }
    return false;
  }

  closeModal(bool) {
    this.view.dismiss(bool);
  }

  getDetails() {
    this.view.dismiss(this.EmiResultSet);

  }
}