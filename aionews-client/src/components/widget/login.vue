<template>
  <div class="login-page">
    <page-banner :blur="false" :position="70" image="/images/page-merch/banner.jpg">
      <template #title>
        <webfont>
          <i18n zh="Login" en="Login Page" vi="Đăng Nhập"/>
        </webfont>
      </template>
      <template #description>
        <form class="login" @submit.prevent="signin()">
          <div class="login-group">
            <label class="login-group__title login-group__email" for="email">Email</label>
            <input
              v-model="user.email"
              type="text"
              class="login-group__form"
              id="email"
              aria-describedby="emailHelp"
              required
            />
          </div>
          <div class="login-group">
            <label class="login-group__title" for="password">Password</label>
            <input
              v-model="user.password"
              type="password"
              class="login-group__form"
              id="password"
              aria-describedby="passwordHelp"
              required
            />
          </div>
          <button type="submit" class="login-bottom">Signin</button>
        </form>
        <h3 class="title">If you don't have an account, please <a href="/register">Register</a></h3>
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
        return { pageTitle: titles.join(' | '), description: `${META.author}` }
      })

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
            this.loggingIn = false
            this.errorMessage = error.message
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
      
      &-group {
        &__title {
          font-size: 1.6rem;
          font-weight: bold;
          padding: 0.5rem 0;
        }
        &__email {
      }
      }
      
    }

    .end {
    }
    .title {
      color: red;
    }
  }
</style>
