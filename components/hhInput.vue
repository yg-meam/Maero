<template>
  <v-text-field
    solo
    flat
    hide-details
    :class="cls"
    :placeholder="placeholder"
    v-model="tmpValue"
    :type="type"
    :suffix="suffix"
    @keyup="changeValue"
    :readonly="readonly"
    :dense="dense"
  ></v-text-field>
</template>

<script>
export default {
  props: ["cls", "value", "type", "placeholder", "suffix", "readonly", "dense"],
  data() {
    return {
      tmpValue: null,
    };
  },
  watch: {
    value(val) {
      this.change(val);
    },
  },
  mounted() {
    this.tmpValue = this.value;
    this.$emit("input", this.tmpValue);
  },
  methods: {
    changeValue() {
      this.$emit("input", this.tmpValue);
      this.$emit("keyup", this.tmpValue);
    },
    change(val) {
      this.tmpValue = val;
      // this.$emit("input", this.tmpValue);
    },
  },
};
</script>

<style>
</style>