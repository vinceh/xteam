<template>
  <div class="picker-wrap">
    <div class="heading-wrap">
      <div class="title">
        {{ titleText }}
      </div>
      <div class="input-wrap"
           v-if="hasSearchInput">
        <input type="text"
               @keyup.stop.prevent="filterList"
               @keydown.up.stop.prevent="choosePreviousItem"
               @keydown.down.stop.prevent="chooseNextItem"
               @keyup.up.stop.prevent
               @keyup.down.stop.prevent
               @keydown.enter.stop.prevent="chooseItem"
               @keydown.esc.stop.prevent="closePicker"
               v-model="filterInput">
      </div>
    </div>
    <div class="results-list">
      <div class="create-new"
           v-if="showCreate()">
         <div>
           Press <span class="enter">Enter</span> to create:
         </div>
         <div class="new-epic">
           <span>
             {{ filterInput }}
           </span>
         </div>
      </div>
      <div class="item"
           :class="itemClass(item, index)"
           @mouseover="itemHover(item)"
           v-for="(item, index) in filteredItems"
           @click="chooseItem(item)">
        <img class="item-image"
             v-if="listType === 'image' && item.image_url"
             :src="item.image_url">
        <i class="item-icon mdi"
           :class="cardIconClass(item.text)"
           v-if="listType === 'icon'"></i>
        {{ item.text }}
        <i class="mdi mdi-check"
           v-if="item.checked">
        </i>
      </div>
    </div>
  </div>
</template>

<script>
// import _ from 'lodash'

export default {
  props: ['listItems', 'listType', 'pickType', 'currentlyPicked', 'emptyLabel', 'titleText', 'hasSearchInput', 'allowCreate'],
  data () {
    return {
      highlightedItem: null,
      newListItems: this.listItems.slice(0),
      filteredItems: null,
      filterInput: ''
    }
  },
  watch: {
    listItems (newVal, oldVal) {
      this.assignData(newVal)
    }
  },
  methods: {
    assignData (newData) {
      // TODO this is pretty fucking ugly
      var newListItems = newData
      if (this.emptyLabel) {
        newListItems.splice(0, 0, {
          text: this.emptyLabel
        })
      }
      this.newListItems = newListItems
      var query = this.filterInput.trim().toLowerCase()

      // remember where the current highlighted index is before we
      // set the new reactive data (thus removing the highlight)
      var highlightedItemIndex = this.filteredItems.indexOf(this.highlightedItem)

      this.filteredItems = this.newListItems.filter((item) => {
        return item.text.toLowerCase().includes(query)
      })

      this.highlightedItem = this.filteredItems[highlightedItemIndex]
    },
    itemClass (item, index) {
      return {
        highlighted: this.highlightedItem === item,
        empty: this.emptyLabel === item.text
      }
    },
    showCreate () {
      return this.allowCreate && this.filteredItems.length === 0
    },
    chooseItem () {
      if (this.highlightedItem) {
        this.$emit('submit', this.highlightedItem)
      } else if (this.allowCreate) {
        this.$emit('create', this.filterInput)
      }
    },
    clearInput () {
      this.filterInput = ''
    },
    closePicker () {
      this.$emit('close')
    },
    filterList () {
      var query = this.filterInput.trim().toLowerCase()
      this.filteredItems = this.newListItems.filter((item) => {
        return item.text.toLowerCase().includes(query)
      })
      if (this.filteredItems.indexOf(this.highlightedItem) < 0) {
        this.highlightedItem = this.filteredItems[this.filteredItems.length - 1]
      }
      if (this.highlightedItem) {
        setTimeout(() => {
          this.$el.querySelector('.item.highlighted').scrollIntoView(false)
        })
      }
    },
    choosePreviousItem ($event) {
      var index = this.filteredItems.indexOf(this.highlightedItem)
      if (index > 0) {
        this.highlightedItem = this.filteredItems[index - 1]
        this.$el.querySelector('.item.highlighted').scrollIntoView(false)
      }
    },
    chooseNextItem () {
      var index = this.filteredItems.indexOf(this.highlightedItem)
      if (index < this.filteredItems.length - 1) {
        this.highlightedItem = this.filteredItems[index + 1]
        this.$el.querySelector('.item.highlighted').scrollIntoView(true)
      }
    },
    itemHover (item) {
      this.highlightedItem = item
    },
    checkClose (e) {
      if (!this.$el.contains(e.target)) {
        this.closePicker()
      }
    }
  },
  created () {
    if (this.emptyLabel) {
      this.newListItems.splice(0, 0, {
        text: this.emptyLabel
      })
    }
    this.filteredItems = this.newListItems
    if (this.emptyLabel) {
      this.highlightedItem = this.filteredItems[1]
    } else {
      this.highlightedItem = this.filteredItems[0]
    }
    window.addEventListener('mousedown', this.checkClose)
  },
  mounted () {
    if (this.hasSearchInput) {
      this.$el.querySelector('input').focus()
    }
  },
  computed: {
  },
  beforeDestroy () {
    window.removeEventListener('mousedown', this.checkClose)
  },
  beforeUpdate () {
  }
}
</script>

<style lang="scss" scoped>
@import "../assets/css/vendor/bourbon";
@import "../assets/css/colors";

.picker-wrap {
  position: absolute;
  left: 80%;
  top: 0;
  box-shadow: 0 4px 6px rgba(50, 50, 93, 0.11), 0 1px 3px rgba(0, 0, 0, 0.08);
  border: 1px solid #afbdca;
  border-radius: 4px;
  z-index: 999;
  background-color: white;
  overflow: hidden;
  min-width: 200px;
  .heading-wrap {
    border-bottom: 1px solid #ddd;
    background-color: #fafafa;
    .title {
      padding: 8px 10px 0;
      margin-bottom: 8px;
      color: #999;
      font-size: 12px;
    }
    .input-wrap {
      padding: 10px;
      padding-top: 0;
      margin-top: 10px;
      input {
        display: block;
        padding: 8px;
        border: 1px solid #ddd;
        border-radius: 2px;
        width: 175px;
        box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.075);
        &:focus {
          border: 1px solid $prime;
          box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.075), 0 0 4px $prime;
        }
      }
    }
  }

  .create-new {
    padding: 15px;
    // padding-top: 12px;
    font-size: 12px;
    color: #888;
    .enter {
      border: 1px solid #aaa;
      padding: 0 5px;
      border-radius: 3px;
      margin: 0 2px;
      background-color: #f6f6f6;
    }
    .new-epic {
      margin-top: 10px;
      span {
        color: #555;
        border-radius: 3px;
        font-size: 15px;
        font-weight: 600;
      }
    }
  }

  .results-list {
    max-height: 250px;
    overflow-y: auto;
    .item {
      padding: 9px 11px;
      border-bottom: 1px solid #eee;
      box-sizing: border-box;
      line-height: 19px;
      font-size: 14px;
      color: tint($dark, 20%);
      &:hover {
        cursor: pointer;
      }
      &:last-child {
        border-bottom: none;
      }
      &.empty {
        color: #aaa;
        font-style: italic;
      }
      &.selected {

      }
      &.highlighted {
        // background-color: tint($orange, 93%);
        background-color: #fff7e2;
      }
      .mdi-check {
        float: right;
      }
      .item-image {
        height: 16px;
        border-radius: 2px;
        margin-right: 4px;
        vertical-align: middle;
        position: relative;
        top: -2px;
      }
      .item-icon {
        margin-right: 3px;
      }
    }
  }
}
</style>
