<template>
  <div class="register-page">
    <page-banner :blur="false" image="/images/page-merch/banner.jpg">
      <template #title>
        <webfont>
          <i18n zh="注册" en="Register Page" vi="Đăng Ký" />
        </webfont>
      </template>
      <template #description>
        <i18n>
          <template #zh>
            <form class="register" @submit.prevent="register()">
              <div class="register-group">
                <label class="register-group__title" for="email">电子邮件</label>
                <input v-model="user.email" type="text" class="register-group__form" id="email"
                  aria-describedby="emailHelp" required />
              </div>

              <div class="register-group">
                <label class="register-group__title" for="password">密码</label>
                <input v-model="user.password" type="password" class="register-group__form" id="password"
                  aria-describedby="passwordHelp" required />
              </div>
              <div class="register-group">
                <label class="register-group__title" for="confirm-password">确认密码</label>
                <input v-model="user.confirmPassword" type="password" class="register-group__form" id="confirm-password"
                  aria-describedby="passwordHelp" required />
              </div>
              <button type="submit" class="register-bottom">登记</button>
            </form>
            <h4 class="success" v-if="successMessage">注册成功</h4>
            <h4 v-if="errorMessage">{{ errorMessage }}</h4>

            <h4 v-if="checkPassword == false">请输入正确的密码</h4>
            <h3 class="title">
              如果您有帐户，请 <router-link :to="RouteName.Login">登录</router-link>
            </h3>
          </template>
          <template #en>
            <form class="register" @submit.prevent="register()">
              <div class="register-group">
                <label class="register-group__title" for="email">Email</label>
                <input v-model="user.email" type="text" class="register-group__form" id="email"
                  aria-describedby="emailHelp" required />
              </div>

              <div class="register-group">
                <label class="register-group__title" for="password">Password</label>
                <input v-model="user.password" type="password" class="register-group__form" id="password"
                  aria-describedby="passwordHelp" required />
              </div>
              <div class="register-group">
                <label class="register-group__title" for="confirm-password">Confirm Password</label>
                <input v-model="user.confirmPassword" type="password" class="register-group__form" id="confirm-password"
                  aria-describedby="passwordHelp" required />
              </div>
              <button type="submit" class="register-bottom">Register</button>
            </form>
            <h4 class="success" v-if="successMessage">Register Successful</h4>
            <h4 v-if="errorMessage">{{ errorMessage }}</h4>

            <h4 v-if="checkPassword == false">Please enter the correct password</h4>
            <h3 class="title">
              If you have an account, please <router-link :to="RouteName.Login">Login</router-link>
            </h3>
          </template>
          <template #vi>
            <form class="register" @submit.prevent="register()">
              <div class="register-group">
                <label class="register-group__title" for="email">Email</label>
                <input v-model="user.email" type="text" class="register-group__form" id="email"
                  aria-describedby="emailHelp" required />
              </div>

              <div class="register-group">
                <label class="register-group__title" for="password">Mật khẩu</label>
                <input v-model="user.password" type="password" class="register-group__form" id="password"
                  aria-describedby="passwordHelp" required />
              </div>
              <div class="register-group">
                <label class="register-group__title" for="confirm-password">Xác nhận mật khẩu</label>
                <input v-model="user.confirmPassword" type="password" class="register-group__form" id="confirm-password"
                  aria-describedby="passwordHelp" required />
              </div>
              <button type="submit" class="register-bottom">Đăng ký</button>
            </form>
            <h4 class="success" v-if="successMessage">Đăng ký thành công</h4>
            <h4 v-if="errorMessage">{{ errorMessage }}</h4>

            <h4 v-if="checkPassword == false">Vui lòng nhập mật khẩu</h4>
            <h3 class="title">
              Nếu bạn đã có tài khoản, vui lòng <router-link :to="RouteName.Login">Đăng nhập</router-link>
            </h3>
          </template>
        </i18n>

      </template>
    </page-banner>
  </div>
</template>

<script lang="ts">
  import { defineComponent, computed } from 'vue'
  import { Language, LanguageKey } from '/@/language'
  import { META } from '/@/config/app.config'
  import { useEnhancer } from '/@/app/enhancer'
  import { firstUpperCase } from '/@/transforms/text'
  import PageBanner from '/@/components/common/fullpage/banner.vue'
  import PageTitle from '/@/components/common/fullpage/title.vue'
  import nodepress from '/@/services/nodepress'
  import { RouteName } from '/@/app/router'

  export default defineComponent({
    name: 'RegisterPage',
    components: {
      PageBanner,
      PageTitle
    },
    setup() {
      const { i18n, meta, isZhLang, adConfig } = useEnhancer()
      const brokers = computed(() => adConfig.value.PC_MERCH_BROKERS)

      meta(() => {
        const enTitle = firstUpperCase(i18n.t(LanguageKey.PAGE_MERCH, Language.English)!)
        const titles = isZhLang.value ? [i18n.t(LanguageKey.PAGE_MERCH), enTitle] : [enTitle]
        return { pageTitle: titles.join(' | '), description: `${META.author} 的周边好物` }
      })
      if (localStorage.getItem('access_token')) {
        window.location.href = '/profile'
      }
      return {
        RouteName,
        brokers
      }
    },
    data() {
      return {
        user: {
          email: '',
          password: '',
          confirmPassword: ''
        },
        errorMessage: '',
        successMessage: '',
        checkPassword: true,
        loggingIn: false
      }
    },
    methods: {
      register() {
        this.errorMessage = ''
        this.successMessage = ''
        this.loggingIn = true
        const body = {
          email: this.user.email,
          password: this.user.password
        }
        if (this.user.password == this.user.confirmPassword) {
          nodepress
            .post('/user', body)
            .then((result) => {
              setTimeout(() => {
                this.successMessage = result.status
              }, 2000)
              this.$router.push('/register')
            })
            .catch((error) => {
              setTimeout(() => {
                this.loggingIn = false
                this.errorMessage = error.message
              }, 2000)
            })
        } else {
          setTimeout(() => {
            this.checkPassword = false
          }, 1000)
        }
      }
    }
  })
</script>

<style lang="scss" scoped>

  @import 'src/styles/variables.scss';
  @import 'src/styles/mixins.scss';

  .register-page {
    width: 100%;
    height: auto;
    .title {
      background: linear-gradient(to right, transparent, $module-bg-opaque, transparent);
    }

    .success {
      color: green;
    }

    .register {
      margin: 0;
      padding: 0;
      display: flex;
      grid-gap: $gap * 2;
      align-items: center;
      &-group {
        &__title {
          text-align: start;
          font-size: 20px;
          left: 0;
          padding-right: 10px;
        }
      }
    }

    .end {
      height: $gap * 2;
    }
    .title {
      color: red;
      text-align: start;
    }
  }
</style>
