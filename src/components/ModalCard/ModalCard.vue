<template>
  <div class="overworld">
    <img src="https://dsgcewkenvygd.cloudfront.net/assets/balls.svg"
         class="initial-loading-gif"
         v-if="initialLoading"/>
    <div class="modal"
         :class="issue.issue_type"
         v-if="!initialLoading">
      <img src="https://dsgcewkenvygd.cloudfront.net/assets/balls.svg"
            class="modal-loading-gif"
            v-if="loading"/>
      <div class="close">
        <i class="mdi mdi-dots-horizontal"></i>
      </div>
      <div class="details">
        <div class="summary">
          <div class="text"
               @click="beginEditingSummary"
               v-if="!editingSummary">
            <span class="short">{{ issue.issue_key }}</span>
            {{ issue.summary }}
          </div>
          <div class="summary-edit-wrap"
               v-if="editingSummary">
            <general-text-editor :text="issue.summary"
                                 :allow-empty="false"
                                 :allow-delete="false"
                                 @submit="editSummary"
                                 @cancel="cancelEditSummary"
                                 submit-label="Update Summary"
                                 placeholder="Type your summary">
            </general-text-editor>
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
                              submit-label="Update Description"
                              :allow-empty="true"
                              @update="updateDescription"
                              @cancel="closeDescriptionEditor"></description-editor>
        </div>
        <div class="detail-section checklist">
          <div class="heading">
            Checklist
          </div>
          <div class="items">
            <div class="item list-item"
                 v-for="task in issue.subtasks"
                 :class="{checked: task.completed, editing: editingSubtask(task)}"
                 @click="beginEditSubtask(task)">
              <div class="checkbox-input"
                   @click.stop.prevent="toggleSubtask(task.id)">
                <i class="mdi mdi-check"></i>
              </div>
              <div class="subtask-desc"
                   v-if="!editingSubtask(task)">
                {{ task.description }}
              </div>
              <div class="input-wrap">
                <subtask-editor :task="task"
                                v-if="editingSubtask(task)"
                                @edit-subtask="editSubtask"
                                @stop-editing="stopEditingSubtask"
                                @delete-subtask="deleteSubtask"></subtask-editor>
              </div>
            </div>
            <div class="item add-item"
                 @click="openAddSubtaskField"
                 :class="{editing: addingNewSubtask}">
              <div class="checkbox-input">
                <i class="mdi mdi-plus"></i>
              </div>
              <div class="input-wrap">
                <span v-show="!addingNewSubtask">
                  add item...
                </span>
                <subtask-editor :task="null"
                                v-if="addingNewSubtask"
                                @add-subtask="addSubtask"
                                @stop-editing="stopCreatingSubtask"></subtask-editor>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="comments">
        <h3>Comments</h3>
        <div class="comment"
             v-for="comment in issue.comments">
          <div class="comment-actions">
            <i class="mdi mdi-pencil"
               @click="openEditingComment(comment)"></i>
            <i class="mdi mdi-close"
               @click="deleteComment(comment)"></i>
          </div>
          <div class="person">
            <img :src="comment.user.avatar_url">
            {{ fullName(comment.user) }}
            <span class="time">
              {{ timeWords(comment.created_at) }} <span v-if="comment.created_at !== comment.updated_at">&middot; edited</span>
            </span>
          </div>
          <div class="comment-content markdown"
               v-html="renderMarkdown(comment.body)"
               v-if="!comment.editing">
          </div>

          <description-editor @update="editComment"
                              v-if="comment.editing"
                              :identifier="comment"
                              :body="comment.body"
                              submit-label="Update Comment"
                              :allow-empty="false"
                              @cancel="closeEditComment(comment)"></description-editor>
        </div>
        <div class="no-comments"
             v-if="issue.comments.length === 0">
          No Comments
        </div>
        <div class="new-comment-wrap"
             :class="{editing: addingComment}">
          <div class="new-comment-placeholder"
               v-if="!addingComment"
               @click="openAddComment">
            Add new comment...
          </div>
          <description-editor v-if="addingComment"
                              @update="addComment"
                              submit-label="Add Comment"
                              :allow-empty="false"
                              @cancel="closeAddComment"></description-editor>
        </div>
      </div>
      <div class="sidebar">
        <div class="section hero">
          <div class="section-item"
               :class="{active: currentPicker === 'hero'}"
               @click="currentPicker = 'hero'">
            <h3>{{ heroTitle }}</h3>
            <div class="person"
                 v-for="person in issue.assignees"
                 v-if="issue.assignees.length > 0">
              <img :src="person.avatar_url">
              {{ fullName(person) }}
            </div>
            <div class="" v-if="issue.assignees.length === 0">
              Nobody
            </div>
          </div>
          <list-picker empty-label="Nobody"
                       :list-items="heroListItems()"
                       title-text="Pick a Hero"
                       list-type="image"
                       @submit="editHero"
                       :has-search-input="true"
                       v-if="currentPicker === 'hero'"
                       @close="closePicker"></list-picker>
        </div>
        <div class="section hero">
          <div class="section-item"
               :class="{active: currentPicker === 'reporter'}"
               @click="currentPicker = 'reporter'">
            <h3>Reporter</h3>
            <div class="person">
              <img :src="issue.reporter.avatar_url">
              {{ fullName(issue.reporter) }}
            </div>
          </div>
          <list-picker :list-items="heroListItems()"
                       title-text="Pick a Reporter"
                       list-type="image"
                       @submit="editReporter"
                       :has-search-input="true"
                       v-if="currentPicker === 'reporter'"
                       @close="closePicker"></list-picker>
        </div>
        <div class="section status">
          <div class="section-item"
               :class="{active: currentPicker === 'state'}"
               @click="currentPicker = 'state'">
            <h3>Current Status</h3>
            <div class="status-text">
              {{ issue.state }}
            </div>
          </div>
          <list-picker :list-items="stateItems()"
                       title-text="Pick a State"
                       list-type="listSelect"
                       @submit="editState"
                       v-if="currentPicker === 'state'"
                       :has-search-input="false"
                       @close="closePicker"></list-picker>
        </div>
        <div class="section status type">
          <div class="section-item"
               :class="{active: currentPicker === 'type'}"
               @click="currentPicker = 'type'">
            <h3>Issue Type</h3>
            <i class="mdi"
               :class="cardIconClass(issue.issue_type)"></i>
            {{ issue.issue_type }}
          </div>
          <list-picker :list-items="issueTypeItems()"
                       title-text="Pick Issue Type"
                       list-type="icon"
                       @submit="editType"
                       v-if="currentPicker === 'type'"
                       :has-search-input="false"
                       @close="closePicker"></list-picker>
        </div>
        <div class="section status">
          <div class="section-item"
               :class="{active: currentPicker === 'points'}"
               @click="currentPicker = 'points'">
            <h3>Points</h3>
            <div class="status-text"
                 v-if="currentPicker !== 'points'">
              <span v-if="issue.points">
                {{ issue.points }}
              </span>
              <span v-if="!issue.points">
                Unestimated
              </span>
            </div>
            <simple-number-box :value="issue.points"
                               v-if="currentPicker === 'points'"
                               @submit="editPoints"
                               @close="closePicker"></simple-number-box>
          </div>
        </div>
        <div class="section epic">
          <div class="section-item"
               :class="{active: currentPicker === 'epic'}"
               @click="currentPicker = 'epic'">
            <h3>Epic</h3>
            <div class="epic-label">
              <span v-if="issue.epic">
                {{ issue.epic }}
              </span>
              <span v-if="!issue.epic">
                No Epic
              </span>
            </div>
          </div>
          <list-picker :list-items="epicItems()"
                       title-text="Pick Epic"
                       empty-label="No Epic"
                       list-type="listSelect"
                       :allow-create="true"
                       :has-search-input="true"
                       @submit="editEpic"
                       @create="createEpic"
                       v-if="currentPicker === 'epic'"
                       @close="closePicker"></list-picker>
        </div>
        <div class="section labels">
          <div class="section-item">
            <h3>Labels</h3>
            <div class="label"
                  v-for="label in issue.labels">{{ label.label }}</div>
          </div>
        </div>
        <div class="section status date">
          <div class="section-item">
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
  </div>
