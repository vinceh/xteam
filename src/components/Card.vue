<template>
  <div class="card"
       :class="cardClass"
       @click="open">
    <div class="icons">
      <div class="type">
        <i class="mdi"
           :class="cardIconClass(issue.issue_type)"></i>
      </div>
      <div class="points">
        {{ issue.points }}
      </div>
    </div>
    <div class="summary">
      {{ issue.summary }}
    </div>
    <div class="card-id">
      {{ issue.issue_key }} <span v-if="issue.epic">&middot; {{ issue.epic }}</span>
    </div>
    <div class="people">
      <img v-for="user in issue.assignees"
           :src="user.avatar_url">
    </div>
  </div>
</template>

<script>
export default {
  props: ['issue'],
  methods: {
    open () {
      this.$emit('open')
    }
  },
  computed: {
    cardClass () {
      var returnee = this.issue.issue_type
      if (this.issue.assignees.find((user) => { return user.id === 1 })) {
        returnee = returnee + ' mine'
      }
      return returnee
    }
  }
}
</script>
