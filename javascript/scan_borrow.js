const borrowedbooks = Vue.extend({
  data: function () {
    return {
      showall: false,
      uid: 123456789,
      debt: 12,
      list: [],
      available: true,
      btnstyle: "",
    }
  },
  template: `
      <div class="borrowed_books">
        <div class="table_container">
            <p>Borrowed books</p>
            <input type="checkbox" v-model:checked="showall">View all records of borrowed books
            <div class="table_div" >
                <div class="table_info">
                    <div class="infoms">userId: {{uid}}</div>
                    <div class="infoms" style="color:red">total overdue payment: {{Number(debt).toFixed(2)}}</div>
                </div>
                <table>
                    <thead>
                    </thead>
                    <tbody>
                        <th width="120">bookName</th>
                        <th width="120">CreateTime</th>
                        <th width="120">Due Time</th>
                        <th width="120">State</th>
                        <th width="120">Debt</th>
                        <th width="120">operation</th>
                        <tr v-for="(i,index) in list" v-if="showall || i.state < 10000">
                            <td>{{i.bookName}}</td>
                            <td>{{i.createTime}}</td>
                            <td>{{i.dueTime}}</td>
                            <td v-if="i.state >= 0 && i.state < 10000">Remain:{{i.state}}&nbsp;Days</td>
                            <td v-if="i.state >= 10000">Returned</td>
                            <td v-if="i.state < 0">Overdue:{{-i.state}}&nbsp;Days</td>
                            <td>￥{{i.debt.toFixed(2)}}</td>
                            <td>
                                <button v-if="i.state >= 0 && i.state < 10000" class="continue" @click="conti(index)">
                                    Continue
                                </button>
                                <button class="continue" @click="returnBook(index)">
                                    Return
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>

            </div>
            <button @click="paydebt()" :style="btnstyle" :disabled="!available">Pay fine</button>
        </div>
        <div class="tip">
            Payment after confirmation!
        </div>
    </div>
    `,
  methods: {
    getBorrowedBooks() {
      const pms = SendJSON("GET", `${serverHost}:8002/bookservice/getborrowinfo`, null, token);
      pms.then((value) => {
        console.log(value)
        this.list = [];
        for (let i of value.data.borrowList) {
          let item = {
            bookId: i.bookId,
            borrowId: i.borrowId,
            bookName: i.bookName,
            createTime: i.createTime,
            dueTime: i.dueTime,
            state: i.state,
            barcode: i.isbnCode
            // debt:
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
      navTo('/rjgc/scan_borrow.html', {menu: 'board'})
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

const board = Vue.extend({
  data: function () {
    return {
      mode: 0,
      scanOK: false,
      scanMsg: null,
      bookId: '',
    }
  },
  template: `
    <div class="scan_board">
      <p class="title">Please scan the barcode below with a scanner</p>
      <div class="msg">
        <el-input class="input"  placeholder="auto input after scanning" v-model="bookId" disabled>
          <template slot="prepend">BookID</template>
        </el-input>
        <el-button class="btn" type="primary" :disabled="!scanOK" @click="handleSubmit">{{scanMsg?.mode === 0 ? 'borrow' : 'return'}}</el-button>
      </div>
      <div class="code-board">
        <el-image
          class="barcode"
          v-if="scanMsg"
          :src="scanMsg?.barcode"
        ></el-image>
        <div class="placement" v-else>
          Operate board
        </div>
      </div>
    </div>
  `,
  mounted() {
    this.getScanMsg()
    // 监听扫码事件
    if(this.scanMsg) {
      new ScanCode(this.handleScan)
    }
  },
  methods: {
    getScanMsg() {
      this.scanMsg = localStorage.scanMsg ? JSON.parse(localStorage.scanMsg) : null
    },
    toBorrowed() {
      navTo('/rjgc/scan_borrow.html', {menu: 'board'})
    },
    handleScan(bookId) {
      this.bookId = bookId
      this.scanOK = true
    },
    handleSubmit() {
      if(this.scanMsg.mode === 0) {
        this.borrowBook()
      } else {
        this.returnBook()
      }
    },
    borrowBook() {
      let pms = SendJSON("GET",`${serverHost}:8002/bookservice/borrowbook/${this.bookId}`,null,token);
      pms.then((value) => {
        alert(value.message);
        this.localStorage.scanMsg = null
        this.toBorrowed()
      },(reason) => {
        alert(reason);
      });
    },
    returnBook() {

    }
  }
})

new Vue({
  el: '#scan_borrow',
  components: {
    board,
    borrowedbooks,
  },
  data: {
    curIndex: 0,
    menu: [
      {
        key: '1',
        name: 'borrowed'
      }, {
        key: '2',
        name: 'board'
      }
    ]
  },
  methods: {
    changeMenu(key, keyPath) {
      let index = this.menu.findIndex((item) => item.key === key)
      index = index === -1 ? 0 : index
      navTo('/rjgc/scan_borrow.html', {menu: this.menu[index].name})
    }
  },
  mounted() {
    const curMenu = getQueryVariable('menu')
    let curIndex = this.menu.findIndex((item) => item.name === curMenu)
    this.curIndex = curIndex === -1 ? 0 : curIndex
  }
})