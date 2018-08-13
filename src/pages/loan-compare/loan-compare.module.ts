import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LoanComparePage } from './loan-compare';

@NgModule({
  declarations: [
    LoanComparePage,
  ],
  imports: [
    IonicPageModule.forChild(LoanComparePage),
  ],
})
export class LoanComparePageModule {}
