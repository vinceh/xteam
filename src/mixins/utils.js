import MarkdownIt from 'markdown-it'

module.exports = {
  methods: {
    cardIconClass (issueType) {
      switch (issueType) {
        case 'story':
          return 'mdi-sword'
        case 'task':
          return 'mdi-shield-outline'
        case 'bug':
          return 'mdi-biohazard'
      }
    },
    renderMarkdown (text) {
      var md = new MarkdownIt()
      return md.render(text)
    }
  }
}
