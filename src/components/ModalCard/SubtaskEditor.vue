<template>
  <div>
    <textarea type="text"
           class="add-item-input"
           placeholder="Type and press <Enter>"
           v-model="newBody"
           @keyup.enter.stop.prevent="submitSubtask"
           @keydown.enter.stop.prevent></textarea>
     <div class="subtask-actions">
       <button type="button"
               class="primary"
               @click="submitSubtask">
         {{ buttonName }}
       </button>
       <i class="mdi mdi-close cancel"
          @click.stop.prevent="stopEditing"></i>
       <a @click.stop.prevent="deleteSubtask"
          v-if="task">
         Delete
       </a>
     </div>
  </div>
</template>

<script>
import autosize from 'autosize'

export default {
  props: ['task'],
  data () {
    return {
      newBody: this.task ? this.task.description.slice(0) : ''
    }
  },
  methods: {
    submitSubtask () {
      if (!this.task) {
        this.$emit('add-subtask', this.newBody.trim())
        this.newBody = ''
        this.$el.querySelector('textarea').focus()
      } else {
        this.$emit('edit-subtask', this.task.id, this.newBody.trim())
        this.newBody = ''
      }
    },
    stopEditing () {
      this.$emit('stop-editing')
      this.newBody = ''
    },
    deleteSubtask () {
      this.$emit('delete-subtask', this.task.id)
    }
  },
  computed: {
    buttonName () {
      if (this.task) {
        return 'Update'
      } else {
        return 'Add Subtask'
      }
    }
  },
  mounted () {
    var textarea = this.$el.querySelector('textarea')
    autosize(textarea)
    textarea.focus()
    textarea.select()
  }
}
</script>

<style lang="scss">
  .subtask-actions {
    margin-top: 10px;
    .primary {
      font-size: 14px;
      padding: 8px 12px;
    }
    a {
      float: right;
      line-height: 32px;
      margin-right: 5px;
      font-style: normal;
      color: #555;
    }
    .cancel {
      font-size: 23px;
      position: relative;
      top: 3px;
      margin-left: 4px;
      font-weight: 600;
      color: #aaa;
      &:hover {
        cursor: pointer;
        color: #666;
      }
    }
  }
</style>
