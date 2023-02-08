<template>
  <v-menu
    v-model="menu"
    :close-on-content-click="false"
    :nudge-right="40"
    transition="scale-transition"
    offset-y
    min-width="290px"
  >
    <template v-slot:activator="{ on }">
      <v-text-field
        solo
        flat
        hide-details
        :style="{ width: width || '189px' }"
        v-model="tmpData"
        :label="label"
        :placeholder="placeholder"
        @click:clear="clear"
        @click:append="menu = true"
        append-icon="mdi-calendar"
        readonly
        :dense="dense"
        @click="menu = true"
        :class="{ changed: changed }"
      ></v-text-field>
    </template>

    <v-date-picker
      v-model="calendarDate"
      :multiple="multiple"
      @input="changeDate"
      :day-format="dateFormat"
      locale="ko"
    ></v-date-picker>
  </v-menu>
</template>
<script>
import moment from "moment";
export default {
  props: [
    "value",
    "label",
    "placeholder",
    "changed",
    "width",
    "dense",
    "noclearable",
    "multiple",
  ],
  data() {
    return {
      menu: false,
      tmpData: null,
      calendarDate: null,
    };
  },
  watch: {
    value() {
      if (this.value) {
        var tmp = moment(this.value).format("YYYY-MM-DD");

        if (tmp != "Invalid date") {
          this.tmpData = tmp;
        } else {
          this.tmpData = "";
          this.$emit("input", null);
        }

        this.calendarDate = this.tmpData;
      }
    },
  },
  mounted() {
    if (this.value) {
      this.tmpData = this.value;
      this.calendarDate = this.tmpData;
    } else {
      this.tmpData = this.value;
      this.calendarDate = this.tmpData;
    }
  },
  methods: {
    dateFormat(date) {
      return moment(date).get("date");
    },
    changeDate() {
      this.tmpData = this.calendarDate;
      console.log(this.tmpData);
      this.$emit("input", this.tmpData);
      this.$emit("change", this.tmpData);
      if (!this.multiple) {
        this.menu = false;
      }
    },
    clear() {
      this.$emit("input", null);
    },
    // cahngeInput(e) {
    //   if (e.key != "Backspace") {
    //     if (this.tmpData.length == 4) {
    //       this.tmpData += "-";
    //     }
    //     if (this.tmpData.length == 7) {
    //       this.tmpData += "-";
    //     }
    //     if (this.tmpData.length == 10) {
    //       this.$emit("input", this.tmpData);
    //       this.$emit("change", this.tmpData);
    //     }
    //   }
    // },
  },
};
</script>
<style scoped lang="less">
.input {
  padding-left: 10px;
}
</style>
