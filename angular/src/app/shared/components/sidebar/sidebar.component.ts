import { Component, Input, OnInit, ChangeDetectionStrategy, effect } from "@angular/core";
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexDataLabels,
  ApexXAxis,
  ApexPlotOptions,
  ApexTheme,
} from "ng-apexcharts";
import { DemoDataService } from "../../services/demo-data.service";
import { ThemeService } from "../../services/theme.service";
import { VENUE } from "../../classes/venue";

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  xaxis: ApexXAxis;
  theme: ApexTheme;
};

@Component({
    selector: "app-sidebar",
    template: `<apx-chart [series]="chartOptions.series" [chart]="chartOptions.chart" [dataLabels]="chartOptions.dataLabels" [plotOptions]="chartOptions.plotOptions" [xaxis]="chartOptions.xaxis" [theme]="chartOptions.theme"></apx-chart><br><br><div class="ratio ratio-4x3">
  <div>
  <h4 class="mt-1 mb-1">
  <a
    class="link-primary text-decoration-none"
    ><i class="fa-solid fa-futbol me-2"></i
    >Kje se nahaja? {{ venue.name }}</a
  >
</h4>
  </div>
  <iframe
    title="Zemljevid"
    [src]="mapUrl | allowUrl"
    class="rounded-3"
  ></iframe>
</div>`,
    styles: [],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class SidebarComponent implements OnInit {
  @Input() content: string = "";

  protected readonly venue = VENUE;
  protected readonly mapUrl = `https://maps.google.com/maps?q=${VENUE.latitude},${VENUE.longitude}&z=15&output=embed`;

  chartOptions: ChartOptions = {
    series: [{
      name: "Odigranih tekem",
      data: [],
    }],
    chart: {
      type: "bar",
      height: 260,
      width: 300,
      // Transparent, so the card colour shows through in dark mode
      background: "transparent",
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
    theme: { mode: "light" },
  };

  constructor(private demoDataService: DemoDataService, themeService: ThemeService) {
    // Chart text and grid colours follow the device's light/dark setting
    effect(() => {
      this.chartOptions = {
        ...this.chartOptions,
        theme: { mode: themeService.isDark() ? "dark" : "light" },
      };
    });
  }

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
