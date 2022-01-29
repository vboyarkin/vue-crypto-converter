<script>
import { Line } from "vue-chartjs";
import { mapActions, mapGetters } from "vuex";

export default {
  extends: Line,
  data() {
    return {
      data: {
        labels: [],
        datasets: [
          {
            label: "x",
            lineTension: 0.15,
            data: [],
            backgroundColor: ["rgba(255, 99, 132, 0.2)"],
            borderColor: ["rgba(255, 99, 132, 1)"],
            borderWidth: 1,
            pointRadius: 0,
          },
        ],
      },
      options: {
        type: "line",
        scales: {
          xAxes: [
            {
              type: "time",
              time: {
                unit: "day",
              },
              gridLines: {
                zeroLineColor: "rgba(0,0,0,0.1)",
              },
            },
          ],
          yAxes: [
            {
              ticks: {
                callback: (value) => value + " " + this.currencyPair[1][0],
              },
            },
          ],
        },
        tooltips: {
          mode: "x-axis",
        },
        maintainAspectRatio: false,
        legend: {
          display: false,
        },
      },
    };
  },
  computed: {
    ...mapGetters(["chartData", "currencyPair"]),
  },
  methods: {
    ...mapActions(["fetchChart"]),
  },
  async mounted() {
    await this.fetchChart();

    let { X, Y } = this.chartData;

    this.data.labels = X;
    this.data.datasets[0].data = Y;

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

    this.renderChart(this.data, this.options);
  },
};
</script>

<style></style>
