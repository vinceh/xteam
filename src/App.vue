<template>
  <kanban :project-assets="assets"></kanban>
</template>

<script>
import Kanban from './components/Kanban'

export default {
  data () {
    return {
      assets: null
    }
  },
  components: {
    Kanban
  },
  created () {
    this.$http.get('http://localhost:3001/projects/1/assets').then((res) => {
      this.assets = res.data
    })
  }
}
</script>

<style src="./assets/css/main.scss" lang="scss"></style>
