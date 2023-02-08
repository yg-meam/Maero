<template>
  <highcharts :options="chartOptions"></highcharts>
</template>
<script>
import moment from "moment";
import numeral from "numeral";
import _ from "underscore";
import Highcharts from "highcharts";
export default {
  props: ["data"],
  data() {
    return {
      results: [],

      chartOptions: {
        chart: {
          type: "areaspline",

          height: 300,
        },

        credits: {
          enabled: false,
        },
        title: {
          text: "",
        },

        series: [
          // {
          //   lineWidth: 4,
          //   padding: 0,
          //   name: "값",
          //   data: [],
          // },
        ],
        tooltip: {
          formatter: function () {
            var unit = "원";
            var format = "0,000";
            if (this.series.name.indexOf("률") > -1) {
              unit = "%";
              format = "0.00";
            }
            return `${this.x} ${this.series.name} : <b>${numeral(this.y).format(
              format
            )}${unit}</b>`;
            // return (
            //   "The value for <b>" +
            //   this.x +
            //   "</b> is <b>" +
            //   this.y +
            //   "</b>, in series " +
            //   this.series.name
            // );
          },
        },
        plotOptions: {
          line: {
            color: "#000000",
          },
          areaspline: {
            fillColor: {
              linearGradient: {
                x1: 0,
                y1: 0,
                x2: 0,
                y2: 1,
              },
              stops: [
                [0, "#ffa600"],
                [1, "#ffa60000"],
              ],
            },
            marker: {
              radius: 2,
            },
            lineWidth: 1,
            states: {
              hover: {
                lineWidth: 1,
              },
            },
            threshold: null,
          },
        },
        legend: {
          enabled: false,
        },
        colors: ["#ffa600"],
        xAxis: {
          visible: true,
          categories: [],
        },
        yAxis: [
          {
            visible: false,
            title: {
              text: "",
            },
          },
          {
            visible: false,
            title: {
              text: "",
            },
            align: "right",
            opposite: true,
            max: 0,
            min: 0,
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
    this.initChart();
  },
  methods: {
    initChart() {
      // this.chartOptions.series[0].data = [];
      this.chartOptions.xAxis.categories = [];
      var tmpData = _.clone(this.data);
      this.chartOptions.series = tmpData.datas;
      this.chartOptions.xAxis.categories = tmpData.labels;
      if (this.chartOptions.series.length >= 1) {
        this.chartOptions.series[0].type = "areaspline";
        this.chartOptions.yAxis[0].title.text = tmpData.datas[0].name;
      }
      if (this.chartOptions.series.length >= 2) {
        this.chartOptions.series[1].type = "line";
        this.chartOptions.yAxis[1].title.text = tmpData.datas[1].name;
        this.chartOptions.series[1].yAxis = 1;
        console.log(
          _.min(this.chartOptions.series[1].data),
          _.max(this.chartOptions.series[1].data)
        );
        this.chartOptions.yAxis[1].min = _.min(
          this.chartOptions.series[1].data
        );
        this.chartOptions.yAxis[1].max = _.max(
          this.chartOptions.series[1].data
        );
      }
      // _.each(tmpData, (item) => {
      //   this.chartOptions.series[0].data.push(item.value);
      //   this.chartOptions.xAxis.categories.push(item.date);
      // });
    },
  },
};
</script>
<style scoped lang="less">
.container {
  width: 100%;
  max-width: 100%;
}
.empty-top {
  height: 15px;
}
.empty-bottom {
  height: 90px;
}
</style>
