public with sharing class customSearchSobjectLWC {


@AuraEnabled(cacheable=true)
public static list<document__C> getDocumentList(string searchKey) {
    string searchKeyword = '%' + searchKey + '%';
    
   // create contact list to store search result 
    list<document__C> documentListRecord = new list<document__C>();
 
   // query contact records
    for(document__C docObj : [Select id,Name,Document_Version__C,Document_Category__C
                        From Document__C
                        WHERE name LIKE : searchKeyword ORDER BY Name ASC]){
        documentListRecord.add(docObj);
    }
    
     if(documentListRecord.size() == 0){
        throw new AuraHandledException('No Record Found..'); 
     }
     
    return documentListRecord;
}
}