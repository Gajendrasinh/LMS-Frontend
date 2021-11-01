import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-update-module',
  templateUrl: './add-update-module.component.html',
  styleUrls: ['./add-update-module.component.scss']
})
export class AddUpdateModuleComponent implements OnInit {

  data: any;
  title: any = "";
  roleList: any[] = [];
  assignRole: any = null;

  profileImg: any = '';
  profileImageFile: any;

  public moduleForm: FormGroup;

  constructor(public activeModal: NgbActiveModal, public formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.title = this.data.title == 'edit' ? "edit module" : "Add new module";

    this.moduleForm = this.formBuilder.group({
      moduelName: new FormControl("", Validators.compose([Validators.required])),
      role: new FormControl("", Validators.compose([Validators.required])),
      route: new FormControl("", Validators.compose([Validators.required])),
      img: new FormControl("", Validators.compose([Validators.required])),
    });

  }

  close(type: any) {
    this.activeModal.close(type);
  }

  updatePermission() {

  }

  fileSelectChange(event: any) {
    this.profileImg = event.target.files[0].name;
    this.profileImageFile = event.target.files[0];
  }

  submitForm(val:any){

  }
}
