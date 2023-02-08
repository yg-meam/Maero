<template>
  <v-layout align-top>
    <div @click="selectFile">
      <slot></slot>
    </div>

    <!-- <v-btn depressed @click="selectFile" color="primary">{{
      label || "파일"
    }}</v-btn> -->
    <!-- <div class="file-name" v-if="value">{{value.name}}</div> -->

    <input
      type="file"
      :accept="accept"
      @change="changeFile"
      ref="input"
      :multiple="multiple"
      class="input-file"
    />

    <!-- <v-btn icon @click="removeFile" v-if="value">
    <v-icon small>close</v-icon>
    </v-btn>-->
  </v-layout>
</template>
<script>
import _ from "underscore";
export default {
  props: ["value", "multiple", "accept", "label"],
  data() {
    return {};
  },
  methods: {
    files() {
      if (this.multiple) {
        return this.value;
      } else {
        if (this.value) {
          return [this.value];
        } else {
          return [];
        }
      }
    },
    selectFile() {
      this.$refs.input.click();
    },

    remove(list, item) {
      if (this.multiple) {
        let index = _.indexOf(list, item);
        if (index >= 0) {
          list.splice(index, 1);
        }
      } else {
        this.removeFile();
      }
    },
    removeFile() {
      this.$emit("input", null);
    },
    changeFile(e) {
      if (this.multiple) {
        var tmpList = _.clone(this.value);
        _.each(e.target.files, (file) => {
          tmpList.push(file);
        });
        // tmpList = _.union(tmpList, e.target.files)

        this.$emit("input", tmpList);
        this.$emit("change", tmpList);
      } else {
        this.$emit("input", e.target.files[0]);
        this.$emit("change", e.target.files[0]);
      }

      this.$refs.input.value = null;
    },
  },
};
</script>
<style scoped lang="less">
.input-file {
  position: absolute !important;
  top: -9999px;
}
.file-list {
  margin-left: 10px;
  margin-top: 10px;
  .file-name {
    margin-top: 5px;
    line-height: 48px;
    margin-left: 10px;
  }
}
</style>
