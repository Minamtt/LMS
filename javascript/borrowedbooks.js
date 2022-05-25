const borrowedbooks = Vue.extend({
  template: `
      <div class="borrowed_books">
        <div class="table_container">
            <p>Borrowed books</p>
            <input type="checkbox" v-model:checked="showall">View all records of borrowed books</input>
            <div class="table_div" >
                <div class="table_info">
                    <div class="infoms">userId: {{uid}}</div>
                    <div class="infoms" style="color:red">total overdue payment: {{Number(debt).toFixed(2)}}</div>
                </div>
                <table>
                    <thead>
                    </thead>
                    <tbody>
                        <th width="140">bookName</th>
                        <th width="120">CreateTime</th>
                        <th width="120">Due Time</th>
                        <th width="120">BorrowState</th>
                        <th width="120">BookState</th>
                        <th width="90">Debt</th>
                        <th width="140">operation</th>
                        <tr v-for="(i,index) in list" v-if="showall || i.state < 10000">
                            <td>{{i.bookName}}</td>
                            <td>{{i.createTime}}</td>
                            <td>{{i.dueTime}}</td>
                            <td v-if="i.state >= 0 && i.state < 10000">Remain:{{i.state}}&nbsp;Days</td>
                            <td v-if="i.state >= 10000">Returned</td>
                            <td v-if="i.state < 0">Overdue:{{-i.state}}&nbsp;Days</td>
                            <td>{{bookStateName[i.bookState]}}</td>
                            <td>￥{{i.debt.toFixed(2)}}</td>
                            <td>
                              <div v-if="i.state >= 0 && i.state < 10000 && (i.bookState <= 1 ||i.bookState >=4)">
                                <button class="continue" @click="conti(index)">
                                    Continue
                                </button>
                                <button class="continue" @click="returnBook(index)">
                                    Return
                                </button>
                                <button class="continue" @click="openReport(index)">
                                    Report
                                </button>
                              </div>
                              <div v-if="i.bookState > 1 && i.bookState < 4">
                                 <button class="continue" @click="payLostBook(index)">
                                    PayLost
                                 </button>
                              </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <button @click="paydebt()" :style="btnstyle" :disabled="!available">Pay fine</button>
        </div>
        <el-dialog
          title="report book problems"
          :visible.sync="dialogVisible"
          width="30%"
        >
          <div class="report-item">
            <span>book lost</span>
            <button class="continue" @click="reportLost">report</button>
          </div>
          <div class="report-item">
            <span>book damaged</span>
            <button class="continue" @click="reportDamaged">report</button>
          </div>
        </el-dialog>
        <div class="tip">
            Payment after confirmation!
        </div>
        <div id="form"></div>
    </div>
    `,
  data: function () {
    return {
      showall: false,
      uid: 123456789,
      debt: 12,
      list: [],
      available: true,
      btnstyle: "",
      dialogVisible: false,
      openIndex: -1,
      bookStateName: ['Avaiable', 'Borrowed', 'Lost', 'Damaged']
    }
  },
  methods: {
    getBorrowedBooks() {
      const pms = SendJSON("GET", `${serverHost}:8002/bookservice/getborrowinfo`, null, token);
      pms.then((value) => {
        this.list = [];
        for (let i of value.data.borrowList) {
          let item = {
            bookId: i.bookId,
            borrowId: i.borrowId,
            bookName: i.bookName,
            createTime: i.createTime,
            dueTime: i.dueTime,
            state: i.state,
            bookState: i.bookState,
            barcode: i.url
          };
          item.debt = 0;
          if (item.state < 0) {
            item.debt = Math.max(0, -item.state);
          }
          this.list.push(item);
        }
      });
    },
    conti(index) {
      const pms = SendJSON("GET", `${serverHost}:8002/bookservice/addduetime/${this.list[index].bookId}`, null, token);
      pms.then((value) => {
        alert(value.message);
        this.getBorrowedBooks();
      }, (reason) => {
        alert(reason);
      })

    },
    paydebt() {
      location.href = "./pay.html";
    },
    returnBook(index) {
      // 保存书籍二维码
      localStorage.scanMsg = JSON.stringify({
        mode: 1,
        barcode: this.list[index].barcode
      })
      // 导航到借书面板
      navTo('./scan_borrow.html', {menu: 'board'})
    },
    openReport(index) {
      this.openIndex = index
      this.dialogVisible = true
    },
    reportLost() {
      this.setBookState(2)
      this.dialogVisible = false
      this.refresh()
    },
    reportDamaged() {
      this.setBookState(3)
      this.dialogVisible = false
      this.refresh()
    },
    setBookState(state) {
      const pms = SendJSON("GET", `${serverHost}:8002/bookservice/setbookstate/${this.list[this.openIndex].bookId}/${state}`, null, token);
      pms.then((value) => {
        alert(value.message);
      }, (reason) => {
        alert(reason);
      })
    },
    payLostBook(index) {
      const pms = SendJSON("GET", `${serverHost}:8004/pay/paylostbook/${this.list[index].bookId}`, null, token);
      pms.then((value) => {
        document.querySelector('#form').innerHTML = value.data.url
        document.forms[0].setAttribute('target', '_blank')
        document.forms[0].submit();
        // alert(value.message);
      }, (reason) => {
        // TODO cors policy
        alert(reason);
      })
    },
    refresh() {
      history.go(0)
    }
  },
  mounted() {
    const pms = SendJSON("GET", `${serverHost}:8002/bookservice/getuserdebt`, null, token);
    pms.then((value) => {
      if (value.data.debt === 0) {
        this.available = false;
        this.btnstyle = "background-color:#AAAAAA";
      }
      this.debt = value.data.debt;
    });
    const pms2 = SendJSON("GET", `${serverHost}:8001/usercenter/getuserinfo`, "", token);
    pms2.then((value) => {
      this.uid = value.data.userInfo.userId;
    });
    this.getBorrowedBooks();
  }
})