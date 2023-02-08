<template>
  <div id="barcodeContainer" class="glowing-animation">
    <h1 id="barcode" ref="barcode">
      <span class="animatedSpan">M</span>

      <span class="animatedSpan">A</span>

      <span class="animatedSpan">E</span>

      <span class="animatedSpan">R</span>

      <span class="animatedSpan">O</span>

      <span class="animatedSpan">C</span>

      <span class="animatedSpan">O</span>

      <span class="animatedSpan">R</span>

      <span class="animatedSpan">P</span>

      <!-- PLANNED OBSOLESCENCE -->
      <!--   <span class='animatedSpan'>P</span><span class='animatedSpan'>l</span><span class='animatedSpan'>a</span><span class='animatedSpan'>n</span><span class='animatedSpan'>n</span><span class='animatedSpan'>e</span><span class='animatedSpan'>d</span><span class='animatedSpan'> </span><span class='animatedSpan'>O</span><span class="animatedSpan">b</span><span class="animatedSpan">s</span><span class="animatedSpan">o</span><span class="animatedSpan">l</span><span class="animatedSpan">e</span><span class="animatedSpan">s</span><span class="animatedSpan">c</span><span class="animatedSpan">e</span><span class="animatedSpan">n</span><span class="animatedSpan">c</span><span class="animatedSpan">e</span> -->
    </h1>
  </div>
</template>

<script>
import $ from "jquery";
export default {
  data() {
    return {
      barcodeSpans: null,
    };
  },
  mounted() {
    console.log(this.$refs.barcode);
    this.barcodeSpans = $(this.$refs.barcode).children();
    setInterval(this.barcodeAnimation, 2000);
  },
  methods: {
    barcodeAnimation() {
      this.barcodeSpans.each(function (i) {
        let span = $(this);
        setTimeout(function () {
          // highlight each individual span with 200ms between each
          span.toggleClass("highlighted");
          // span.fadeToggle("slow");
        }, 300 * i);
      });

      this.barcodeSpans.each(function (i) {
        let span = $(this);
        setTimeout(function () {
          // remove the highlighting from each span with 20ms between each
          span.toggleClass("highlighted");
        }, 20 * i);
      });
    },
  },
};
</script>

<style scoped lang="less">
html,
body {
  box-sizing: border-box;
  height: 100%;
  margin: 0;
  padding: 0;
}
*,
*:before,
*:after {
  box-sizing: inherit;
}

body {
  display: flex;
  justify-content: center;
  align-items: center;
  background: #0b1110;
  background: linear-gradient(45deg, #0b1110, #171717);
  cursor: pointer;
}

.glowing-animation {
  animation: glowing 17000ms infinite;
}

// @keyframes glowing {
//   0% {
//     box-shadow: 0 0 -2px 1 rgba(61, 72, 70, 0.4);
//   }
//   40% {
//     box-shadow: 0 0 20px 3px rgba(61, 72, 70, 0.5);
//   }
//   60% {
//     box-shadow: 0 0 30px 3px rgba(61, 72, 70, 0.3);
//   }
//   100% {
//     box-shadow: 0 0 -10px 0 rgba(61, 72, 70, 0.2);
//   }
// }

#barcodeContainer {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0px 20px;
  border-radius: 15px;
  cursor: crosshair;
}

#barcode * {
  position: relative;
  color: orange;
  font-family: "Libre Barcode 128 Text", cursive !important;
  font-size: 5rem;
  font-weight: 100;
  white-space: no-wrap;
}

.animatedSpan {
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  -o-user-select: none;
  user-select: none;
  &:hover {
    color: red;
  }
}

.barcodeSelected {
  color: red;
}

.highlighted {
  color: aliceblue;
  padding-bottom: 10px;

  text-shadow: 1px 1px 35px rgb(255, 0, 0);
}
</style>