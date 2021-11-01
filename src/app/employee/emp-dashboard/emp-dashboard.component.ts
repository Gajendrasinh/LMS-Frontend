import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpService } from 'src/app/service/http.service';
import { EChartsOption } from 'echarts';

@Component({
  selector: 'app-emp-dashboard',
  templateUrl: './emp-dashboard.component.html',
  styleUrls: ['./emp-dashboard.component.scss']
})
export class EmpDashboardComponent implements OnInit {
  
  chartOption: EChartsOption = {}

  isNoDataChart: boolean = true;
  filterDate: any = new Date();
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
    if (this.xAxisData.length > 0 && this.yAxisData.length > 0) {
      this.isNoDataChart = false;
      this.loadBarchart("category",this.xAxisData, this.yAxisData);
    } else {
      this.isNoDataChart = true;
    }
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
