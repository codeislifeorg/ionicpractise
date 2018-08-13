import { ListProfilePage } from './../list-profile/list-profile';
import { HistoryPage } from './../history/history';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { AlertController } from 'ionic-angular';
import { EMIHISTORY, EmiDO, calculateForEMI, EMI_SEARCH_TYPE, TENURE_TYPE, TENURE_TYPE_LABEL, CALC_TYPE } from '../../app/common';

@IonicPage()
@Component({
  selector: 'page-emi',
  templateUrl: 'emi.html',
})

export class EmiPage {

  selectTenure: any;
  monthOrYear: string;
  principal: number;
  principalAmountInWords: string;
  emi: number;
  interest: number;
  tenure: number;
  saveButtonDisable: Boolean = false;
  storedEmiList: any;
  searchDate: String;
  EmiResultSet: EmiDO;
  DetailedBreakUp: Array<Object> = [];
  calcType: String;

  constructor(
        public navCtrl: NavController, 
        public navParams: NavParams, 
        public storage: Storage,
        public alertCtrl: AlertController,
        public modal: ModalController
    ) {
        
    console.log('EMI > constructor');
    console.log( this.navParams );
    this.monthOrYear = TENURE_TYPE_LABEL.year;
    this.selectTenure = true;
    this.saveButtonDisable = true;

    //  If type is emi | roi | principal | tenure
    //  based on that show or hide fields
    //  To find EMI
    //      Show -> Principal, Tenure, Interest
    //  To find ROI (Interest)
    //      Show -> Principal, EMI, Tenure
    //  To find Principal
    //      Show -> EMI, Interest, Tenure

    if(this.navParams.get('calcType')) {
        this.calcType = this.navParams.get('calcType');
        console.log(this.calcType);
    }

    if(this.navParams.get('from')) {
        console.log('calculate EMI with params');

        this.principal = this.navParams.get('principal');
        this.interest = this.navParams.get('interest');
        this.tenure = this.navParams.get('tenure');
        this.emi = this.navParams.get('emi');
        let tenureType = this.navParams.get('tenureType');

        this.monthOrYear = (tenureType === TENURE_TYPE.year) ? TENURE_TYPE_LABEL.year : TENURE_TYPE_LABEL.month;
        this.searchDate = this.navParams.get('searchDate');

        if( this.calcType == CALC_TYPE.emi) {
            this.onPrincipalChange();
            this.EmiResultSet = calculateForEMI({
                principal: this.principal,
                interest: this.interest,
                tenure: this.tenure,
    
                tenureType: (this.monthOrYear === 'Year(s)') ?  TENURE_TYPE.year : TENURE_TYPE.month,
                searchType: EMI_SEARCH_TYPE.normal,
                searchDate: this.searchDate,
                calcType: this.calcType
            }); 
        }
    
        if( this.calcType == CALC_TYPE.roi) {
            this.onPrincipalChange();
            this.EmiResultSet = calculateForEMI({
                principal: this.principal,
                tenure: this.tenure,
                emi: this.emi,
    
                tenureType: (this.monthOrYear === 'Year(s)') ?  TENURE_TYPE.year : TENURE_TYPE.month,
                searchType: EMI_SEARCH_TYPE.normal,
                searchDate: this.searchDate,
                calcType: this.calcType
            }); 
        }
    
        if( this.calcType == CALC_TYPE.principal) {
            this.EmiResultSet = calculateForEMI({
                interest: this.interest,
                tenure: this.tenure,
                emi: this.emi,
                
                tenureType: (this.monthOrYear === 'Year(s)') ?  TENURE_TYPE.year : TENURE_TYPE.month,
                searchType: EMI_SEARCH_TYPE.normal,
                searchDate: this.searchDate,
                calcType: this.calcType
            }); 
        }
    
        if( this.calcType == CALC_TYPE.tenure) {
            this.onPrincipalChange();
            this.EmiResultSet = calculateForEMI({
                interest: this.interest,
                principal: this.principal,
                emi: this.emi,
                
                tenureType: (this.monthOrYear === 'Year(s)') ?  TENURE_TYPE.year : TENURE_TYPE.month,
                searchType: EMI_SEARCH_TYPE.normal,
                searchDate: this.searchDate,
                calcType: this.calcType
            }); 
        }
    
        this.getDetailedBreakDown(this.EmiResultSet);
    }

    this.storage.get(EMIHISTORY).then((val) => {
        if(!val) {
            this.storage.set(EMIHISTORY, []);
        }
    });
  }

  onSelectTenure($event) {
    console.log('EMI > onSelectTenure');
    this.monthOrYear = TENURE_TYPE_LABEL.month;

    if(this.selectTenure)
      this.monthOrYear  = TENURE_TYPE_LABEL.month;
  }

  public onKeyUp(event: any) {
    const MY_REGEXP =  /^\s*(\-|\+)?(\d+|(\d*(\.\d*)))([eE][+-]?\d+)?\s*$/;;

    let newValue = event.target.value;
    let regExp = new RegExp(MY_REGEXP);

    console.log(newValue.toLocaleString("en-IN"));
    // if (!regExp.test(newValue)) {
    //   event.target.value = newValue.slice(0, -1);
    // }
  }

