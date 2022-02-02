<script>
import { Doughnut, mixins } from "vue-chartjs";
import { round } from "@/assets/utils.js";

export default {
  extends: Doughnut,
  mixins: [mixins.reactiveData],
  props: {
    chartDataProp: null,
    borderColor: {
      default: "white",
    },
    borderWidth: {
      default: 2,
    },
  },
  data() {
    return {
      options: {
        type: "doughnut",
        responsive: true,
        plugins: {
          legend: {
            position: "top",
          },
          title: {
            display: false,
            text: "",
          },
        },
        tooltips: {
          callbacks: {
            label: (tooltipItem, data) => {
              let label = data.labels[tooltipItem.index] || "";
              let val = data.datasets[0].data[tooltipItem.index];

              if (label) label += ": ";

              label += round(val).toLocaleString("ru-RU", {
                maximumFractionDigits: 6,
              });

              return label + " $";
            },
          },
        },
      },
    };
  },
  watch: {
    chartDataProp: {
      immediate: true,
      handler(data) {
        if (data === null) return null;

        const { X, Y, colors } = data;

        this.chartData = {
          labels: X,
          datasets: [
            {
              label: "Цена",
              data: Y,
              backgroundColor: colors,
              borderColor: this.borderColor,
              borderWidth: this.borderWidth,
            },
          ],
        };
      },
    },
  },
};
</script>

<style lang="sass" scoped></style>
