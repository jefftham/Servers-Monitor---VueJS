<template>
  <div>
    <el-menu default-active="1" class="el-menu-demo" mode="horizontal" :router="useRouter" @select="">
      <el-row>
        <el-col :span="6">
          <el-menu-item index="/">Main</el-menu-item>
          <el-menu-item index="/servers">Servers</el-menu-item>
        </el-col>
        <el-col :span="15" :push="3">
          <div v-if="!$store.state.idToken">
            <el-menu-item index="/signup">Create Account</el-menu-item>
            <el-menu-item index="/login">Login</el-menu-item>
          </div>
          <div v-else>
            <el-menu-item index="/admin">Admin</el-menu-item>
            <el-menu-item index="/login" @click="logout">Logout</el-menu-item>
          </div>
        </el-col>

      </el-row>
    </el-menu>
  </div>
</template>

<script>

export default {
  data() {
    return {
      useRouter: true,
    };
  },
  methods: {
    logout() {
      this.$store.dispatch('logout');
    },
  },
  created() {
    // console.log('Header.vue created');
    // when users visit, check if they have valid token and help them auto login
    this.$store.dispatch('tryAutoLogin');
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
