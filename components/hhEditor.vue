<template>
  <div class="edit-container">
    <client-only>
      <quill-editor
        style="height: 100%"
        ref="description"
        placeholder="test"
        v-model="tmpValue"
        :options="editorOption"
        @change="onEditorChange($event)"
      />
      <input
        type="file"
        ref="file"
        @change="imageChange"
        id="file"
        multiple
        accept="image/*"
        hidden
      />
    </client-only>
  </div>
</template>

<script>
export default {
  props: ["value", "placeholder"],
  watch: {
    value(value) {
      this.setValue(value);
    },
  },
  data() {
    return {
      tmpValue: null,
      editorOption: {
        theme: "snow",
        placeholder: "",
        modules: {
          toolbar: {
            container: [
              [{ header: [1, 2, 3, 4, 5, 6, false] }],
              ["bold", "italic", "underline", "strike"],
              ["link", "image"],
            ],
            handlers: {
              image: function () {
                document.getElementById("file").click();
              },
            },
          },
        },
      },
    };
  },
  mounted() {
    if (this.placeholder) {
      this.editorOption.placeholder = this.placeholder;
    }
    this.tmpValue = this.value;
  },
  methods: {
    setValue(value) {
      this.tmpValue = value;
    },
    onEditorChange({ quill, html, text }) {
      this.$emit("input", html);
    },
    imageChange(e) {
      var files = e.target.files;

      var formData = new FormData();
      _.each(files, (file) => {
        formData.append("file", file);
      });

      this.$axios.post("/file/upload/multiple", formData).then((result) => {
        if (result.data.res) {
          var range = this.$refs.description.quill.selection;
          _.each(result.data.images, (image) => {
            this.$refs.description.quill.insertEmbed(
              range.index,
              "image",
              image.imageUrl
            );
          });
          this.$refs.file.value = null;
        }
      });
    },
  },
};
</script>
<style scoped lang="less">
.edit-container {
  height: 400px;
  padding-bottom: 60px;
}
</style>