<template>
  <div class="divBox">
    <el-row :gutter="10">
      <el-col :span="22" :offset="1">
        <el-table ref="singleTable" stripe :data="tableData" :default-sort="{prop: 'date', order: 'descending'}" highlight-current-row style="width: 100%">
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
              <el-tag :type="scope.row.status === 'Online' ? 'success' : 'danger'" close-transition>{{scope.row.status}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="Operations" width="180">
            <template slot-scope="scope">
              <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">Edit</el-button>
              <el-button @click.native.prevent="deleteRow(scope.$index, tableData)" size="mini" type="danger">
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
      tableData: [
        {
          timestamp: 1513198887261,
          checkEvery: 1,
          note: '',
          url: 'http://www.google.com',
          status: 'Online',
        },
        {
          timestamp: 1513198887262,
          checkEvery: 1,
          note: '',
          url: 'http://www.google.com',
          status: 'Offline',
        },
        {
          timestamp: 1513198887263,
          checkEvery: 1,
          note: '',
          url: 'http://www.google.com',
          status: 'Online',
        },
        {
          timestamp: 1513198887264,
          checkEvery: 1,
          note: '',
          url: 'http://www.google.com',
          status: 'Offline',
        },
      ],
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
    tableData() {
      console.log('detected tableData changed...!');
    },
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
      return row.tag === value;
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
    },

    submitForm(formName) {
      this.dialogFormVisible = false;
      this.clickedConfirmButton = true;

      this.$refs[formName].validate((valid) => {
        if (valid) {
          // add server
          this.ruleForm2.timestamp = Date.now();
          if (!this.isEdit) {
            this.tableData.push(this.ruleForm2);
            this.$message({
              message: 'Server added!',
              type: 'success',
            });
          } else {
            // if isEdit === true, do nothing
            this.clickedConfirmButton = true;
            this.$message({
              message: 'Server edited!',
              type: 'success',
            });
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
      this.tableData[this.indexForEdit] = this.rowBeforeEdit;
      this.$refs[formName].resetFields();
    },
    dialogClose() {
      console.log('dialogClosed');
      if (!this.clickedConfirmButton) {
        this.tableData[this.indexForEdit] = this.rowBeforeEdit;
        this.$message.error('Server info is not saved!');
        this.$forceUpdate();
      }
    },
    debug() {
      this.$log.error(this.tableData);
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.divBox {
  margin: 50px;
}
</style>
