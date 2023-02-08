<template>
  <v-text-field
    solo
    flat
    hide-details
    background-color="#00000000"
    :dense="dense"
    :readonly="readonly"
    :suffix="suffix"
    class="text-right number"
    v-model="tmpValue"
    @keyup="changeValue"
  ></v-text-field>
</template>

<script>
export default {
  props: ["value", "dense", "readonly", "suffix"],
  data() {
    return {
      tmpValue: null,
    };
  },
  watch: {
    value(newVal) {
      this.tmpValue = this.thousandSeprator(newVal || 0);
    },
  },
  mounted() {
    this.tmpValue = this.thousandSeprator(this.value || 0);
  },
  methods: {
    changeValue() {
      var newValue = Number(this.tmpValue.replace(/,/g, ""));
      this.tmpValue = this.thousandSeprator(newValue);
      this.$emit("input", newValue);
      this.$emit("change", newValue);
    },
    thousandSeprator(amount) {
      if (
        amount !== "" ||
        amount !== undefined ||
        amount !== 0 ||
        amount !== "0" ||
        amount !== null
      ) {
        return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      } else {
        return amount;
      }
    },
  },
};
</script>

<style>
</style>