<template>
  <input type="number"
         @keydown="checkInput"
         @keydown.esc.stop.prevent="close"
         @blur="submit"
         @keydown.enter.stop.prevent="submit"
         v-model="newValue"
         >
</template>

<script>
// import _ from 'lodash'

export default {
  props: ['value'],
  data () {
    return {
      newValue: this.value
    }
  },
  methods: {
    checkInput (e) {
      if (e.keyCode === 189 || e.keyCode === 190 || e.keyCode === 69) {
        e.stopPropagation()
        e.preventDefault()
      }
    },
    submit () {
      this.$emit('submit', this.newValue)
    },
    close () {
      this.$emit('close')
    }
  },
  created () {

  },
  mounted () {
    this.$el.focus()
    this.$el.select()
  },
  computed: {
  },
  beforeDestroy () {
  }
}
</script>

<style lang="scss" scoped>
@import "../assets/css/vendor/bourbon";
@import "../assets/css/colors";

input[type="number"]::-webkit-outer-spin-button,
input[type="number"]::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
}
input[type="number"] {
    -moz-appearance: textfield;
}

input {
  font-size: 18px;
  width: 30px;
  padding: 5px;
  text-align: center;
  border-radius: 2px;
  border: 1px solid #aaa;
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.075);
  &:focus {
    border: 1px solid $prime;
    box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.075), 0 0 4px $prime;
  }
}
</style>
