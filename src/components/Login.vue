<template>
  <div>
    <!-- form for sign up  -->
    <el-row :gutter="20">
      <el-col :span="12" :offset="6">
        <div class="divBox">

          <el-row :gutter="20">
            <el-col :span="12" :offset="6">
              <div>
                <h1>Login</h1>
              </div>
            </el-col>
          </el-row>
          <el-form :model="ruleForm2" status-icon :rules="rules2" ref="ruleForm2" label-width="120px" class="demo-ruleForm">

            <el-form-item label="Email" prop="email">
              <el-input v-model="ruleForm2.email"></el-input>
            </el-form-item>
            <el-form-item label="Password" prop="pass">
              <el-input type="password" v-model="ruleForm2.pass" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitForm('ruleForm2')">Submit</el-button>
              <el-button @click="resetForm('ruleForm2')">Reset</el-button>
            </el-form-item>
            <el-col :span="12" :offset="6">
              <div>
                <!-- <router-link to="/login" style="cursor: pointer">login</router-link> -->
              </div>
            </el-col>

          </el-form>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  data() {
    return {
      ruleForm2: {
        email: '',
        pass: '',
      },
      rules2: {
        email: [
          { required: true, message: 'Please input email address', trigger: 'blur' },
          { type: 'email', message: 'Please input correct email address', trigger: 'blur' },
        ],
      },
    };
  },
  computed: {

  },
  methods: {

    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        let ret;
        if (valid) {
          this.$log.info('submit!');
          this.$store.dispatch('login', this.ruleForm2);
          ret = true;
        } else {
          this.$log.info('error submit!!');
          ret = false;
        }
        return ret;
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
  },
};
</script>

<<style scoped>
.divBox{
  margin: 50px;
  padding: 20px;
  border: 0.1px solid black;
}
</style>
