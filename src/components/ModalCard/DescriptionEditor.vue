<template>
  <div class="deets-editor">
    <div class="tabs">
      <div class="tab"
           :class="{active: currentTab === 'write'}"
           @click="changeTab('write')">
        Write
      </div>
      <div class="tab"
           :class="{active: currentTab === 'preview'}"
           @click="changeTab('preview')">
        Preview
      </div>
    </div>
    <div class="output">
      <div class="write-input-wrap"
           v-show="currentTab === 'write'">
        <textarea class="write-input"
                  v-model="newBody"
                  :disabled="updating"></textarea>
      </div>
      <div class="preview-output markdown"
           v-html="renderMarkdown(newBody)"
           v-show="currentTab === 'preview'">
      </div>
      <div class="actions">
        <div class="help-text">
          <i class="mdi mdi-markdown"></i> Markdown supported
        </div>
        <div class="action-buttons">
          <button class="primary"
                  @click="update"
                  :disabled="updating">Update Description</button>
          <a @click="cancel"
             :class="{disabled: updating}">Cancel</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import autosize from 'autosize'

export default {
  props: ['body'],
  data () {
    return {
      currentTab: 'write',
      newBody: this.body.slice(0),
      updating: false
    }
  },
  methods: {
    changeTab (changeTo) {
      this.currentTab = changeTo
      // better way to do this is to use updated (), but this works too
      setTimeout(() => {
        document.querySelector('.write-input').focus()
      })
    },
    update () {
      if (!this.updating) {
        this.updating = true
        this.$emit('update', this.newBody.trim())
      }
    },
    cancel () {
      if (!this.updating) {
        this.$emit('cancel')
      }
    }
  },
  mounted () {
    autosize(document.querySelector('.write-input'))
    document.querySelector('.write-input').focus()
  },
  computed: {
  }
}
</script>
