<template>
  <div v-if="projectAssets">
    <modal-card v-if="showDetail"
                :issue-id="modalCardId"
                @close="closeCardAndBack()"></modal-card>
    <router-view @openCard="openCard"></router-view>
  </div>
</template>

<script>
import ModalCard from './components/ModalCard/ModalCard'
import { mapState } from 'vuex'

export default {
  data () {
    return {
      showDetail: false,
      modalCardId: null
    }
  },
  components: {
    ModalCard
  },
  computed: mapState([
    'projectAssets'
  ]),
  methods: {
    openCard (id) {
      this.showDetail = true
      this.modalCardId = id
      this.$router.push({name: 'directStory', params: {id: id}})
    },
    closeCard () {
      this.showDetail = false
      this.modalCardId = null
    },
    closeCardAndBack () {
      this.showDetail = false
      this.modalCardId = null
      this.$router.go(-1)
    }
  },
  watch: {
    '$route' (to, from) {
      if (from.name === 'directStory' && to.name !== 'directStory') {
        this.closeCard()
      } else if (to.name === 'directStory') {
        this.openCard(to.params.id)
      }
    }
  },
  created () {
    // TODO
    this.$store.dispatch('getProjectAssets', {project_id: 1})

    if (this.$route.name === 'directStory') {
      this.openCard(this.$route.params.id)
    }
  },
  beforeRouteEnter: (to, from, next) => {
    // if they're visiting the root domain, redirect to kanban view
    if (!to.name) {
      next('/kanban')
    } else {
      next()
    }
  }
}
</script>

<style src="./assets/css/main.scss" lang="scss"></style>
