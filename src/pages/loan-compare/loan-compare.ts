import { Storage } from '@ionic/storage';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { EMIHISTORY, EmiDO, calculateForEMI, EMI_SEARCH_TYPE, TENURE_TYPE, CALC_TYPE } from '../../app/common';
/**
 * Generated class for the LoanComparePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-loan-compare',
  templateUrl: 'loan-compare.html',
})
export class LoanComparePage {

  principal1: number;
  interest1: number;
  tenure1: number;
  principal2: number;
  interest2: number;
  tenure2: number;
  emiObj: EmiDO;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public storage: Storage,
    public alertCtrl: AlertController) {

    this.storage.get(EMIHISTORY).then((val) => {
      if(!val) {
          this.storage.set(EMIHISTORY, []);
      }
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoanComparePage');
  }

  calculate(form) {
    console.log('LoanCompare > calculate');
    console.log(form);

    let emi1, emi2;
    emi1 = calculateForEMI({
      principal: this.principal1,
      interest: this.interest1,
      tenure: this.tenure1,
      tenureType: TENURE_TYPE.year,

      searchType: EMI_SEARCH_TYPE.compare,
      searchDate: new Date(),
      calcType: CALC_TYPE.emi
    });

    emi2 = calculateForEMI({
      principal: this.principal2,
      interest: this.interest2,
      tenure: this.tenure2,
      tenureType: TENURE_TYPE.year,

      searchType: EMI_SEARCH_TYPE.compare,
      searchDate: new Date(),
      calcType: CALC_TYPE.emi
    });

    console.log('EMI 1:', emi1)
    console.log('EMI 2:', emi2)

    this.store(emi1, emi2);
  }

  store(emi1: EmiDO, emi2: EmiDO) {
    console.log('EMI > storeEMIValues');
    var storedList = [];
    this.storage.get(EMIHISTORY).then((data) => {
        if(data) {
            console.log('Inside GET Storage');
            console.log(data);
            storedList = data;

            console.log(this.isEMIAlreadyExist(storedList, emi1, emi2));
            if(!this.isEMIAlreadyExist(storedList, emi1, emi2)) {
              console.log('EMI DOES NOT EXIST');
              let emi = {
                principal: emi1.principal,
                interest: emi1.interest,
                tenure: emi1.tenure,
                tenureType: TENURE_TYPE.year,
                principal2: emi2.principal,
                interest2: emi2.interest,
                tenure2: emi2.tenure,
                tenureType2: TENURE_TYPE.year,
                searchType: EMI_SEARCH_TYPE.compare
              }
              storedList.push(emi);
              this.storage.set(EMIHISTORY, storedList);
            }

            console.log('Stored EMI List');
            console.log(storedList);            
        }
    });
  }

  isEMIAlreadyExist(storedList, emi1, emi2): boolean {
    var temp;
    for( var i = 0, len = storedList.length; i < len; i++ ) {
      temp = storedList[i];
      if(temp.searchType === EMI_SEARCH_TYPE.compare) {
        if(
          temp.principal === emi1.principal 
          && temp.interest === emi1.interest
          && temp.tenure === emi1.tenure
          && temp.tenureType === emi1.tenureType
          && temp.principal2 === emi2.principal2 
          && temp.interest2 === emi2.interest2
          && temp.tenure2 === emi2.tenure2
          && temp.tenureType2 === emi2.tenureType2 ) {
              return true;
        }
      }        
    }
    return false;
  }

}