  ionViewDidLoad() {}
  
  saveProfile() {
    console.log('EMI > saveProfile');

    let emiData = this.EmiResultSet;
    emiData.id = null;
    const modal   =  this.modal.create('EditProfilePage', {data: emiData });
    modal.present();
    modal.onDidDismiss(data => {
        // Call the method to do whatever in your home.ts
        console.log('Modal closed');
        console.log(data);
        if(data) {
            this.navCtrl.setRoot(ListProfilePage, {from: 'emi'}, {animate: true, direction: "forward"});
        }
    });
  }

  onPrincipalChange() {
    if( this.principal) {
        var principalAmountInWords = this.number2text(this.principal);
        this.principalAmountInWords = principalAmountInWords;
    } else {
        this.principalAmountInWords = '';
    }
  }

  calculate(emiForm) {
    console.log('EMI > calculateEMI');
    var errorMessage = [];
    console.log(emiForm);
    
    // Doing some basic form validation based on calculation type
    if( !emiForm.form.valid ) {
        if( !emiForm.form.controls.principal.valid ) {
            if( !emiForm.form.controls.principal.value || emiForm.form.controls.principal.value == '' ) {
                errorMessage.push('Principal amount is empty');
            }
        }

        if( !emiForm.form.controls.interest.valid ) {
            if( !emiForm.form.controls.interest.value || emiForm.form.controls.interest.value == '' ) {
                errorMessage.push('Interest is empty');
            }
        }

        if( !emiForm.form.controls.tenure.valid ) {
            if( !emiForm.form.controls.tenure.value || emiForm.form.tenure.interest.value == '' ) {
                errorMessage.push('Tenure is empty');
            }
        }
    }

    if(errorMessage.length) {
        var errorMessageToDisplay = '';
        for(var i = 0, len = errorMessage.length; i < len; i++) {
            errorMessageToDisplay +=  errorMessage[i] + '<br/>';
        }

        let alert = this.alertCtrl.create({
            title: 'Error!',
            subTitle: errorMessageToDisplay,
            buttons: ['Dismiss']
        });
        alert.present();

        return;
    }

    this.saveButtonDisable = false;

    if( this.calcType == CALC_TYPE.emi) {
        this.EmiResultSet = calculateForEMI({
            principal: this.principal,
            interest: this.interest,
            tenure: this.tenure,

            tenureType: (this.monthOrYear === 'Year(s)') ?  TENURE_TYPE.year : TENURE_TYPE.month,
            searchType: EMI_SEARCH_TYPE.normal,
            searchDate: new Date(),
            calcType: this.calcType
        }); 
    }

    if( this.calcType == CALC_TYPE.roi) {
        this.EmiResultSet = calculateForEMI({
            principal: this.principal,
            tenure: this.tenure,
            emi: this.emi,

            tenureType: (this.monthOrYear === 'Year(s)') ?  TENURE_TYPE.year : TENURE_TYPE.month,
            searchType: EMI_SEARCH_TYPE.normal,
            searchDate: new Date(),
            calcType: this.calcType
        }); 
    }

    if( this.calcType == CALC_TYPE.principal) {
        this.EmiResultSet = calculateForEMI({
            interest: this.interest,
            tenure: this.tenure,
            emi: this.emi,
            
            tenureType: (this.monthOrYear === 'Year(s)') ?  TENURE_TYPE.year : TENURE_TYPE.month,
            searchType: EMI_SEARCH_TYPE.normal,
            searchDate: new Date(),
            calcType: this.calcType
        }); 
    }

    if( this.calcType == CALC_TYPE.tenure) {
        this.EmiResultSet = calculateForEMI({
            interest: this.interest,
            principal: this.principal,
            emi: this.emi,
            
            tenureType: (this.monthOrYear === 'Year(s)') ?  TENURE_TYPE.year : TENURE_TYPE.month,
            searchType: EMI_SEARCH_TYPE.normal,
            searchDate: new Date(),
            calcType: this.calcType
        }); 
    }

    this.storeEMIValues(this.EmiResultSet);
    this.getDetailedBreakDown(this.EmiResultSet);
  }

  storeEMIValues(emi: EmiDO) {
    var storedEmiList = [];
    this.storage.get(EMIHISTORY).then((data) => {
        if(data) {
            storedEmiList = data;

            if(!this.isEMIValuesAlreadyExist(storedEmiList, emi)) {
                
                storedEmiList.push(emi);

                storedEmiList.sort((a, b) => {
                    return  +new Date(b.searchDate) - +new Date(a.searchDate);
                });
                this.storage.set(EMIHISTORY, storedEmiList);
            }         
        }
    });
  }

  isEMIValuesAlreadyExist(storedList, emi) {
    var temp;
    for( var i = 0, len = storedList.length; i < len; i++ ) {
        temp = storedList[i];
        if(temp.searchType === EMI_SEARCH_TYPE.normal) {
            if(temp.principal === emi.principal 
                && temp.interest === emi.interest
                && temp.tenure === emi.tenure
                && temp.tenureType === emi.tenureType ) {
                    return true;
            }
        }        
    }
    return false;
  }

