<template>
  <v-select
    solo
    flat
    hide-details
    v-model="tmpValue"
    @change="changeValue"
    :items="items"
    :itemText="itemText"
    :itemValue="itemValue"
    :class="cls"
    :multiple="multiple"
    :placeholder="placeholder"
    :dense="dense"
    :clearable="clearable"
  ></v-select>
</template>

<script>
export default {
  props: [
    "value",
    "items",
    "clearable",
    "itemText",
    "itemValue",
    "cls",
    "multiple",
    "placeholder",
    "dense",
  ],
  data() {
    return {
      tmpValue: null,
    };
  },
  watch: {
    value(val) {
      this.tmpValue = val;
    },
  },
  mounted() {
    this.tmpValue = this.value;
  },
  methods: {
    changeValue() {
      this.$emit("input", this.tmpValue);
      this.$emit("change");
    },
  },
};
</script>
<style scoped lang="less">
</style>