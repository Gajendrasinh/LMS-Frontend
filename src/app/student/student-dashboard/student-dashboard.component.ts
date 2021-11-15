import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpService } from 'src/app/service/http.service';
import { EChartsOption } from 'echarts';
import Tabulator from 'tabulator-tables';

@Component({
  selector: 'app-student-dashboard',
  templateUrl: './student-dashboard.component.html',
  styleUrls: ['./student-dashboard.component.scss']
})
export class StudentDashboardComponent implements OnInit {

  chartOption: EChartsOption = {}
  chartOption1: EChartsOption = {}

  certificateCount: any = '0';
  badgesCount: any = '0';
  initOpts = {
    renderer: "svg",
    height: 500,
    width: 500,
    containLabel: false
  };

  stdExamResultTbl: any;
  staffTblList: any[] = [];

  xAxisData: any = [] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  yAxisData: any = [] = [820, 932, 901, 934, 1290, 1330, 1320];

  xAxisData1: any = [] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  yAxisData1: any = [] = [820, 932, 901, 934, 1290, 1330, 1320];

  constructor(private router: Router, public httpService: HttpService) { }

  ngOnInit(): void {
    this.getStdDashDetail();
    this.loadBarchart("category", this.xAxisData, this.yAxisData);
    this.loadBarchart1("category", this.xAxisData, this.yAxisData);
  }

  getStdDashDetail() {
    this.httpService.spinner.show();
    this.httpService.httpRequest("student/dashboard", "", "get", false, true).subscribe((resp) => {
      if (resp.status == "success" && resp.responseCode == "200") {
        this.badgesCount = resp.data.detail?.badges.length;
        if(resp.data.detail?.exams != undefined && resp.data.detail?.exams.length > 0){
          this.setExamListingTbl(resp.data.detail?.exams);
        }
      }
      this.httpService.spinner.hide();
    })
  }

  earnedBades(type: any) {
    if (type == 'Badges') this.router.navigateByUrl('student/earnedBadges');
    else this.router.navigateByUrl('/student/certificateEarned');
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

  setExamListingTbl(data:any) {
    this.stdExamResultTbl = new Tabulator("#exam-result-table", {
      height: '100%',
      layout: 'fitColumns',
      columnHeaderVertAlign: 'bottom',
      pagination: 'local',
      paginationSize: 10,
      tooltipGenerationMode: 'hover',
      paginationSizeSelector: [10, 100, 500, 1000],
      movableColumns: true,
      responsiveLayout: true,
      placeholder: 'No records found.',
      headerFilterPlaceholder: '',
      ajaxFiltering: false,
      ajaxLoader: false,
      tooltipsHeader: true,
      paginationDataSent: {
        page: 'pageNumber',
        size: 'perPage',
      },
      ajaxContentType: "json",
      columns: [
        { title: "Exam", field: "name", sorter: "string" },
        { title: "Type", field: "type", sorter: "string" },
        { title: "Total Marks", field: "total", sorter: "string" },
        { title: "Mark Obtained", field: "totalMarksObtained", sorter: "string" },
        { title: "Date", field: "examDate", sorter: "string" },
      ],
      data:data
    });
  }

}
