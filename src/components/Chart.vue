<script>
import { Line, mixins } from "vue-chartjs";
import { mapActions, mapGetters } from "vuex";

export default {
  extends: Line,
  mixins: [mixins.reactiveData],
  props: {
    chartDataProp: null,
    gridLineColor: {
      default: "rgba(0,0,0,0.1)",
    },
    displayTooltip: {
      default: true,
    },
    displayAxes: {
      default: true,
    },
    displayGrid: {
      default: true,
    },
    fillSpaceUnderLine: {
      default: true,
    },
  },
  data() {
    return {
      options: {
        type: "line",
        scales: {
          xAxes: [
            {
              display: this.displayAxes,
              type: "time",
              time: {
                unit: "day",
              },
              gridLines: {
                display: this.displayGrid,
                zeroLineColor: this.gridLineColor,
                color: this.gridLineColor,
              },
            },
          ],
          yAxes: [
            {
              display: this.displayAxes,
              ticks: {
                callback: (value) => value + " " + this.counterCurrency.label,
              },
              gridLines: {
                display: this.displayGrid,
                zeroLineColor: this.gridLineColor,
                color: this.gridLineColor,
              },
            },
          ],
        },
        tooltips: {
          enabled: this.displayTooltip,
          mode: "x-axis",
          callbacks: {
            label: (tooltipItem, data) => {
              var label = data.datasets[tooltipItem.datasetIndex].label || "";

              if (label) label += ": ";

              const price = tooltipItem.yLabel;
              if (price > 10) label += Math.round(price * 100) / 100;
              else if (price > 1) label += Math.round(price * 10000) / 10000;
              else label += Math.round(price * 10000000) / 10000000;

              return label + " " + this.counterCurrency.label;
            },
          },
        },
        maintainAspectRatio: false,
        legend: {
          display: false,
        },
      },
    };
  },
  computed: {
    ...mapGetters(["counterCurrency"]),
  },
  methods: {
    ...mapActions(["fetchChart"]),
  },
  watch: {
    chartDataProp: {
      immediate: true,
      handler(data) {
        if (data === null) return null;

        const { X, Y } = data;

        this.chartData = {
          labels: X,
          datasets: [
            {
              label: "Цена",
              fill: this.fillSpaceUnderLine,
              lineTension: 0.15,
              data: Y,
              backgroundColor: ["rgba(255, 99, 132, 0.2)"],
              borderColor: ["rgba(255, 99, 132, 1)"],
              borderWidth: 1,
              pointRadius: 0,
            },
          ],
        };
      },
    },
  },
  async mounted() {
    if (this.displayTooltip)
      this.addPlugin({
        id: "hover-line",
        afterDatasetsDraw: function (chart) {
          let chart_type = chart.config.type;
          if (
            chart.tooltip._active &&
            chart.tooltip._active.length &&
            chart_type === "line"
          ) {
            let activePoint = chart.tooltip._active[0];
            let ctx = chart.chart.ctx;
            let y_axis = chart.scales["y-axis-0"];
            let x = activePoint.tooltipPosition().x;
            let topY = y_axis.top;
            let bottomY = y_axis.bottom;

            ctx.save();
            ctx.beginPath();
            ctx.moveTo(x, topY + 2);
            ctx.lineTo(x, bottomY - 1);
            ctx.setLineDash([2, 3]);
            ctx.lineWidth = 1;
            ctx.strokeStyle = "#ff6384de";
            ctx.stroke();
            ctx.restore();
          }
        },
      });

    this.renderChart(this.chartData, this.options);
  },
};
</script>
