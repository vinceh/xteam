import dragula from 'dragula'

// not sure where to put this...
export default Vue.directive('dragula', {
  inserted: function ($el) {
    dragula({
      isContainer (el) {
        return el === $el
      },
      mirrorContainer: $el
    })
  }
})
