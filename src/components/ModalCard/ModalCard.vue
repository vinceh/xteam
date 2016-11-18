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
               v-show="!editingSummary">
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
                              @update="editDescription"
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
                <general-text-editor :text="task.description"
                                     :allow-empty="false"
                                     :allow-delete="true"
                                     :allow-enter-submit="true"
                                     :identifier="task"
                                     @submit="editSubtask"
                                     @cancel="stopEditingSubtask"
                                     @delete="deleteSubtask"
                                     v-if="editingSubtask(task)"
                                     submit-label="Update"
                                     placeholder="Type and press <Enter>">
                </general-text-editor>
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
                <general-text-editor :text="''"
                                     :allow-empty="false"
                                     :allow-delete="false"
                                     :allow-enter-submit="true"
                                     @submit="addSubtask"
                                     @cancel="stopCreatingSubtask"
                                     @delete="deleteSubtask"
                                     v-if="addingNewSubtask"
                                     submit-label="Add Subtask"
                                     placeholder="Type and press <Enter>">
                </general-text-editor>
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
          <div class="section-item"
               :class="{active: currentPicker === 'labels'}"
               @click="currentPicker = 'labels'">
            <h3>Labels</h3>
            <div class="label"
                  v-for="label in issue.labels">
              {{ label.label }}
            </div>
            <div class="no-labels"
                 v-if="issue.labels.length === 0">
              No Labels
            </div>
          </div>
          <list-picker :list-items="labelItems()"
                       title-text="Labels"
                       empty-label="Clear Labels"
                       :allow-create="true"
                       :has-search-input="true"
                       @submit="toggleLabel"
                       @create="createLabel"
                       v-if="currentPicker === 'labels'"
                       @close="closePicker"></list-picker>
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
import GeneralTextEditor from './GeneralTextEditor'
import ListPicker from '../ListPicker'
import SimpleNumberBox from '../SimpleNumberBox'
import _ from 'lodash'
import { mapState } from 'vuex'

