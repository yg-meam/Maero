<template>
  <highcharts class="chart" :options="chartOptions"></highcharts>
</template>
<script>
import moment from "moment";
import _ from "underscore";
import Highcharts from "highcharts";
export default {
  props: ["data", "colors"],
  data() {
    return {
      // colors: [],
      results: [],

      chartOptions: {
        chart: {
          plotBackgroundColor: null,
          plotBorderWidth: null,
          plotShadow: false,
          type: "pie",
          height: 250,
          // width: "100%",
        },
        title: {
          text: "",
        },
        tooltip: {
          pointFormat: "{series.name}: <b>{point.percentage:.1f}%</b>",
        },
        accessibility: {
          point: {
            valueSuffix: "%",
          },
        },

        plotOptions: {
          pie: {
            startAngle: 0,
            allowPointSelect: false,
            cursor: "pointer",
            dataLabels: {
              enabled: false,
            },
            showInLegend: true,
          },
        },
        colors: [],

        // colors: [
        //   Highcharts.color("#009A93").setOpacity(1).get("rgba"),
        //   Highcharts.color("#009A93").setOpacity(0.8).get("rgba"),
        //   Highcharts.color("#009A93").setOpacity(0.5).get("rgba"),
        //   Highcharts.color("#009A93").setOpacity(0.2).get("rgba"),
        // ],

        legend: {
          enabled: false,
        },
        credits: {
          enabled: false,
        },
        title: {
          text: "",
        },
        series: [
          {
            name: "투자비중",
            colorByPoint: true,
            data: [],
          },
        ],
      },
    };
  },
  watch: {
    data() {
      this.initChart();
    },
  },
  mounted() {
    this.colors = this.colors || ["#ffa600", "#ffd077", "#ffdc9a", "#fde2b0"];
    if (this.colors) {
      this.chartOptions.colors = this.colors;
    }
    // var series = []
    // var categories = []
    // this.chartOptions.xAxis.categories = ["불면증", "가려움"]
    this.initChart();
  },
  methods: {
    initChart() {
      this.chartOptions.series[0].data = this.data;
      //   this.chartOptions.series[0].data = [];
      //   // this.chartOptions.xAxis.categories = [];
      //   var tmpData = _.clone(this.data);
      //   // tmpData.reverse();
      //   _.each(tmpData, (item) => {
      //     this.chartOptions.series[0].data.push(item.value);
      //     this.chartOptions.xAxis.categories.push(item.date);
      //   });
    },
  },
};
</script>
<style scoped lang="less">
.container {
  width: 100%;
  max-width: 100%;
}
.chart {
  width: 100%;
}
.empty-top {
  height: 15px;
}
.empty-bottom {
  height: 90px;
}
</style>
