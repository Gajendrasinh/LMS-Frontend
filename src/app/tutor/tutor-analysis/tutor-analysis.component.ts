import { Component, OnInit } from '@angular/core';
import { EChartsOption } from 'echarts';

@Component({
  selector: 'app-tutor-analysis',
  templateUrl: './tutor-analysis.component.html',
  styleUrls: ['./tutor-analysis.component.scss']
})
export class TutorAnalysisComponent implements OnInit {

  chartOption: EChartsOption = {};
  chartOption1: EChartsOption = {};

  initOpts = {
    renderer: "svg",
    height: 400,
    width: 1000,
    containLabel: false
  };

  xAxisData: any = [] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  yAxisData: any = [] = [820, 932, 901, 934, 1290, 1330, 1320];
  constructor() { }

  ngOnInit(): void {
    this.loadBarchart("category",this.xAxisData, this.yAxisData);
    this.loadBarchart1("category",this.xAxisData, this.yAxisData);
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

  loadBarchart1(xAxisType: any, xAxisData: any, yAxisData: any) {
    this.chartOption1 = {
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
