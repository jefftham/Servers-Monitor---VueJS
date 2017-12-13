<template>
  <div>
    <!-- form for sign up  -->
    <el-row :gutter="20">
      <el-col :span="12" :offset="6">
        <div class="divBox">

          <el-row :gutter="20">
            <el-col :span="12" :offset="6">
              <div>
                <h1>Create Account</h1>
              </div>
            </el-col>
          </el-row>
          <el-form :model="ruleForm2" status-icon :rules="rules2" ref="ruleForm2" label-width="120px" class="demo-ruleForm">
            <el-form-item label="Full Name" prop="fullName">
              <el-input v-model="ruleForm2.fullName"></el-input>
            </el-form-item>
            <el-form-item label="Email" prop="email">
              <el-input v-model="ruleForm2.email"></el-input>
            </el-form-item>
            <el-form-item label="Password" prop="pass">
              <el-input type="password" v-model="ruleForm2.pass" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="Confirm" prop="checkPass">
              <el-input type="password" v-model="ruleForm2.checkPass" auto-complete="off"></el-input>
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
    const checkName = (rule, value, callback) => {
      if (!value) {
        callback(new Error('Please input your full name'));
      }
      callback();
    };
    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('Please input the password'));
      } else if (this.ruleForm2.pass.length < 6) {
        callback(new Error('Password length can not be less than 6 characters'));
      } else {
        if (this.ruleForm2.checkPass !== '') {
          this.$refs.ruleForm2.validateField('checkPass');
        }
        callback();
      }
    };
    const validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('Please input the password again'));
      } else if (value !== this.ruleForm2.pass) {
        callback(new Error('Two inputs don\'t match!'));
      } else {
        callback();
      }
    };
    return {
      ruleForm2: {
        fullName: '',
        email: '',
        pass: '',
        checkPass: '',
      },
      rules2: {
        pass: [
          { required: true, validator: validatePass, trigger: 'blur' },
        ],
        checkPass: [
          { required: true, validator: validatePass2, trigger: 'blur' },
        ],
        fullName: [
          { required: true, validator: checkName, trigger: 'blur' },
        ],
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
          this.$store.dispatch('signup', this.ruleForm2);
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
