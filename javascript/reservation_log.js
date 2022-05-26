const reservationLog = Vue.extend({
  template: `
    <div class="main_container" style="min-height: 76vh;">
        <div class="table_container">
            <p>Reservation records</p>
            <input type="checkbox" v-model:checked="showall">View all records of reserved books</input>
            <div class="table_div">
                <div class="table_info">
                    <div class="infoms">account: {{uid}}</div>
                </div>
                <table>
                    <thead>
                    </thead>
                    <tbody>
                        <th width="220">Reservation Id</th>
                        <th>Reserve Time</th>
                        <th>bookName</th>
                        <th>State</th>
                        <th width="120">operation</th>
                        <tr v-for="(i,index) in list" v-if="showall || i.state === 0">
                            <td>{{i.reservationId}}</td>
                            <td>{{i.createTime}}</td>
                            <td>{{i.bookname}}</td>
                            <td v-if="i.state === 0" style="color:orange">Waiting</td>
                            <td v-if="i.state === 1" style="color:red">Interrupted</td>
                            <td v-if="i.state === 2" style="color:green">Success</td>
                            <td>
                                <button v-if="i.state === 0" class="continue" @click="cancel(index)">
                                    cancel
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
                
            </div>
        </div>
    </div>
    `,
  data: function () {
    return {
      uid: "",
      list: [],
      showall: false,
    }
  },
  methods: {
    getReservations() {
      const pms = SendJSON("GET", `${serverHost}:8002/bookservice/getReservationsList`, null, token);
      pms.then((value) => {
        this.list = [];
        if (value.data.reservations.length > 0) {
          this.uid = value.data.reservations[0].uid;
        }
        for (let i of value.data.reservations) {
          let record = {
            reservationId: i.reservationId,
            createTime: i.createTime,
            state: i.state,
            bookname: i.bookName
          }
          this.list.push(record);
        }
      });
    },
    cancel(index) {
      const pms = SendJSON("GET", `${serverHost}:8002/bookservice/cancelReservation/${this.list[index].reservationId}`, null, token);
      pms.then((value) => {
        alert(value.message);
        this.getReservations();
      }, (reason) => {
        alert(reason);
      })
    }
  },
  mounted() {
    const pms2 = SendJSON("GET", `${serverHost}:8001/usercenter/getuserinfo`, "", token);
    pms2.then((value) => {
      this.uid = value.data.userInfo.userId;
    });
    this.getReservations();
  }
});