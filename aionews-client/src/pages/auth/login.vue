<template>
  <div class="login-page">
    <page-banner :blur="false" image="/images/page-merch/banner.jpg">
      <template #title>
        <webfont>
          <i18n zh="登录" en="Login Page" vi="Đăng Nhập" />
        </webfont>
      </template>
      <template #description>
        <form class="login" @submit.prevent="signin()">
          <div class="login-group">
            <label class="login-group__title" for="email">Email</label>
            <input v-model="user.email" type="text" class="login-group__form" id="email" aria-describedby="emailHelp"
              required />
          </div>
          <div class="login-group">
            <i18n>
              <template #zh>
                <label class="login-group__title" for="password">密码</label>
              </template>
              <template #en>
                <label class="login-group__title" for="password">Password</label>
              </template>
              <template #vi>
                <label class="login-group__title" for="password">Mật khẩu</label>
              </template>
            </i18n>
            <input v-model="user.password" type="password" class="login-group__form" id="password"
              aria-describedby="passwordHelp" required />
          </div>
          <i18n>
            <template #zh>
              <button type="submit" class="login-bottom">登入</button>
            </template>
            <template #en>
              <button type="submit" class="login-bottom">Signin</button>
            </template>
            <template #vi>
              <button type="submit" class="login-bottom">Đăng nhập</button>
            </template>
          </i18n>
        </form>
        <h4 v-if="errorMessage">{{ errorMessage }}</h4>
        <i18n>
          <template #zh>
            <h3 class="title">如果您没有帐户，请<router-link to="/register">注册</router-link>
            </h3>
          </template>
          <template #en>
            <h3 class="title">
              If you don't have an account, please
              <router-link to="/register">Register</router-link>
            </h3>
          </template>
          <template #vi>
            <h3 class="title">
              Nếu bạn chưa có tài khoản, vui lòng <router-link to="/register">Đăng ký</router-link>
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

  export default defineComponent({
    name: 'LoginPage',
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
        brokers
      }
    },
    data() {
      return {
        user: {
          email: '',
          password: ''
        },
        errorMessage: '',
        loggingIn: false
      }
    },
    methods: {
      signin() {
        this.errorMessage = ''

        this.loggingIn = true
        const body = {
          email: this.user.email,
          password: this.user.password
        }

        nodepress
          .post('/auth/user/login', body)
          .then((result) => {
            localStorage.access_token = result.result.access_token
            this.loggingIn = true
            this.$router.push('/profile')
          })
          .catch((error) => {
            setTimeout(() => {
              this.loggingIn = false
              this.errorMessage = error.message
            }, 2000)
          })
      }
    }
  })
</script>

<style lang="scss" scoped>
  @import 'src/styles/variables.scss';
  @import 'src/styles/mixins.scss';

  .login-page {
    width: 100%;
    height: auto;
    .title {
      background: linear-gradient(to right, transparent, $module-bg-opaque, transparent);
    }

    .login {
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
