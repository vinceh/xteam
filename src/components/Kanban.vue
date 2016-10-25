<template>
  <div>
    <div class="overworld"
         v-if="loadingDetail">
      <img src="https://dsgcewkenvygd.cloudfront.net/assets/balls.svg" class="loading-gif"/>
    </div>
    <modal-card v-if="showDetail"
                :issue="modalCard"
                @close="closeCard"></modal-card>
    <div class="header"></div>
    <div class="nav">
      <div class="logo">
        <img src="https://s3.amazonaws.com/vvxteam/assets/logo.png">
      </div>
      <div class="profile">
        <img src="https://media.licdn.com/mpr/mpr/shrink_100_100/p/4/000/185/00f/3048fa9.jpg">
      </div>
      <div class="actions">
        <div class="item active">
          <div class="badge notification">
            <span>1</span>
          </div>
          <i class="mdi mdi-layers"></i>
        </div>
        <div class="item">
          <i class="mdi mdi-sword"></i>
        </div>
        <div class="item">
          <i class="mdi mdi-crown"></i>
        </div>
        <div class="item">
          <i class="mdi mdi-twitch"></i>
        </div>
      </div>
    </div>
    <div class="content kanban">
      <div class="top-heading">
        <div class="search">
          <i class="mdi mdi-magnify"></i>
          <input placeholder="Search for a ticket" type="text">
        </div>
      </div>
      <div class="filters">
        <div class="filters-button">
          Columns
          <i class="mdi mdi-chevron-down"></i>
        </div>
        <div class="filters-button">
          Add Filter
          <i class="mdi mdi-chevron-down"></i>
        </div>
        <div class="vertiline"></div>
        <div class="filter">
          Assigned to me
          <i class="mdi mdi-close"></i>
        </div>
      </div>
      <div class="panes">
        <div class="pane" v-for="stage in stages">
          <div class="title">
            {{stage.state.label}}
          </div>
          <div class="cards-wrap">
            <card v-for="issue in stage.issues"
                  :issue="issue"
                  @open="openCard(issue.id)"></card>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Card from './Card'
import ModalCard from './ModalCard/ModalCard'

export default {
  data () {
    return {
      stages: [],
      loadingDetail: false,
      showDetail: false,
      modalCard: null
    }
  },
  components: {
    Card, ModalCard
  },
  methods: {
    openCard (id) {
      this.loadingDetail = true
      this.$http.get('http://localhost:3001/issues/' + id).then((res) => {
        this.loadingDetail = false
        this.modalCard = res.data
        this.showDetail = true
      })
    },
    closeCard () {
      this.showDetail = false
    }
  },
  created () {
    this.$http.get('http://localhost:3001/projects/1/kanbanDetails').then((res) => {
      this.stages = res.data
    })
  }
}
</script>
