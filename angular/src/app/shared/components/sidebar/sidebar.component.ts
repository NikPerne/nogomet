import { Component, Input, OnInit } from "@angular/core";
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexDataLabels,
  ApexXAxis,
  ApexPlotOptions
} from "ng-apexcharts";
import { DemoDataService } from "../../services/demo-data.service";
import { User } from "../../classes/user";

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  xaxis: ApexXAxis;
};

@Component({
  selector: "app-sidebar",
  template: `<apx-chart [series]="chartOptions.series" [chart]="chartOptions.chart"[dataLabels]="chartOptions.dataLabels" [plotOptions]="chartOptions.plotOptions"[xaxis]="chartOptions.xaxis"></apx-chart><br><br><div class="ratio ratio-4x3">
  <div>
  <h4 class="mt-1 mb-1">
  <a
    class="link-primary text-decoration-none"
    ><i class="fa-solid fa-futbol me-2"></i
    >Kje se nahaja? PROšport Stražišče Kranj</a
  >
</h4>
  </div>
  <iframe
    title="Zamljevid"
    [src]="
      'https://maps.google.com/maps?q=' +
        46.232536 +
        ',' +
        14.34166 +
        '&z=15&output=embed' | allowUrl
    "
    class="rounded-3"
  ></iframe>
</div>`,
  styles: [],
})
export class SidebarComponent implements OnInit {
  @Input() content: string = "";

  users: User[] = [];

  chartOptions: ChartOptions = {
    series: [{
      name: "Obiskal",
      data: [],
    }],
    chart: {
      type: "bar",
      height: 150,
      width: 300,
    },
    plotOptions: {
      bar: {
        horizontal: true,
      },
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      categories: [],
    },
  };

  constructor(private demoDataService: DemoDataService) {}

  ngOnInit() {
    this.getUsers();
  }

  getUsers() {
    this.demoDataService.getUsers(10).subscribe((users) => {
      this.users = users;
  
      // Create new data array in the required format
      const newData = this.users.map((user) => {
        return { x: user.name, y: user.timesSignedUp };
      });
  
      // Update the chartOptions with the new data
      this.chartOptions = {
        ...this.chartOptions,
        series: [{ data: newData }],
      };
    });
  }
}
