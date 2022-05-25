const token = getCookie("token");

new Vue({
  el: '#notification',
  data: {
    notification: []
  },
  methods: {
    getNotifications() {
      let pms = SendJSON("GET",`${serverHost}:8002/bookservice/getNotification`,null,token);
      pms.then((value) => {
        this.notification = value.data.notification;
      });
    },
    toBorrowed() {
      navTo('./scan_borrow.html', {menu: 'borrowed'})
    },
    toReserved() {
      navTo('./scan_borrow.html', {menu: 'reservation'})
    }
  },
  computed: {
    borrowDue() {
      return this.notification.filter((item, i) => item.state === 0)
    },
    reserveDue() {
      return this.notification.filter((item, i) => item.state === 1)
    },
    fineDue() {
      return this.notification.filter((item, i) => item.state === 2)
    }
  },
  mounted() {
    this.getNotifications()
  }
})