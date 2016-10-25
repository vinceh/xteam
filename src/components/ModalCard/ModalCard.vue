<template>
  <div class="overworld">
    <div class="modal"
         :class="issue.issue_type">
      <div class="close">
        <i class="mdi mdi-dots-horizontal"></i>
      </div>
      <div class="details">
        <div class="summary">
          <div class="text">
            <span class="short">{{ issue.issue_key }}</span>
            {{ issue.summary }}
          </div>
        </div>
        <div class="detail-section checklist">
          <div class="heading">
            Checklist
          </div>
          <div class="items">
            <div class="item"
                 v-for="task in issue.subtasks"
                 :class="{checked: task.completed}">
              <div class="checkbox-input">
                <i class="mdi mdi-check"></i>
              </div>
              {{ task.description }}
            </div>
            <div class="item add-item">
              <div class="checkbox-input">
                <i class="mdi mdi-plus"></i>
              </div>
              add item...
            </div>
          </div>
        </div>
        <div class="description detail-section">
          <div class="heading">
            Description
            <i class="mdi mdi-pencil"
               @click="openDescriptionEditor"></i>
          </div>
          <div class="deets markdown"
               v-html="renderMarkdown(issue.description)"
               v-if="!descriptionEditorOpen">
          </div>
          <description-editor v-if="descriptionEditorOpen"
                              :body="issue.description"
                              @update="updateDescription"
                              @cancel="closeEditor"></description-editor>
        </div>
      </div>
      <div class="comments">
        <h3>Comments</h3>
        <div class="comment"
             v-for="comment in issue.comments">
          <div class="time">
            {{ commentCreated(comment) }}
          </div>
          <div class="person">
            <img :src="comment.user.avatar_url">
            {{ fullName(comment.user) }}
          </div>
          <div class="comment-content markdown"
               v-html="renderMarkdown(comment.body)">
          </div>
        </div>
        <input class="new-comment" placeholder="Start typing a new comment..." type="text">
      </div>
      <div class="sidebar">
        <div class="section hero">
          <h3>{{ heroTitle }}</h3>
          <div class="person"
               v-for="person in issue.assignees">
            <img :src="person.avatar_url">
            {{ fullName(person) }}
          </div>
        </div>
        <div class="section hero">
          <h3>Reporter</h3>
          <div class="person">
            <img :src="issue.reporter.avatar_url">
            {{ fullName(issue.reporter) }}
          </div>
        </div>
        <div class="section status">
          <h3>Current Status</h3>
          <div class="status-text">
            {{ issue.state }}
          </div>
        </div>
        <div class="section status type">
          <h3>Issue Type</h3>
          <i class="mdi"
             :class="cardIconClass(issue.issue_type)"></i>
          {{ issue.issue_type }}
        </div>
        <div class="section status">
          <h3>Points</h3>
          <div class="status-text">
            {{ issue.points }}
          </div>
        </div>
        <div class="section epic">
          <h3>Epic</h3>
          <div class="epic-label">
            {{ issue.epic }}
          </div>
        </div>
        <div class="section labels">
          <h3>Labels</h3>
          <div class="label"
                v-for="label in issue.labels">{{ label.label }}</div>
        </div>
        <div class="section status date">
          <h3>Created at</h3>
          <div class="status-text">
            {{ reportedOnDate }}
          </div>
          <div class="status-text">
            {{ reportedOnFromNow }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import DescriptionEditor from './DescriptionEditor'

export default {
  props: ['issue'],
  components: {DescriptionEditor},
  data () {
    return {
      descriptionEditorOpen: false
    }
  },
  methods: {
    fullName (person) {
      return person.first_name + ' ' + person.last_name
    },
    commentCreated (comment) {
      return moment(comment.created_at).fromNow()
    },
    checkClose (e) {
      if (e.keyCode === 27) {
        console.log('closing this modal!')
        this.$emit('close')
      }
    },
    updateDescription (newBody) {
      var data = {
        description: newBody
      }
      this.$http.post('http://localhost:3001/issues/' + this.issue.id + '/update_description', data).then((res) => {
        this.issue = res.data
        this.closeEditor()
      })
    },
    closeEditor () {
      this.descriptionEditorOpen = false
    },
    openDescriptionEditor () {
      this.descriptionEditorOpen = true
    }
  },
  computed: {
    heroTitle () {
      if (this.issue.assignees.length > 1) {
        return 'Heroes'
      }
      return 'Hero'
    },
    reportedOnDate () {
      return moment(this.issue.created_at).format('MMM Do, h:mma')
    },
    reportedOnFromNow () {
      return moment(this.issue.created_at).fromNow()
    }
  },
  created () {
    window.addEventListener('keyup', this.checkClose)
  },
  beforeDestroy () {
    window.removeEventListener('keyup', this.checkClose)
  }
}
</script>
