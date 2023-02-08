
<template>
  <div>
    <v-btn color="#FCD532" @click="select" depressed>{{ label }}</v-btn>
    <input
      ref="inputFile"
      :multiple="multiple"
      @change="selectFile"
      type="file"
      :accept="accept"
    />
  </div>
</template>

<script>
import asyncForEach from "async-await-foreach";
export default {
  props: ["label", "accept", "multiple"],
  methods: {
    select() {
      this.$refs.inputFile.click();
    },

    async selectFile(e) {
      var files = e.target.files || e.dataTransfer.files;
      if (this.multiple) {
        await asyncForEach(files, async (file) => {
          await new Promise((resolve) => {
            var reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (e) => {
              file.image = e.target.result;
              resolve();

              // this.$refs.fileInput.value = null;
            };
          });
        });
        this.$emit("change", files);
      } else {
        var file = files[0];
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (e) => {
          file.image = e.target.result;
          this.$emit("change", file);

          // this.$refs.fileInput.value = null;
        };
        // this.$emit("change", files[0]);
      }
      this.$refs.inputFile.value = null;
    },
  },
};
</script>
<style scoped lang="less">
[type="file"] {
  position: fixed;
  top: -999px;
}
</style>