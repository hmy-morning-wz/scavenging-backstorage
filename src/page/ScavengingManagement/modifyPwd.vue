<template>
  <div>
    <head-top></head-top>
    <div style="margin-top:30px;"></div>
    <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
      <el-form-item label="原密码" prop="password">
        <el-input class="w200" type="password" v-model="ruleForm.password" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="newpassword1">
        <el-input class="w200" type="password" v-model="ruleForm.newpassword1" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="newpassword2">
        <el-input class="w200" type="password" v-model="ruleForm.newpassword2" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import headTop from '../../components/headTop'
import manageServer from '../../service/scavengingManagement/manage.js'
export default {
  data() {
    var checkOld = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('原密码不能为空'))
      }
      callback()
    }
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        if (this.ruleForm.newpassword2 !== '') {
          this.$refs.ruleForm.validateField('newpassword2')
        }
        callback()
      }
    }
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.ruleForm.newpassword1) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      ruleForm: {
        newpassword1: '',
        newpassword2: '',
        password: ''
      },
      rules: {
        newpassword1: [{ validator: validatePass, trigger: 'blur' }],
        newpassword2: [{ validator: validatePass2, trigger: 'blur' }],
        password: [{ validator: checkOld, trigger: 'blur' }]
      }
    }
  },
  components: {
    headTop
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          console.log(this.ruleForm)
          manageServer.modifyPwd(this.ruleForm).then(
            response => {
              this.$notify({
                title: '提示',
                message: response.msg
              })
            },
            response => {
              this.$message.error(response.msg || '修改失败')
            }
          )
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    }
  }
}
</script>
