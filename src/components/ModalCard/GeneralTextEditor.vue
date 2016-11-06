<template>
  <div>
    <textarea :disabled="submitting"
              v-model="newText"
              :placeholder="this.placeholder"
              @keydown.enter.stop.prevent
              v-on:keydown="checkSubmit($event)"></textarea>
    <div class="subtask-actions">
      <button type="button"
              class="primary"
              @click="submitAction"
              :disabled="submitting || checkEmpty()">
        {{ submitLabel }}
      </button>
      <i class="mdi mdi-close cancel"
         @click.stop.prevent="cancelAction"></i>
      <a @click.stop.prevent="deleteAction"
         v-if="allowDelete">
        Delete
      </a>
    </div>
  </div>
</template>

<script>
import autosize from 'autosize'

export default {
  props: ['text', 'allowEmpty', 'allowDelete', 'identifier', 'submitLabel', 'placeholder'],
  data () {
    return {
      newText: this.text.slice(0),
      submitting: false
    }
  },
  methods: {
    checkSubmit (e) {
      if ((e.metaKey || e.ctrlKey) && e.keyCode === 13) {
        console.log('yup submitting')
      }
    },
    checkEmpty () {
      if (!this.allowEmpty && this.newText === '') {
        return true
      }
    },
    submitAction () {
      if (!this.submitting) {
        this.submitting = true
        this.$emit('submit', this.newText.trim(), this.identifier)
      }
    },
    cancelAction () {
      if (!this.submitting) {
        this.$emit('cancel', this.identifier)
      }
    },
    deleteAction () {
      if (!this.submitting) {
        this.$emit('delete', this.identifier)
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

<style lang="scss" scoped>
textarea {
  width: 100%;
  display: block;
  line-height: 1.4em;
  box-sizing: border-box;
  padding: 7px;
  border: 1px solid #ddd;
  background-color: #fafafa;
  border-radius: 3px;
  box-shadow: inset 0 1px 6px rgba(0, 0, 0, .1);
  margin-top: -1px;
  &:disabled {
    color: #aaa;
    background-color: #f6f6f6;
    cursor: no-drop;
  }
  &::-webkit-input-placeholder {
    color: #ccc;
  }
  &:-moz-placeholder {
    color: #ccc;
  }
  &::-moz-placeholder {
    color: #ccc;
  }
  &:-ms-input-placeholder {
    color: #ccc;
  }
}
.actions {
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
