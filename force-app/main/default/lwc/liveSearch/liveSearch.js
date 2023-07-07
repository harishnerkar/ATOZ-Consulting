import { LightningElement,track, api} from 'lwc';
// import server side apex class method 
import getDocumentList from '@salesforce/apex/customSearchSobjectLWC.getDocumentList';
// import standard toast event 
import {ShowToastEvent} from 'lightning/platformShowToastEvent'
 
export default class customSearch extends LightningElement {
    
    @api documentRecord;
    @track searchValue = '';
    showTable =false;
 
    // update searchValue var when input field value change
    searchKeyword(event) {
        this.searchValue = event.target.value;
    }
    
    // call apex method on button click 
    handleSearchKeyword() {
        //this.showTable= true; 
        this.documentRecord = this.searchValue;
        //this.showTable= true;
        this.template.querySelector("c-show-documents").handleSearchKeyword(this.documentRecord);
    } 
}