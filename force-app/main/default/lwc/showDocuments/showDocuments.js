import { LightningElement,track, api, wire} from 'lwc';
import { refreshApex } from '@salesforce/apex';
// import server side apex class method 
import getDocumentList from '@salesforce/apex/customSearchSobjectLWC.getDocumentList';
// import standard toast event 
import {ShowToastEvent} from 'lightning/platformShowToastEvent';
import DOCUMENT_OBJECT from '@salesforce/schema/Document__c';
import NAME_FIELD from '@salesforce/schema/Document__c.Name';
import Document_Version from '@salesforce/schema/Document__c.Document_Version__c';
import Document_Category from '@salesforce/schema/Document__c.Document_Category__c';

const actions = [
    { label: 'Edit', name: 'edit' },
    { label: 'Remove', name: 'remove' },
];

const columns = [
    { label: 'Name', fieldName: 'Name' },
    { label: 'Document Version', fieldName: 'Document_Version__c', type: 'number' },
    { label: 'Document Category', fieldName: 'Document_Category__c'},
    {
        type: 'action',
        typeAttributes: { rowActions: actions },
    },]


export default class ShowDocuments extends LightningElement {

    data = [];
    columns = columns;
    record = {};

    nameField = NAME_FIELD;
    doc_Version = Document_Version;
    doc_Category = Document_Category;

    @track recordId;
    @track objectApiName;
    @track docData;
    @track isModalOpen = false;
    
    /*
    @api searchword;
    
    @wire(getDocumentList, { searchKey: item })
    wiredInfo({ error, data }) {
        alert('In child cmp '+this. searchword);
        if (data) {
            alert(JSON.stringify(data));
           // this.apexData = data;
            this.error = undefined;
        } else if (error) {
            this.error = error;
            
        }
    }*/



@api handleSearchKeyword(item1) {
    if (item1 !== '') {
        getDocumentList({
                searchKey: item1
            })
            .then(result => { 
                this.docData = result;
                this.data = this.docData;
            })
            .catch(error => {
               
                const event = new ShowToastEvent({
                    title: 'Error',
                    variant: 'error',
                    message: error.body.message,
                });
                this.dispatchEvent(event);
                // reset contacts var with null   
                this.documentRecord = null;
            });
    } else {
        // fire toast event if input field is blank
        const event = new ShowToastEvent({
            variant: 'error',
            message: 'Search text missing..',
        });
        this.dispatchEvent(event);
    }
}

handleRowAction(event) {
    const actionName = event.detail.action.name;
    const row = event.detail.row;
    switch (actionName) {
        case 'remove':
            this.deleteRow(row);
            break;
        case 'edit':
            this.editRowDetails(row);
            break;
        default:
    }
}

deleteRow(row) {
    const { id } = row;
    const index = this.findRowIndexById(id);
    if (index !== -1) {
        this.data = this.data
            .slice(0, index)
            .concat(this.data.slice(index + 1));
    }

}

findRowIndexById(id) {
    let ret = -1;
    this.data.some((row, index) => {
        if (row.id === id) {
            ret = index;
            return true;
        }
        return false;
    });
    return ret;
}

editRowDetails(row) {
    this.record = row;
    this.isModalOpen = true;
    this.recordId = this.record.Id;
    this.objectApiName = DOCUMENT_OBJECT;  
    
}

openModal() {
    this.isModalOpen = true;    
}
closeModal() {
    this.isModalOpen = false;
    this.getLatest();
}
submitDetails() {
    this.isModalOpen = false;
    this.getLatest();
}

getLatest() {
    refreshApex(this.docData)
    .then(()=> {
        this.dispatchEvent(
            new ShowToastEvent({
                title: 'Success',
                message: 'Refreshed Data',
                variant: 'success'
            })
        );
    })
    .catch((error) => {
        let errors=reduceErrors(error).reduce((accumulator, currentValue) => accumulator.concat(', ', currentValue), '');
        this.dispatchEvent(
            new ShowToastEvent({
                title: 'Error Refreshing Data',
                message: errors.substring(2),
                variant: 'error'
            })
        );
    });
}
}