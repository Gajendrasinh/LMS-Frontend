import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-tutor-dashboard',
  templateUrl: './tutor-dashboard.component.html',
  styleUrls: ['./tutor-dashboard.component.scss']
})
export class TutorDashboardComponent implements OnInit {

  constructor() { }

  arrayList: any[] = [1, 2, 3];

  ngOnInit(): void {
  }

}
