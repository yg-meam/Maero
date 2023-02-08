<template>
  <div class="image-box" @click="selectImage" :class="{ border: image }">
    <v-icon class="close-btn" v-if="image" @click.stop="deleteImage"
      >mdi-close</v-icon
    >

    <div class="inner-icon-container">
      <v-layout fill-height justify-center align-center>
        <slot></slot>
      </v-layout>
    </div>

    <div v-if="!image && label" class="label">{{ label }}</div>
    <div v-if="!image" class="icon"></div>
    <div v-if="!image && description" class="description">
      {{ description }}
    </div>
    <img
      :class="{ grayscale: grayscale }"
      :src="image"
      class="image"
      v-if="image && isPreviewEnable"
    />
    <img
      :class="{ grayscale: grayscale }"
      src="/img/ic_file.png"
      style="padding: 40px"
      class="image"
      v-if="image && !isPreviewEnable"
    />
    <img :src="sample" class="image" v-if="!image && sample" />
    <input
      type="file"
      ref="fileInput"
      @change="onFileChange"
      :accept="accept"
      :multiple="multiple"
    />
  </div>
</template>
<script>
import Vue from "vue";
import _ from "underscore";
export default {
  data() {
    return {
      image: "",
      isPreviewEnable: true,
      hover: false,
    };
  },
  props: [
    "id",
    "prefill",
    "label",
    "sample",
    "description",
    "grayscale",
    "accept",
    "multiple",
  ],

  mounted() {
    this.image = this.prefill;
  },
  watch: {
    prefill() {
      this.image = this.prefill;
    },
    id() {
      this.removeImage();
    },
  },
  methods: {
    deleteImage() {
      this.image = "";
      this.isPreviewEnable = true;
      this.$emit("change", null);
    },
    mousein() {
      this.hover = true;
    },
    mouseout() {
      this.hover = false;
    },
    selectImage() {
      this.$refs.fileInput.click();
    },
    onFileChange(e) {
      var files = e.target.files || e.dataTransfer.files;
      if (!files.length) return;
      if (this.multiple) {
        _.each(files, (file) => {
          this.createImage(file);
        });
      } else {
        this.createImage(files[0]);
      }
    },
    createImage(file) {
      var reader = new FileReader();
      var vm = this;

      if (
        ["image/jpeg", "image/jpg", "image/gif", "image/png"].indexOf(
          file.type
        ) > -1
      ) {
        Vue.nextTick(function () {
          vm.isPreviewEnable = true;
        });
      } else {
        Vue.nextTick(function () {
          vm.isPreviewEnable = false;
        });
      }
      reader.onload = (e) => {
        file.image = e.target.result;
        file.deleted = false;
        this.$emit("change", file);
        console.log(this.multiple);
        if (!this.multiple) {
          vm.image = e.target.result;
        }

        this.$refs.fileInput.value = null;
      };
      reader.readAsDataURL(file);
    },
    removeImage: function (e) {
      this.image = "";
      this.$emit("change", null);
    },
  },
};
</script>

<style scoped lang="less">
.image-box {
  width: 100%;
  height: 100%;
  padding: 5px;
  position: relative;
  cursor: pointer;
  text-align: center;
  background: #f2f3f4;
  border-radius: 4px;
  border: 1px solid #e9eaeb;
  &:hover {
    background: #ddd;
  }
  &.border {
    border: 2px solid #bcbcbc;
    border-radius: 10px;
  }
  .icon {
    padding-top: 30px;
    text-align: center;
  }
  .label {
    text-align: center;
    font-size: 14px;
    font-weight: bold;
    color: #5a5a5a;
  }
  .description {
    position: absolute;
    bottom: 6px;
    left: 3px;
    right: 3px;
    z-index: 4;
    text-align: center;
    font-size: 12px;
    font-weight: weight;
  }
  .submit-btn {
    text-align: center;
    display: inline-block;
    padding: 9px 30px;
    margin-top: 13px;
    border-radius: 4px;
  }
  .add-box {
    cursor: pointer;
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 3;
    .add-icon {
      color: white;
      position: relative;
      z-index: 4;
      width: 100%;
      height: 100%;
      font-size: 60px;
    }
  }
  .close-btn {
    cursor: pointer;
    z-index: 5;
    position: absolute;
    right: 5px;
    top: 5px;
    font-size: 30px;
  }
  .bg {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 1;
    border-radius: 6px;
    border: 1px solid #bcbcbc;
    background: #f2f3f4;
  }
  img.image {
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    object-fit: contain;
    border-radius: 6px;
    padding: 5px;

    &.grayscale {
      -webkit-filter: grayscale(100%);
      -webkit-filter: grayscale(1);
      filter: grayscale(100%);
      filter: gray;
      //-webkit-filter: grayscale(100%);

      //filter: gray;
    }
  }
}
.inner-icon-container {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
}
input[type="file"] {
  visibility: hidden;
}
</style>
