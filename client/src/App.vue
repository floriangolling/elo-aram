<template>
  <div id="app">
    <router-view />
  </div>
</template>

<style lang="scss">
@font-face {
  font-family: "Friz Quadrata";
  src: url("./assets/Friz Quadrata Std Medium.otf");
}

html {
  scroll-behavior: smooth;
}

#app {
  font-family: "Friz Quadrata";
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #bababa;
}
</style>
