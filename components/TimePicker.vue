<template>
  <v-menu
    ref="menu"
    v-model="menu2"
    :close-on-content-click="false"
    :nudge-right="40"
    :return-value.sync="time"
    transition="scale-transition"
    offset-y
    :readonly="readonly"
    max-width="290px"
    min-width="290px"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-text-field
        v-model="time"
        solo
        flat
        hide-details
        append-icon="mdi-clock-time-four-outline"
        readonly
        v-bind="attrs"
        v-on="on"
      ></v-text-field>
    </template>
    <v-time-picker
      v-if="menu2"
      v-model="time"
      format="24hr"
      :readonly="readonly"
      full-width
      @click:minute="$refs.menu.save(time)"
    ></v-time-picker>
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
    "noclearable",
    "readonly",
  ],
  data() {
    return {
      time: null,
      menu2: false,
      modal2: false,
    };
  },
  watch: {
    time() {
      console.log(this.time);
      this.$emit("input", this.time);
    },
  },
  mounted() {
    this.time = this.value;
    console.log(this.value);
  },
  methods: {},
};
</script>
<style scoped lang="less">
.input {
  padding-left: 10px;
}
</style>
