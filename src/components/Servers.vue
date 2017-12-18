<template>
  <div class="divBox">
    <el-row :gutter="10">
      <el-col :span="22" :offset="1">
        <el-table ref="singleTable" stripe :data="servers" :default-sort="{prop: 'date', order: 'descending'}" highlight-current-row style="width: 100%">
          <el-table-column type="index" width="50">
          </el-table-column>
          <el-table-column property="url" sortable label="URL">
          </el-table-column>

          <el-table-column property="checkEvery" label="Check every (minutes)" sortable width="120">
          </el-table-column>
          <el-table-column property="note" label="Note" sortable width="120">
          </el-table-column>

          <el-table-column prop="status" label="Status" width="100" :filters="[{ text: 'Online', value: 'Online' }, { text: 'Offline', value: 'Offline' }]" :filter-method="filterTag" filter-placement="bottom-end">
            <template slot-scope="scope">
              <el-tag :type="scope.row.status === 200 ? 'success' : 'danger'" close-transition>{{scope.row.status}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="Operations" width="180">
            <template slot-scope="scope">
              <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">Edit</el-button>
              <el-button @click.native.prevent="deleteRow(scope.$index, servers)" size="mini" type="danger">
                Remove
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <div style="margin-top: 20px">
          <el-button @click="openAddServerDialog()">Add Server</el-button>
          <el-button @click="debug()">debug</el-button>

        </div>
      </el-col>
    </el-row>

    <!-- addServer dialog -->
    <el-dialog title="Add server for long polling" :visible.sync="dialogFormVisible" @close="dialogClose()">

      <el-form :model="ruleForm2" status-icon :rules="rules2" ref="ruleForm2" label-width="120px" class="demo-ruleForm">

        <el-form-item label="URL (with http://): " prop="url" :label-width="formLabelWidth">
          <el-input v-model="ruleForm2.url" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="Check Every (minutes): " prop="checkEvery" :label-width="formLabelWidth">
          <el-input v-model.number="ruleForm2.checkEvery" auto-complete="off"></el-input>
        </el-form-item>

        <el-form-item label="Note: " prop="note" :label-width="formLabelWidth">
          <el-input v-model="ruleForm2.note" auto-complete="off"></el-input>
        </el-form-item>

      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm('ruleForm2')">Confirm</el-button>
        <el-button @click="resetForm('ruleForm2')">Cancel</el-button>

      </span>
    </el-dialog>

  </div>

</template>

<script>
import * as isUrl from 'is-url';

export default {
  data() {
    const checkURL = (rule, value, callback) => {
      if (!value || !isUrl(value)) {
        callback(new Error('Please input the URL with http:// or https://.'));
      }
      callback();
    };

    return {
      interval: null,
      servers: [],
      isEdit: false,
      clickedConfirmButton: false,
      indexForEdit: null,
      rowBeforeEdit: {},
      currentRow: null,
      dialogFormVisible: false,
      ruleForm2: {
        url: '',
        checkEvery: 1,
        note: '',
      },
      formLabelWidth: '200px',
      rules2: {
        url: [{ required: true, validator: checkURL, trigger: 'blur' }],
        checkEvery: [
          {
            required: true,
            message: 'Please indicate how frequent to check the URL.',
          },
          { type: 'number', message: 'This field must be a number.' },
        ],
      },
    };
  },
  computed: {

  },
  watch: {

  },
  methods: {
    openAddServerDialog() {
      this.isEdit = false;
      this.resetFormValues();
      this.dialogFormVisible = !this.dialogFormVisible;
    },
    resetFormValues() {
      this.clickedConfirmButton = false;
      this.indexForEdit = null;
      this.rowBeforeEdit = {};
      this.ruleForm2 = {
        url: '',
        checkEvery: 1,
        note: '',
      };
    },
    filterTag(value, row) {
      if (value === 'Online') {
        return row.status === 200;
      }
      return row.status !== 200;
    },
    handleEdit(index, row) {
      // console.log(index, row);
      this.isEdit = true;
      this.resetFormValues();
      this.rowBeforeEdit = JSON.parse(JSON.stringify(row));
      this.indexForEdit = index;
      this.ruleForm2 = row;
      this.dialogFormVisible = !this.dialogFormVisible;
    },
    deleteRow(index, rows) {
      rows.splice(index, 1);
      this.$message({
        message: 'Server deleted!',
        type: 'success',
      });
      this.$store.commit('saveUserServers', this.servers);
      this.$store.dispatch('storeUserToFB');
    },

    submitForm(formName) {
      this.dialogFormVisible = false;
      this.clickedConfirmButton = true;

      this.$refs[formName].validate((valid) => {
        if (valid) {
          // add server

          // lastUpdate = "now" - "checkEvery minute"
          this.ruleForm2.lastUpdate = Date.now() - (this.ruleForm2.checkEvery * 1000 * 60);
          if (!this.isEdit) {
            this.servers.push(this.ruleForm2);
            this.$message({
              message: 'Server added!',
              type: 'success',
            });
            this.$store.commit('saveUserServers', this.servers);
            this.$store.dispatch('storeUserToFB');
          } else {
            // if isEdit === true, two-way binding
            this.clickedConfirmButton = true;
            this.$message({
              message: 'Server edited!',
              type: 'success',
            });
            this.$store.commit('saveUserServers', this.servers);
            this.$store.dispatch('storeUserToFB');
          }
        } else {
          // console.log('Server info is not valid!!');
          this.resetForm('ruleForm2');
          this.$message.error('Server info is not valid!');
        }
      });
    },
    resetForm(formName) {
      this.dialogFormVisible = false;
      this.servers[this.indexForEdit] = this.rowBeforeEdit;
      this.$refs[formName].resetFields();
    },
    dialogClose() {
      // console.log('dialogClosed');
      if (!this.clickedConfirmButton) {
        // reset the original value

        this.servers[this.indexForEdit] = this.rowBeforeEdit;
        this.servers = JSON.parse(JSON.stringify(this.servers));
        this.$message.error('Server info is not saved!');
        // this.$nextTick();
      }
    },
    debug() {
      this.$log.error(this.servers);
    },
  },
  created() {
    // a interval to check every server and perform long polling

    const customInterval = () => {
      // console.log('interval run ', new Date());
      // console.log('length of servers = ', this.servers ? this.servers.length : 0);
      if (this.servers.length) {
        this.servers.forEach((server, i) => {
          const refreshInMilliseconds = server.checkEvery * 60 * 100;
          if (server.lastUpdate + refreshInMilliseconds <= Date.now()) {
            // console.log(`long polling ${server.url}`);
            this.$store.dispatch('longPolling', server.url)
              .then((status) => {
                // console.log(`${server.url} = `, status);
                this.servers[i].status = status;
                this.servers = JSON.parse(JSON.stringify(this.servers));
              })
              .catch((status) => {
                // console.log(`${server.url} = `, status);
                this.servers[i].status = status;
                this.servers = JSON.parse(JSON.stringify(this.servers));
              });
          }
        });
      }

      this.interval = setTimeout(customInterval, 1000 * 60);
    };

    this.interval = setTimeout(() => {
      /* eslint-disable */
      this.servers = this.$store.state.user ?
        (this.$store.state.user.servers ? this.$store.state.user.servers : []) : [],
        customInterval();
    }, 1 * 1000);
  },
  beforeDestroy() {
    clearTimeout(this.interval);
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.divBox {
  margin: 50px;
}
</style>
