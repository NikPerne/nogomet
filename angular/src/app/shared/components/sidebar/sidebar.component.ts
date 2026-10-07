import { Component, Input, OnInit } from "@angular/core";
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexDataLabels,
  ApexXAxis,
  ApexPlotOptions
} from "ng-apexcharts";
import { DemoDataService } from "../../services/demo-data.service";

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

  chartOptions: ChartOptions = {
    series: [{
      name: "Odigranih tekem",
      data: [],
    }],
    chart: {
      type: "bar",
      height: 260,
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
      decimalsInFloat: 0,
    },
  };

  constructor(private demoDataService: DemoDataService) {}

  ngOnInit() {
    this.loadStats();
  }

  /**
   * Games played = past events where the player was confirmed (not waitlisted)
   */
  private loadStats() {
    this.demoDataService.getPlayerStats(10).subscribe({
      next: (players) => {
        const data = players.map((player) => ({
          x: player.name,
          y: player.gamesPlayed,
        }));
        this.chartOptions = {
          ...this.chartOptions,
          series: [{ name: "Odigranih tekem", data }],
        };
      },
      error: (err) => console.error("Error loading player stats:", err),
    });
  }
}
