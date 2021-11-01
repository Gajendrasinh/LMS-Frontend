import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/service/http.service';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-add-category',
  templateUrl: './add-category.component.html',
  styleUrls: ['./add-category.component.scss'],
})
export class AddCategoryComponent implements OnInit {
  public categoryForm: FormGroup;
  categories: any = [];
  categoryFile: any;
  categoryLogo: '';
  isEdit: boolean = false;

  constructor(
    public formBuilder: FormBuilder,
    public httpService: HttpService,
    private router: Router
  ) {
    this.categoryForm = this.formBuilder.group({
      name: new FormControl(null, Validators.compose([Validators.required])),
      tmpname: new FormControl(null),
      subCategory: new FormControl(
        '',
        Validators.compose([Validators.required])
      ),
      image: new FormControl(''),
    });
  }

  ngOnInit(): void {
    this.getCategory();
  }

  categorySel(val: any) {
    if (val == 'Add New Category') {
      this.categoryForm.controls['image'].disable();
    } else {
      this.categoryForm.controls['image'].enable();
    }
  }
  saveCategory(value: any) {
    let _value: any = value;
    if (_value.name == 'Add New Category') {
      _value.name = value.tmpname;
    } else {
      _value._id = _value.name;
    }

    this.httpService.spinner.show();
    if (this.categoryFile != undefined && this.categoryFile != null) {
      this.uploadCategoryLogo(this.categoryFile, _value);
    } else {
      this.addEditCategory(_value);
    }
  }

  fileSelectChange(event: any) {
    this.categoryLogo = event.target.files[0].name;
    this.categoryFile = event.target.files[0];
  }

  uploadCategoryLogo(file: any, val: any) {
    let urlEndPoint;
    let obj = new FormData();
    urlEndPoint = 'upload/file?folder=images';
    obj.append('file', file, file.name);

    this.httpService
      .httpRequest(urlEndPoint, obj, 'post', true, false)
      .subscribe((resp) => {
        if (resp.status == 'success' && resp.responseCode == '200') {
          this.categoryForm.get('image').patchValue(resp.data.path);
          val['image'] = resp.data.path;
          this.addEditCategory(val);
        } else {
          this.httpService.spinner.hide();
        }
      });
  }

  getCategory() {
    this.httpService.spinner.show();
    this.httpService
      .httpRequest('admin/category/list?value=name', '', 'get', false, true)
      .subscribe((resp) => {
        if (resp.status == 'success' && resp.responseCode == '200') {
          let categories: any[] = resp.data.list;
          categories.push({
            name: 'Add New Category',
            _id: 'Add New Category',
          });
          this.categories = categories;
        } else {
          let categories: any[];
          categories.push({
            name: 'Add New Category',
            _id: 'Add New Category',
          });

          this.categories = categories;
        }
        this.httpService.spinner.hide();
      });
  }

  addEditCategory(val: any) {
    let catObj = {};
    let url: any = '';

    //catObj['name'] = val.name ? val.name : '';
    catObj['subCategory'] = val.subCategory ? val.subCategory : '';
    catObj['image'] = val.image ? val.image : '';
    if (val.tmpname != '' && val.tmpname != null && val.tmpname != undefined) {
      catObj['name'] = val.tmpname;
      url = 'admin/category?isCategory=true';
    } else {
      catObj['id'] = val.name;
      catObj['name'] = '';
      url = 'admin/category?isCategory=false';
    }

    this.httpService
      .httpRequest(url, catObj, 'post', false, true)
      .subscribe((resp) => {
        if (resp.status == 'success' && resp.responseCode == '200') {
          this.router.navigateByUrl(this.httpService.userRole + '/categories');
        } 
        this.httpService.spinner.hide();
      });
  }
}
