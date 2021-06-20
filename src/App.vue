<template>
  <Search/>
</template>

<script>

import Search from './components/Search.vue'

export default {
  name: 'App',
  components: {
    Search
  }
}
</script>

<style>
#app {
  font-family: Inter,sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #fff;
  margin-top: 100px;
  background-color: #12141d;
  height: 100%
}
body {
    padding-bottom: 96px;
    background-color: #12141d;
    font-family: Inter,sans-serif;
    color: hsla(0,0%,100%,.5);
    font-size: 16px;
    font-weight: 500;

}

html{
  margin:0;
  height: 100%
}
</style>
