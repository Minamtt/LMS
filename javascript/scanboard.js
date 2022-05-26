const board = Vue.extend({
  data: function () {
    return {
      mode: 0,
      scanOK: false,
      scanMsg: null,
      userMsg: null,
      bookId: '',
    }
  },
  template: `
    <div class="scan_board">
      <p class="title">{{scanMsg ? 'Please scan the barcode below with a scanner' : 'Please choose a book to borrow or return from other pages'}}</p>
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
    this.getUserMsg()
    // 监听扫码事件
    if (this.scanMsg) {
      new ScanCode(this.handleScan)
    }
  },
  methods: {
    getScanMsg() {
      this.scanMsg = localStorage.scanMsg ? JSON.parse(localStorage.scanMsg) : null
    },
    getUserMsg() {
      this.userMsg = localStorage.userMsg ? JSON.parse(localStorage.userMsg) : null
    },
    toBorrowed() {
      navTo('./scan_borrow.html', {menu: 'borrowed'})
    },
    handleScan(bookId) {
      this.bookId = bookId
      this.scanOK = true
    },
    handleSubmit() {
      if (this.scanMsg.mode === 0) {
        this.borrowBook()
      } else if (this.scanMsg.mode === 1) {
        this.returnBook()
      }
    },
    borrowBook() {
      let pms = SendJSON("GET", `${serverHost}:8002/bookservice/borrowbook/${this.bookId}/${this.userMsg.userId}`, null, token);
      pms.then((value) => {
        alert(value.message);
        localStorage.scanMsg = ''
        this.toBorrowed()
      }, (reason) => {
        localStorage.scanMsg = ''
        this.toBorrowed()
        alert(reason);
      });
    },
    returnBook() {
      let pms = SendJSON("GET", `${serverHost}:8002/bookservice/returnbook/${this.bookId}`, null, token);
      pms.then((value) => {
        alert(value.message);
        localStorage.scanMsg = ''
        this.toBorrowed()
      }, (reason) => {
        localStorage.scanMsg = ''
        this.toBorrowed()
        alert(reason);
      });
    }
  }
})