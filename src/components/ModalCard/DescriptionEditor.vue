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
           v-show="currentTab === 'preview' && newBody.trim() !== ''">
      </div>
      <div class="empty-desc" v-show="currentTab === 'preview' && newBody.trim() === ''">
        Nothing to preview
      </div>
      <div class="actions">
        <div class="help-text">
          <i class="mdi mdi-markdown"></i> Markdown supported
        </div>
        <div class="action-buttons">
          <button class="primary"
                  @click="update"
                  :disabled="updating || emptyCheck()">{{ submitLabel }}</button>
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
  props: ['body', 'submitLabel', 'allowEmpty', 'identifier'],
  data () {
    return {
      currentTab: 'write',
      newBody: this.body ? this.body.slice(0) : '',
      updating: false
    }
  },
  methods: {
    emptyCheck () {
      if (!this.allowEmpty) {
        return this.newBody === ''
      }

      return false
    },
    changeTab (changeTo) {
      this.currentTab = changeTo
      // better way to do this is to use updated (), but this works too
      setTimeout(() => {
        this.$el.querySelector('.write-input').focus()
      })
    },
    update () {
      if (!this.updating) {
        this.updating = true
        this.$emit('update', this.newBody.trim(), this.identifier)
      }
    },
    cancel () {
      if (!this.updating) {
        this.$emit('cancel', this.identifier)
      }
    }
  },
  mounted () {
    var input = this.$el.querySelector('.write-input')
    autosize(input)
    input.focus()
  },
  computed: {
  }
}
</script>

<style lang="scss" scoped>
@import "../../assets/css/colors";

.deets-editor {
  .tabs {
    border-bottom: 1px solid #ddd;
    display: table;
    width: 100%;
    padding-top: 10px;
    background-color: #fafafa;
    .tab {
      position: relative;
      top: 1px;
      z-index: 99;
      padding: 9px 12px;
      color: #777;
      border: 1px solid transparent;
      border-bottom: 1px solid #ddd;
      border-top-left-radius: 3px;
      border-top-right-radius: 3px;
      float: left;
      line-height: 1em;
      &:hover {
        cursor: pointer;
        color: #555;
      }
      &.active {
        background-color: white;
        border: 1px solid #ddd;
        color: #555;
        border-bottom: 1px solid white;
      }
      &:first-child {
        margin-left: 10px;
      }
    }
  }
  .write-input-wrap {
    padding: 10px;
  }
  .write-input {
    background-color: #fafafa;
    border: 1px solid #ddd;
    border-radius: 3px;
    outline: none;
    box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.075);
    display: block;
    width: 100%;
    box-sizing: border-box;
    max-height: 550px;
    min-height: 200px;
    padding: 10px;
    resize: vertical;
    line-height: 1.4em;
    &:focus {
      border-color: $prime;
      box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.075), 0 0 3px $prime;
      background-color: white;
    }
    &:disabled {
      color: #aaa;
      background-color: #f6f6f6;
      cursor: no-drop;
    }
  }
  .preview-output {
    padding: 15px;
    min-height: 219px;
    box-sizing: border-box;
    line-height: 1.5em;
  }
  .empty-desc {
    text-align: center;
    padding-top: 104px;
    padding-bottom: 100px;
    color: #aaa;
    line-height: 1em;
  }
  .actions {
    padding: 10px;
    padding-top: 0;
    // margin-top: 10px;
    display: table;
    width: 100%;
    box-sizing: border-box;
    font-size: 13px;
    .help-text {
      float: left;
      color: #777;
      line-height: 38px;
      i {
        font-size: 17px;
        line-height: 13px;
        position: relative;
        top: 2px;
      }
    }
    .action-buttons {
      line-height: 38px;
      a {
        float: right;
        margin-right: 15px;
      }
      button {
        float: right;
        font-size: 14px;
        font-weight: 400;
      }
    }
  }
}
</style>
