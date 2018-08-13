export const enum EMI_SEARCH_TYPE {normal = 'normal', compare = 'compare'};
export const enum TENURE_TYPE { year = 'year', month = 'month' };
export const enum TENURE_TYPE_LABEL { year = 'Year(s)', month = 'Month(s)' };
export const enum CALC_TYPE { emi='emi', roi='roi', principal='principal', tenure='tenure'};

export interface EmiDO {
    tenureType: string,
    principal: number,
    interest: number,
    tenure: number,
    searchType: string,
    principal2?: number,
    interest2?: number,
    tenure2?: number,

    emi?: number
    searchDate?: Date,
    tenureInWords?: string,
    calcType?: String,

    id?: number,
    profileName?: string,
    loanDate?: Date,
} 

export const EMIHISTORY = 'history';
export const MYPROFILE = 'myprofile';


export function historyStorageLabel(): string {
  return EMIHISTORY;
}

export function calculateForEMI(data: any): EmiDO {
    console.log('calculateForEMI Func');
    console.log(data);

    let 
        emi:number = 0,
        interestPayable: number = 0,
        totalPayment: number = 0,
        p:number = 0,
        r:number = 0,
        n:number = 0,
        tenureInWords:string = '',
        searchDate: String = new Date().toISOString();

        p =  (typeof data.principal === "undefined") ? 0 : data.principal,
        r =  Number(data.interest /12/100),
        n =  Number((data.tenureType == TENURE_TYPE.year) ? (data.tenure * 12) : data.tenure);  
        //  in months, if it's in years, then convert it to months.

    emi = Number(data.emi);

    if( data.calcType == CALC_TYPE.emi) {
        console.log('EMI Calculation');
        emi = (p * r * Math.pow((1 + r),n)/( Math.pow((1 + r),n) - 1));
    }

    if( data.calcType == CALC_TYPE.roi) {
        console.log('ROI Calculation')
        r = 0;        
        r = ( emi / p ) * ( (Math.pow( (1+r), n) -1) / (Math.pow( (1+r), n) )  );
        data.interest = Number(r);
    }

    if( data.calcType == CALC_TYPE.principal) {
        console.log('Principal Calculation')
        let 
        firstpart = (emi / r),
        secondpart = (Math.pow((1 + r), n) - 1),
        thirdpart =  (Math.pow((1 + r), n));

        p =  firstpart * ( secondpart / thirdpart);
        p = Math.round(p * 100 ) /100;
        console.log("P: ", p);
        data.principal = p; 
    }

    if( data.calcType == CALC_TYPE.tenure) {
        console.log('Tenure Calculation')

        let x = 1+r,
        y = emi /  (emi - (p * r ));

        n =  Math.round(Math.log(y) / Math.log(x));

        console.log("Tenure: ", n);
        data.tenure = n;
        data.tenureType = TENURE_TYPE.month;
    }

    totalPayment = emi * n;
    interestPayable = totalPayment - data.principal;
    tenureInWords   = MonthYearInWords(n);

    data.emi =  Math.round(emi * 100 ) / 100;
    data.totalPayment = ( Math.round(totalPayment * 100 ) /100 );
    data.interestPayable = ( Math.round(interestPayable * 100 ) /100 );
    data.tenureInWords = tenureInWords;

    //  minor hack to fix the principal type cast
    data.principal = ( Number(data.principal) );

    //  search date
    // console.log("r = ", r)
    // console.log( "(1+r)^n = " , Math.pow((1+r), n) ) ;
    // console.log("(1+r)^(n-1) = ", Math.pow( (1+r), (n - 1) ));
    // console.log("Principal: ", data.principal.toLocaleString("en-IN", {maximumFractionDigits: 2}) )
    // console.log(typeof data.principal);
    // console.log(typeof totalPayment);
    console.log('Final Data');
    console.log(data);
    return data; 
}

export function MonthYearInWords(monthCount) {
    function getPlural(number, word) {
        return number === 1 && word.one || word.other;
    }

    var months = { one: 'month', other: 'months' },
        years = { one: 'year', other: 'years' },
        m = monthCount % 12,
        y = Math.floor(monthCount / 12),
        result = [];

    y && result.push(y + ' ' + getPlural(y, years));
    m && result.push(m + ' ' + getPlural(m, months));
    return result.join(' and ');
}