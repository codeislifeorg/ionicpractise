import { EmiPage } from './../emi/emi';
import { EMIHISTORY, EMI_SEARCH_TYPE } from './../../app/common';
import { Storage } from '@ionic/storage';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the HistoryPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-history',
  templateUrl: 'history.html',
})
export class HistoryPage {

  EmiList: Array<any> = [];

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public storage: Storage) {

    console.log('HistoryPage > Constructor');
    console.log(EMI_SEARCH_TYPE.normal);
    this.storage.get(EMIHISTORY).then((val) => {
        
        console.log(val);
        if(!val) {
            this.storage.set(EMIHISTORY, []);
        }
       // val = val.sort((a, b) => a.searchDate.localeCompare(b.searchDate));

        // val.sort((a, b) => {
        //   console.log(a);
        //   return  +new Date(a.searchDate) - +new Date(b.searchDate);
        // });

        this.EmiList = val;
        
    });
  }

  private getTime(date?: Date) {
    console.log(date)
    console.log(date.getTime());
    return date != null ? date.getTime() : 0;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HistoryPage');
  }

  openEmiPage(item) {
    console.log('Open Page in History');
    console.log(item);

    if(item.searchType === EMI_SEARCH_TYPE.normal) {
      //  Open EMI Page
      console.log('Open EMI Page');
      item.from = 'history';
      this.navCtrl.push(EmiPage, item);
    } else {
      //  Open Loan Compare page
    }

  }

}