</template>

<script>
import moment from 'moment'
import DescriptionEditor from './DescriptionEditor'
import SubtaskEditor from './SubtaskEditor'
import GeneralTextEditor from './GeneralTextEditor'
import ListPicker from '../ListPicker'
import SimpleNumberBox from '../SimpleNumberBox'
import _ from 'lodash'

export default {
  props: ['issueId', 'projectAssets'],
  components: {
    DescriptionEditor,
    SubtaskEditor,
    GeneralTextEditor,
    ListPicker,
    SimpleNumberBox
  },
  data () {
    return {
      loading: false,
      descriptionEditorOpen: false,
      initialLoading: true,
      issue: null,
      addingNewSubtask: false,
      newSubtaskBody: '',
      editingTask: null,
      addingComment: false,
      editingSummary: false,
      currentPicker: null
    }
  },
  methods: {
    heroListItems () {
      return this.projectAssets.users.map((user) => {
        return {
          image_url: user.avatar_url,
          text: this.fullName(user),
          originalUser: user
        }
      })
    },
    stateItems () {
      return this.projectAssets.states.map((state) => {
        return {
          text: state.label,
          originalState: state
        }
      })
    },
    issueTypeItems () {
      return this.projectAssets.issue_types.map((type) => {
        return {
          text: type.name,
          originalType: type
        }
      })
    },
    epicItems () {
      return this.projectAssets.epics.map((epic) => {
        return {
          text: epic.name,
          originalEpic: epic
        }
      })
    },
    fullName (person) {
      return person.first_name + ' ' + person.last_name
    },
    timeWords (time) {
      return moment(time).fromNow()
    },
    checkClose (e) {
      if (e.keyCode === 27) {
        this.$emit('close')
      }
    },
    // description
    updateDescription (newBody) {
      this.loading = true
      var data = {
        description: newBody
      }
      this.$http.post('http://localhost:3001/issues/' + this.issue.id + '/update_description', data).then((res) => {
        this.issue = res.data
        this.loading = false
        this.closeDescriptionEditor()
      })
    },
    closeDescriptionEditor () {
      this.descriptionEditorOpen = false
    },
    openDescriptionEditor () {
      this.descriptionEditorOpen = true
    },
    // subtasks
    toggleSubtask (id) {
      this.loading = true
      var data = {
        subtask_id: id
      }
      this.$http.post('http://localhost:3001/issues/' + this.issue.id + '/toggle_subtask', data).then((res) => {
        this.issue = res.data
        this.loading = false
      })
    },
    openAddSubtaskField () {
      this.editingTask = null
      this.addingNewSubtask = true
    },
    addSubtask (newBody) {
      this.loading = true
      var data = {
        subtask_body: newBody
      }
      this.$http.post('http://localhost:3001/issues/' + this.issue.id + '/add_subtask', data).then((res) => {
        this.issue = res.data
        this.loading = false
      })
    },
    deleteSubtask (id) {
      this.loading = true
      var data = {
        subtask_id: id
      }
      this.$http.post('http://localhost:3001/issues/' + this.issue.id + '/delete_subtask', data).then((res) => {
        this.issue = res.data
        this.loading = false
      })
    },
    beginEditSubtask (task) {
      this.addingNewSubtask = false
      this.editingTask = task
    },
    editingSubtask (task) {
      return this.editingTask === task
    },
    editSubtask (id, newBody) {
      this.loading = true
      var data = {
        subtask_id: id,
        subtask_body: newBody
      }
      this.editingTask.description = newBody
      this.editingTask = null
      this.$http.post('http://localhost:3001/issues/' + this.issue.id + '/edit_subtask', data).then((res) => {
        this.issue = res.data
        this.loading = false
      })
    },
    stopEditingSubtask () {
      this.editingTask = null
    },
    stopCreatingSubtask () {
      this.addingNewSubtask = false
    },
    // comments
    openAddComment () {
      this.addingComment = true
    },
    addComment (commentBody) {
      this.loading = true
      var data = {
        comment_body: commentBody
      }
      this.$http.post('http://localhost:3001/issues/' + this.issue.id + '/add_comment', data).then((res) => {
        this.issue = res.data
        this.loading = false
        this.closeAddComment()
      })
    },
    closeAddComment () {
      this.addingComment = false
    },
    editComment (body, comment) {
      this.loading = true
      comment.body = body
      var data = {
        comment_id: comment.id,
        comment_body: body
      }
      this.$http.post('http://localhost:3001/issues/' + this.issue.id + '/edit_comment', data).then((res) => {
        this.issue = res.data
        this.loading = false
        this.closeEditComment(comment)
      })
    },
    closeEditComment (comment) {
      comment.editing = false
    },
    openEditingComment (comment) {
      this.$set(comment, 'editing', true)
    },
    deleteComment (comment) {
      if (window.confirm('Are you sure you want to delete this comment?')) {
        this.loading = true
        this.issue.comments = _.without(this.issue.comments, comment)
        var data = {
          comment_id: comment.id
        }
        this.$http.post('http://localhost:3001/issues/' + this.issue.id + '/delete_comment', data).then((res) => {
          this.issue = res.data
          this.loading = false
        })
      }
    },
    // summary
    beginEditingSummary () {
      this.editingSummary = true
    },
    editSummary (newText) {
      this.loading = true
      this.issue.summary = newText
      var data = {
        new_body: newText
      }
      this.$http.post('http://localhost:3001/issues/' + this.issue.id + '/edit_summary', data).then((res) => {
        this.issue = res.data.detailed_issue
        this.loading = false
        this.cancelEditSummary()
        this.$emit('issueUpdated', res.data.simple_issue)
      })
    },
    cancelEditSummary () {
      this.editingSummary = false
    },
    // assignee
    editHero (hero) {
      this.loading = true
      var data = {}
      if (hero.originalUser) {
        this.issue.assignees = [hero.originalUser]
        data = {
          user_id: hero.originalUser.id
        }
      } else {
        this.issue.assignees = []
      }

      this.$http.post('http://localhost:3001/issues/' + this.issue.id + '/edit_hero', data).then((res) => {
        this.issue = res.data.detailed_issue
        this.loading = false
        this.closePicker()
        this.$emit('issueInlineUpdated', res.data.simple_issue)
      })
    },
    editReporter (hero) {
      this.loading = true
      this.issue.reporter = hero.originalUser
      var data = {
        user_id: hero.originalUser.id
      }
      this.$http.post('http://localhost:3001/issues/' + this.issue.id + '/edit_reporter', data).then((res) => {
        this.issue = res.data
        this.loading = false
        this.closePicker()
      })
    },
    editState (state) {
      this.loading = true
      this.issue.state = state.originalState.label
      var data = {
        status_id: state.originalState.id
      }
      this.$http.post('http://localhost:3001/issues/' + this.issue.id + '/edit_status', data).then((res) => {
        this.issue = res.data.detailed_issue
        this.loading = false
        this.closePicker()
        this.$emit('issueStateUpdated', res.data.simple_issue)
      })
    },
    editType (type) {
      this.loading = true
      this.issue.issue_type = type.originalType.name
      var data = {
        type_id: type.originalType.id
      }

      this.$http.post('http://localhost:3001/issues/' + this.issue.id + '/edit_type', data).then((res) => {
        this.issue = res.data.detailed_issue
        this.loading = false
        this.closePicker()
        this.$emit('issueInlineUpdated', res.data.simple_issue)
      })
    },
    editEpic (epic) {
      this.loading = true
      var data = {}
      if (epic.originalEpic) {
        this.issue.epic = epic.originalEpic.name
        data = {
          epic_id: epic.originalEpic.id
        }
      } else {
        this.issue.epic = null
      }

      this.$http.post('http://localhost:3001/issues/' + this.issue.id + '/edit_epic', data).then((res) => {
        this.issue = res.data.detailed_issue
        this.loading = false
        this.closePicker()
        this.$emit('issueInlineUpdated', res.data.simple_issue)
      })
    },
    createEpic (epic) {
      this.loading = true
      this.issue.epic = epic
      var data = {
        epic_name: epic
      }

      this.$http.post('http://localhost:3001/issues/' + this.issue.id + '/create_epic', data).then((res) => {
        this.issue = res.data.detailed_issue
        this.loading = false
        this.closePicker()
        this.$emit('issueInlineUpdated', res.data.simple_issue)
      })
    },
    editPoints (points) {
      this.loading = true
      this.issue.points = points
      var data = {}
      if (points) {
        data = {
          new_points: points
        }
      }
      this.$http.post('http://localhost:3001/issues/' + this.issue.id + '/edit_points', data).then((res) => {
        this.issue = res.data.detailed_issue
        this.loading = false
        this.closePicker()
        this.$emit('issueInlineUpdated', res.data.simple_issue)
      })
    },
    closePicker () {
      this.currentPicker = null
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
    window.addEventListener('keydown', this.checkClose)
    this.$http.get('http://localhost:3001/issues/' + this.issueId).then((res) => {
      this.issue = res.data
      this.initialLoading = false
    })
  },
  beforeDestroy () {
    window.removeEventListener('keydown', this.checkClose)
  }
}
</script>

<style lang="scss">
@import "../../assets/css/vendor/bourbon";
@import "../../assets/css/colors";

.new-comment-wrap {
  margin: 0 20px;
  // background-color: #eee;
  border: 1px solid #ddd;
  border-radius: 3px;
  &:hover {
    cursor: pointer;
    .new-comment-placeholder {
      text-decoration: underline;
    }
  }
  &.editing {
    &:hover {
      cursor: default;
    }
  }
  .new-comment-placeholder {
    color: #aaa;
    padding: 10px;
  }
}
</style>
