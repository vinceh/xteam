<template>
  <div>
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
import _ from 'lodash'
import { mapState } from 'vuex'
import dragula from 'dragula'

export default {
  components: {
    Card
  },
  data () {
    return {
      initialLoading: true
    }
  },
  computed: mapState({
    projectAssets: state => state.projectAssets,
    stages: state => state.kanban.stages
  }),
  methods: {
    openCard (id) {
      this.$emit('openCard', id)
    },
    updateInlineIssue (newIssue) {
      _.forIn(this.stages, (stage, key) => {
        if (stage.state.label === newIssue.state) {
          this.stages[key].issues.splice(
            _.findIndex(stage.issues, (o) => { return o.id === newIssue.id }),
            1,
            newIssue
          )
        }
      })
    },
    updateIssueState (newIssue) {
      _.forIn(this.stages, (stage, stageKey) => {
        _.forIn(stage.issues, (issue, issueKey) => {
          if (issue.id === newIssue.id) {
            this.stages[stageKey].issues.splice(
              issueKey,
              1
            )
          }
        })
      })

      _.forIn(this.stages, (stage, key) => {
        if (stage.state.label === newIssue.state) {
          this.stages[key].issues.push(newIssue)
        }
      })
    },
    initializeDragula () {
      var drake = dragula({
        isContainer: (el) => {
          return el.classList.contains('cards-wrap')
        },
        mirrorContainer: this.$el.querySelector('.cards-wrap')
      })
      drake.on('over', (el, container, source) => {
        if (container !== source) {
          container.classList.add('drag-active')
        }
      })
      drake.on('out', (el, container, source) => {
        container.classList.remove('drag-active')
      })
      console.log(drake)
    }
  },
  created () {
    this.$store.dispatch('getKanbanDetails', {project_id: 1}).then((res) => {
      this.initialLoading = false
    })
  },
  watch: {
    initialLoading (newVal) {
      if (!newVal) {
        this.$el.querySelectorAll('.cards-wrap').forEach((el) => {
          el.style.minHeight = `${window.innerHeight - 200}px`
        })
        this.initializeDragula()
      }
    }
  },
  mounted () {
  },
  beforeUpdate () {
  }
}
</script>

<style lang="scss">
  .gu-transit {
    opacity: 0;
  }
</style>