/* eslint-disable no-redeclare */
export default {
  props: ['issueId'],
  components: {
    DescriptionEditor,
    GeneralTextEditor,
    ListPicker,
    SimpleNumberBox
  },
  data () {
    return {
      loading: false,
      descriptionEditorOpen: false,
      initialLoading: true,
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
    labelItems () {
      return this.projectAssets.labels.map((label) => {
        var index = _.findIndex(this.issue.labels, (newLabels) => {
          return newLabels.id === label.id
        })
        return {
          text: label.label,
          originalLabel: label,
          checked: index >= 0
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
    editDescription (newBody) {
      this.loading = true
      var payload = {
        issueId: this.issue.id,
        data: {
          description: newBody
        }
      }
      this.$store.dispatch('editDescription', payload).then(() => {
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
      var payload = {
        issueId: this.issue.id,
        data: {
          subtask_id: id
        }
      }
      this.$store.dispatch('toggleSubtask', payload).then(() => {
        this.loading = false
      })
    },
    openAddSubtaskField () {
      this.editingTask = null
      this.addingNewSubtask = true
    },
    addSubtask (newBody, identifier = null, clear) {
      this.loading = true
      var payload = {
        issueId: this.issue.id,
        data: {
          subtask_body: newBody
        }
      }
      this.$store.dispatch('addSubtask', payload).then(() => {
        this.loading = false
        clear()
      })
    },
    deleteSubtask (subtask) {
      this.loading = true
      var payload = {
        issueId: this.issue.id,
        data: {
          subtask_id: subtask.id
        }
      }
      this.$store.dispatch('deleteSubtask', payload).then(() => {
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
    editSubtask (newBody, originalTask) {
      this.loading = true
      var payload = {
        issueId: this.issue.id,
        data: {
          subtask_id: originalTask.id,
          subtask_body: newBody
        }
      }
      this.editingTask.description = newBody
      this.stopEditingSubtask()
      this.$store.dispatch('editSubtask', payload).then(() => {
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
      var payload = {
        issueId: this.issue.id,
        data: {
          comment_body: commentBody
        }
      }
      this.$store.dispatch('addComment', payload).then(() => {
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
      var payload = {
        issueId: this.issue.id,
        data: {
          comment_id: comment.id,
          comment_body: body
        }
      }
      this.$store.dispatch('editComment', payload).then(() => {
        this.loading = false
        this.closeAddComment()
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
        var payload = {
          issueId: this.issue.id,
          data: {
            comment_id: comment.id
          }
        }
        this.$store.dispatch('deleteComment', payload).then(() => {
          this.loading = false
          this.closeAddComment()
        })
      }
    },
    // summary
    beginEditingSummary (e) {
      this.editingSummary = true
    },
    editSummary (newText) {
      this.loading = true
      var payload = {
        issueId: this.issue.id,
        data: {
          new_body: newText
        }
      }
      this.$store.dispatch('editSummary', payload).then(() => {
        this.loading = false
        this.cancelEditSummary()
      })
    },
    cancelEditSummary () {
      this.editingSummary = false
    },
    // assignee
    editHero (hero) {
      this.loading = true
      var payload = {
        issueId: this.issue.id,
        data: {}
      }
      if (hero.originalUser) {
        this.issue.assignees = [hero.originalUser]
        payload.data = {
          user_id: hero.originalUser.id
        }
      } else {
        this.issue.assignees = []
      }
      this.$store.dispatch('editHero', payload).then(() => {
        this.loading = false
        this.closePicker()
      })
    },
    editReporter (hero) {
      this.loading = true
      this.issue.reporter = hero.originalUser
      var payload = {
        issueId: this.issue.id,
        data: {
          user_id: hero.originalUser.id
        }
      }
      this.$store.dispatch('editReporter', payload).then(() => {
        this.loading = false
        this.closePicker()
      })
    },
    editState (state) {
      this.loading = true
      this.issue.state = state.originalState.label
      var payload = {
        issueId: this.issue.id,
        data: {
          status_id: state.originalState.id
        }
      }
      this.$store.dispatch('editState', payload).then(() => {
        this.loading = false
        this.closePicker()
      })
    },
    editType (type) {
      this.loading = true
      this.issue.issue_type = type.originalType.name
      var payload = {
        issueId: this.issue.id,
        data: {
          type_id: type.originalType.id
        }
      }
      this.$store.dispatch('editType', payload).then(() => {
        this.loading = false
        this.closePicker()
      })
    },
    editEpic (epic) {
      this.loading = true
      var payload = {
        issueId: this.issue.id,
        data: {}
      }
      if (epic.originalEpic) {
        this.issue.epic = epic.originalEpic.name
        payload.data = {
          epic_id: epic.originalEpic.id
        }
      } else {
        this.issue.epic = null
      }

      this.$store.dispatch('editEpic', payload).then(() => {
        this.loading = false
        this.closePicker()
      })
    },
    createEpic (epic) {
      this.loading = true
      this.issue.epic = epic
      var payload = {
        issueId: this.issue.id,
        data: {
          epic_name: epic
        }
      }
      this.$store.dispatch('createEpic', payload).then(() => {
        this.loading = false
        this.closePicker()
      })
    },
    editPoints (points) {
      this.loading = true
      this.issue.points = points
      var payload = {
        issueId: this.issue.id,
        data: {}
      }
      if (points) {
        payload.data = {
          new_points: points
        }
      }
      this.$store.dispatch('editPoints', payload).then(() => {
        this.loading = false
        this.closePicker()
      })
    },
    toggleLabel (label) {
      this.loading = true
      if (label.originalLabel) {
        var index = _.findIndex(this.issue.labels, (currentLabel) => {
          return currentLabel.id === label.originalLabel.id
        })

        if (index >= 0) {
          this.issue.labels.splice(index, 1)
        } else {
          this.issue.labels.push(label.originalLabel)
        }

        var payload = {
          issueId: this.issue.id,
          data: {
            label_id: label.originalLabel.id
          }
        }

        this.$store.dispatch('toggleLabel', payload).then(() => {
          this.loading = false
        })
      } else {
        this.issue.labels = []
        this.closePicker()

        var payload = {
          issueId: this.issue.id
        }

        this.$store.dispatch('clearAllLabels', payload).then(() => {
          this.loading = false
        })
      }
    },
    createLabel (label) {
      this.loading = true
      this.issue.labels.push({
        label: label
      })
      this.closePicker()

      var payload = {
        issueId: this.issue.id,
        data: {
          label: label
        }
      }

      this.$store.dispatch('createIssueLabel', payload).then(() => {
        this.loading = false
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
    },
    ...mapState({
      projectAssets: store => store.projectAssets,
      issue: store => store.issue.detailedIssue
    })
  },
  created () {
    window.addEventListener('keydown', this.checkClose)
    this.$store.dispatch('getIssue', this.issueId).then((res) => {
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
