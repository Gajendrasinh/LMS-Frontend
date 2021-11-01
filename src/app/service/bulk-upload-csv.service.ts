import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BulkUploadCsvService {

  constructor() { }

  getDataRecordsArrayFromCSVFile(csvRecordsArray: any, headerLength: any, title: any) {
    let csvArr = [];
    let isNotNull: boolean = true;
    for (let i = 1; i < csvRecordsArray.length; i++) {
      let curruntRecord = (<string>csvRecordsArray[i]).split(',');
      if (curruntRecord.length == headerLength) {
        isNotNull = this.checkCsvValueNotNull(curruntRecord, title)
        if (isNotNull) {
          this.setCsvObj(csvArr, curruntRecord, title);
        } else {
          break;
        }
      }
    }
    return !isNotNull ? { msg: "Please provider valid csv", arrObj: [] } : { msg: "CSV data read", arrObj: csvArr };
  }

  isValidCSVFile(file: any) {
    return file.name.endsWith(".csv");
  }

  getHeaderArray(csvRecordsArr: any) {
    let headers = (<string>csvRecordsArr[0]).split(',');
    let headerArray = [];
    for (let j = 0; j < headers.length; j++) {
      headerArray.push(headers[j]);
    }
    return headerArray;
  }

  setCsvObj(csvArr: any, curruntRecord: any, title: any) {
    let csvRecord: any = {};

    if (title == "Student" || title == "Employee" || title == "Staff") {
      csvRecord.firstname = curruntRecord[0].trim();
      csvRecord.lastname = curruntRecord[1].trim();
      csvRecord.email = curruntRecord[2].trim();
      csvRecord.dob = curruntRecord[3].trim();
      csvRecord.dateofjoining = curruntRecord[4].trim();
      csvRecord.department = curruntRecord[5].trim();
      csvRecord.coursename = curruntRecord[6].trim();
      csvRecord.address = curruntRecord[7].trim();
      csvRecord.phone = curruntRecord[8].trim();
      csvRecord.logo = "";
      csvArr.push(csvRecord);

    } else if (title == "Collage") {
      csvRecord.name = curruntRecord[0].trim();
      csvRecord.email = curruntRecord[1].trim();
      csvRecord.phone = curruntRecord[2].trim();
      csvRecord.address = curruntRecord[3].trim();
      csvRecord.noofstaffs = curruntRecord[4].trim();
      csvRecord.department = [curruntRecord[5].trim()];
      csvRecord.logo = "";
      csvArr.push(csvRecord);
    } else if (title == "Course") {
      csvRecord.name = curruntRecord[0].trim();
      csvRecord.description = curruntRecord[1].trim();
      csvRecord.college = curruntRecord[2].trim();
      csvRecord.logo = "";
      csvRecord.file = "";
      csvArr.push(csvRecord);
    } else if (title == "mcq") {
      csvRecord.question = curruntRecord[0].trim();
      csvRecord.answer = curruntRecord[1].trim();
      csvRecord.marks = parseInt(curruntRecord[2].trim());
      csvRecord.option1 = curruntRecord[3].trim();
      csvRecord.option2 = curruntRecord[4].trim();
      csvRecord.option3 = curruntRecord[5].trim();
      csvRecord.option4 = curruntRecord[6].trim();
      csvArr.push(csvRecord);
    } else if (title == "essay" || title == "code") {
      csvRecord.question = curruntRecord[0].trim();
      csvRecord.marks = parseInt(curruntRecord[1].trim());
      csvArr.push(csvRecord);
    }
  }

  checkCsvValueNotNull(curruntRecord: any, title: any) {
    let isNotNull: boolean = true;
    let count;
    if (title == "Student" || title == "Employee" || title == "Staff") count = 8;
    else if (title == "Collage") count = 5;
    else if (title == "Course") count = 2;
    else if (title == "mcq") count = 6;
    else if (title == "essay" || title == "code") count = 1;

    if (count != undefined) {
      for (let i = 0; i < count; i++) {
        if (curruntRecord[i] == undefined || curruntRecord[i].trim() == '') { isNotNull = false; break }
      }
    }
    return isNotNull;
  }

}
