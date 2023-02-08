<template>
  <div>
    <v-layout align-center class="month-selecter">
      <v-btn icon @click="prevMonth">
        <v-icon>mdi-chevron-left</v-icon>
      </v-btn>
      <div class="month">{{ currentMonth }}</div>
      <v-btn icon @click="nextMonth">
        <v-icon>mdi-chevron-right</v-icon>
      </v-btn>
    </v-layout>
  </div>
</template>

<script>
import moment from "moment";
export default {
  props: ["value"],
  data() {
    return {
      currentMonth: null,
    };
  },

  mounted() {
    this.currentMonth = this.value;
  },
  methods: {
    prevMonth() {
      this.currentMonth = moment(this.currentMonth, "YYYY-MM")
        .add(-1, "month")
        .format("YYYY-MM");
      this.$emit("input", this.currentMonth);
      this.$emit("change", this.currentMonth);
    },
    nextMonth() {
      this.currentMonth = moment(this.currentMonth, "YYYY-MM")
        .add(1, "month")
        .format("YYYY-MM");
      this.$emit("input", this.currentMonth);
      this.$emit("change", this.currentMonth);
    },
  },
};
</script>
<style scoped lang="less">
.month {
  font-size: 20px;
  font-weight: bold;
  margin-left: 20px;
  margin-right: 20px;
  text-align: center;
}
</style>