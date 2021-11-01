import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpService } from '../service/http.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {

  isEditProfile: boolean = false;
  constructor(private router: Router, public httpService: HttpService, public activeRoute: ActivatedRoute) { }

  ngOnInit(): void {
    if (this.router.url.startsWith("/" + this.httpService.userRole + "/editProfile")) {
      this.isEditProfile = true;
    }
  }

  profileEdit() {
    this.router.navigateByUrl(this.httpService.userRole + "/editProfile");
  }

}
