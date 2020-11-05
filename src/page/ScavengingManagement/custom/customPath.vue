<template>
  <div>
    <iframe class="act-form" :src="fullPaths"></iframe>
  </div>
</template>

<script>
export default {
  data() {
    return {
      uniquePath: this.$route.query.path,
      fullPaths: ''
    }
  },
  mounted() {
    let fullPa = this.$route.fullPath
    this.fullPaths = decodeURIComponent(fullPa.substring(17))
    console.log(this.fullPaths)
  },
  updated() {
  }
}
</script>
<style lang="scss" scoped>
.act-form {
  width: 100%;
  min-height: 100vh;
}
</style>

