import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-add-update-user-permission',
  templateUrl: './add-update-user-permission.component.html',
  styleUrls: ['./add-update-user-permission.component.scss']
})
export class AddUpdateUserPermissionComponent implements OnInit {

  data: any;
  title: any = "";
  roleList: any[] = [];
  assignRole: any = null;

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
    this.title = this.data.title == 'edit' ? "edit permission" : "Add permission";
  }

  close(type: any) {
    this.activeModal.close(type);
  }

  updatePermission(){
    
  }

}
