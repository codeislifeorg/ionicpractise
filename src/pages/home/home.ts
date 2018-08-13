import { ListProfilePage } from './../list-profile/list-profile';
import { HistoryPage } from './../history/history';
import { LoanComparePage } from './../loan-compare/loan-compare';
import { EmiPage } from './../emi/emi';
import { Component, ViewChild } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { CALC_TYPE } from './../../app/common';
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  // @ViewChild('username') username;
  // @ViewChild('password') password;

  constructor(public navCtrl: NavController, public alertCtrl: AlertController) {

  }

  openEmi(type: string) {
    console.log('Home > openEmi > ', type);
    
    if(type === 'emi') 
      this.navCtrl.push(EmiPage, {calcType: CALC_TYPE.emi});
    else if(type == 'roi')
      this.navCtrl.push(EmiPage, {calcType: CALC_TYPE.roi});
    else if(type == 'tenure')
      this.navCtrl.push(EmiPage, {calcType: CALC_TYPE.tenure});
    else if(type == 'principal')
      this.navCtrl.push(EmiPage, {calcType: CALC_TYPE.principal});
      
  }

  loanCompare() {
    this.navCtrl.push(LoanComparePage);
  }

  history() {
    this.navCtrl.push(HistoryPage);
  }

  listProfiles() {
    this.navCtrl.push(ListProfilePage, {from: 'home'});
  }
}