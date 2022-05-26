new Vue({
  el: '#scan_borrow',
  components: {
    board,
    borrowedbooks,
    reservationLog,
  },
  data: {
    curIndex: 0,
    menu: [
      {
        key: '1',
        name: 'borrowed'
      }, {
        key: '2',
        name: 'reservation'
      }, {
        key: '3',
        name: 'board'
      }
    ]
  },
  methods: {
    changeMenu(key, keyPath) {
      let index = this.menu.findIndex((item) => item.key === key)
      index = index === -1 ? 0 : index
      navTo('./scan_borrow.html', {menu: this.menu[index].name})
    }
  },
  mounted() {
    const curMenu = getQueryVariable('menu')
    let curIndex = this.menu.findIndex((item) => item.name === curMenu)
    this.curIndex = curIndex === -1 ? 0 : curIndex
  }
})