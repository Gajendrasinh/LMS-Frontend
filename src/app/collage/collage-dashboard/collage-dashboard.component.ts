import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EChartsOption } from 'echarts';
import { HttpService } from 'src/app/service/http.service';

@Component({
  selector: 'app-collage-dashboard',
  templateUrl: './collage-dashboard.component.html',
  styleUrls: ['./collage-dashboard.component.scss']
})
export class CollageDashboardComponent implements OnInit {

  chartOption: EChartsOption = {}
  totalStudent: any = 0;
  totalStaff: any = 0;
  totalCourse: any = 0;
  totalReport: any = 0;
  initOpts = {
    renderer: "svg",
    height: 400,
    width: 500,
    containLabel: false
  };

  xAxisData: any = [] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  yAxisData: any = [] = [820, 932, 901, 934, 1290, 1330, 1320];

  constructor(private router: Router, public httpService: HttpService) {
  }

  ngOnInit(): void {
    this.loadBarchart("category", this.xAxisData, this.yAxisData);
    this.getDashboradData();
  }

  getDashboradData() {
    this.httpService.spinner.show();
    this.httpService.httpRequest("college/dashboard", "", "get", false, true).subscribe((resp) => {
      if (resp.status == "success" && resp.responseCode == "200") {
        this.totalStudent= resp.data?.dashboard?.studentCount;
        this.totalStaff = resp.data?.dashboard?.staffCount;
        this.totalCourse = resp.data?.dashboard?.courseCount;
      }
      this.httpService.spinner.hide();
    })
  }

  loadBarchart(xAxisType: any, xAxisData: any, yAxisData: any) {
    this.chartOption = {
      animationDurationUpdate: 300,
      animationEasing: 'cubicInOut',
      animationEasingUpdate: 'cubicInOut',

      xAxis: {
        type: xAxisType,
        boundaryGap: true,
        data: xAxisData,
        show: true,
        axisLine: {
          show: true,
        },
        axisTick: {
          show: true
        },
        axisLabel: {
          showMaxLabel: true,
        },
      },
      yAxis: {
        type: 'value',
        show: true,
        axisLine: {
          show: true
        },
        axisTick: {
          show: true
        },
        axisLabel: {
          showMaxLabel: true,
        }
      },
      series: [{
        type: 'bar',
        barMaxWidth: 35,
        barMinWidth: 35,
        label: {
          show: true,
          position: 'inside',
          fontSize: 16,
          fontFamily: 'Poppins'
        },
        data: yAxisData,
        itemStyle: {
          borderRadius: 5,
        }
      }]
    }
  }
}
