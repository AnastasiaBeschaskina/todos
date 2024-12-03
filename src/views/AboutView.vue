<template>
  <div class="about">
    <div class="foldSection_backgroundImage">
      <img 
        alt="Resume Checker Background Fold Image"
        sizes="100vw"
        :src="imageSrc"
        :srcset="imageSrcSet"
        decoding="async"
        data-nimg="fill"
        class="animation-breath"
      />
    </div>
    <CheckResume/>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import CheckResume from "@/components/CheckResume.vue";

export default defineComponent({
  name: "AboutView",
  components: {
    CheckResume,
  },
  data() {
    return {
      imageSrc: require('@/assets/images/background.svg'),
      imageSrcSet: `${require('@/assets/images/background.svg')} 430w, 
                    ${require('@/assets/images/background.svg')} 640w, 
                    ${require('@/assets/images/background.svg')} 750w, 
                    ${require('@/assets/images/background.svg')} 828w, 
                    ${require('@/assets/images/background.svg')} 1080w, 
                    ${require('@/assets/images/background.svg')} 1200w, 
                    ${require('@/assets/images/background.svg')} 1920w`
    };
  }
});
</script>

<style scoped>
.about {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

.foldSection_backgroundImage {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 1400px;
  z-index: -1;
  pointer-events: none;
}
img{
  position: absolute;
    height: 100%;
    width: 100%;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    object-fit: fill;
    object-position: center;
    color: transparent;
}

img.animation-breath {
  position: absolute;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  color: transparent;
  --scaleStart: 1;
  --scaleEnd: 1.2;
  animation: animation-breath 6s 0.4s infinite alternate;
}

/* Breathing animation */
@keyframes animation-breath {
  0% {
    transform: scale(var(--scaleStart));
  }
  100% {
    transform: scale(var(--scaleEnd));
  }
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
</style>