  getDetailedBreakDown(EmiResultSet: EmiDO) {
    console.log('EMI > getDetailedBreakDown');
    console.log(EmiResultSet);
    //  n is number of months
    let n = (EmiResultSet.tenureType === TENURE_TYPE.year) ? EmiResultSet.tenure * 12 : EmiResultSet.tenure; 

    let balance: number = EmiResultSet.principal,
    interest: number = 0,
    principalComponent: number = 0,
    interestComponent: number = 0,
    dt: Date = new Date(EmiResultSet.searchDate);

    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun","Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    for(var i = 0, len = n; i < len; i++ ) {    
        interestComponent = (((balance) / 100 ) * 30 ) / 12;
        // console.log("(balance - principalComponent) = " + (balance - principalComponent));
        principalComponent = EmiResultSet.emi - interestComponent;
        // console.log('interestComponent: ' + interestComponent);
        // console.log('principalComponent: ' + principalComponent);
        // console.log("P" + i + " + " + "i" + i + " = " + emiFromPrincipal);
        balance = balance - principalComponent;

        dt.setDate( dt.getDate() + i);
        // console.log("Date: " + dt
        //             + ", P" + i + " = " + principalComponent.toFixed(2) 
        //             + ", i" + i + " = " + interestComponent.toFixed(2) 
        //             + ", Balance = " + balance.toFixed(2));
        //console.log(dt.toLocaleDateString() + ", " + days[dt.getDay()] + ", " + dt.getFullYear())
        //dayNames[dt.getDay()] + " " + 

        this.DetailedBreakUp.push({
            'date': monthNames[dt.getMonth()] + " " + dt.getFullYear(),
            'principal': Number(principalComponent),
            'interest': Number(interestComponent),
            'balance': Number(balance)
        });
    }
  }

//   suffixWithDate(i) {
//     var j = i % 10,
//         k = i % 100;
//     if (j == 1 && k != 11) {
//         return i + "st";
//     }
//     if (j == 2 && k != 12) {
//         return i + "nd";
//     }
//     if (j == 3 && k != 13) {
//         return i + "rd";
//     }
//     return "<sup>" + i + "th" + "</sup>";
//  }

  totalAmountToPay(data) {
    console.log('Total Amount To Pay');
   console.log(data); 
  }

  openPage(page: string) {
    console.log('EMI > openPage > ', page);

    if(page === 'history') {
        this.navCtrl.push(HistoryPage); 
    }
    if(page === 'save') {
        //this.navCtrl.push(SaveProfilePage);
    }
  }

  //    Common utils function
  number2text(value) {
    var fraction = Math.round(this.frac(value)*100);
    var f_text  = "";

    if(fraction > 0) {
        f_text = "And "+this.convert_number(fraction)+" Paise";
    }

    return this.convert_number(value)+" Rupee "+f_text+" Only";
  }

  frac(f) {
      return f % 1;
  }

  convert_number(number) {
    if ((number < 0) || (number > 999999999)) 
    { 
        return "Number Out of Range!";
    }
    var Gn = Math.floor(number / 10000000);  /* Crore */ 
    number -= Gn * 10000000; 
    var kn = Math.floor(number / 100000);     /* lakhs */ 
    number -= kn * 100000; 
    var Hn = Math.floor(number / 1000);      /* thousand */ 
    number -= Hn * 1000; 
    var Dn = Math.floor(number / 100);       /* Tens (deca) */ 
    number = number % 100;               /* Ones */ 
    var tn= Math.floor(number / 10); 
    var one=Math.floor(number % 10); 
    var res = ""; 

    if (Gn>0) 
    { 
        res += (this.convert_number(Gn) + " Crore"); 
    } 
    if (kn>0) 
    { 
            res += (((res=="") ? "" : " ") + 
            this.convert_number(kn) + " Lakh"); 
    } 
    if (Hn>0) 
    { 
        res += (((res=="") ? "" : " ") +
            this.convert_number(Hn) + " Thousand"); 
    } 

    if (Dn) 
    { 
        res += (((res=="") ? "" : " ") + 
            this.convert_number(Dn) + " Hundred"); 
    } 


    var ones = Array("", "One", "Two", "Three", "Four", "Five", "Six","Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve", "Thirteen","Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen","Nineteen"); 
    var tens = Array("", "", "Twenty", "Thirty", "Fourty", "Fifty", "Sixty","Seventy", "Eighty", "Ninety"); 

    if (tn>0 || one>0) 
    { 
        if (!(res=="")) 
        { 
            res += " And "; 
        } 
        if (tn < 2) 
        { 
            res += ones[tn * 10 + one]; 
        } 
        else 
        { 

            res += tens[tn];
            if (one>0) 
            { 
                res += ("-" + ones[one]); 
            } 
        } 
    }

    if (res=="")
    { 
        res = "zero"; 
    } 
    return res;
  }

}