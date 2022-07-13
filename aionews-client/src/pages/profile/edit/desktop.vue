<template>
  <div class="register-page">
    <page-banner :blur="false">
      <template #title>
        <webfont>
          <i18n zh="注册" en="Edit profile" vi="Sửa thông tin cá nhân" />
        </webfont>
      </template>
      <template #description>
        <container class="container">
          <i18n>
            <template #zh>
              <form class="register" @submit.prevent="editProfile()">
                <div class="register-group">
                  <label class="register-group__title" for="email">电子邮件</label>
                  <input
                    v-model="user.email"
                    type="text"
                    class="register-group__form"
                    id="email"
                    aria-describedby="emailHelp"
                    required
                  />
                </div>

                <div class="register-group">
                  <label class="register-group__title" for="password">密码</label>
                  <input
                    v-model="user.password"
                    type="password"
                    class="register-group__form"
                    id="password"
                    aria-describedby="passwordHelp"
                    required
                  />
                </div>
                <div class="register-group">
                  <label class="register-group__title" for="confirm-password">确认密码</label>
                  <input
                    v-model="user.confirmPassword"
                    type="password"
                    class="register-group__form"
                    id="confirm-password"
                    aria-describedby="passwordHelp"
                    required
                  />
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
              <form class="register" @submit.prevent="editProfile()">
                <span class="row_profile">
                  <div class="register-group">
                    <label class="register-group__title" for="email">Email</label>
                    <input
                      v-model="user.email"
                      type="text"
                      class="register-group__form"
                      id="email"
                      aria-describedby="emailHelp"
                      required
                    />
                  </div>
                  <div class="register-group">
                    <label class="register-group__title" for="userName">UserName</label>
                    <input
                      v-model="user.userName"
                      type="text"
                      class="register-group__form"
                      id="username"
                      aria-describedby="passwordHelp"
                      required
                    />
                  </div>
                </span>

                <span class="row_profile">
                  <div class="register-group">
                    <label class="register-group__title" for="github_url">Github</label>
                    <input
                      v-model="user.github_url"
                      type="text"
                      class="register-group__form"
                      id="github_url"
                      aria-describedby="emailHelp"
                      required
                    />
                  </div>
                  <div class="register-group">
                    <label class="register-group__title" for="twitter_url">Twitter</label>
                    <input
                      v-model="user.twitter_url"
                      type="text"
                      class="register-group__form"
                      id="twitter_url"
                      aria-describedby="passwordHelp"
                      required
                    />
                  </div>
                </span>
                <span class="row_profile">
                  <div class="register-group">
                    <label class="register-group__title" for="instagram_url">Instagram</label>
                    <input
                      v-model="user.instagram_url"
                      type="text"
                      class="register-group__form"
                      id="twitter_url"
                      aria-describedby="emailHelp"
                      required
                    />
                  </div>
                  <div class="register-group">
                    <label class="register-group__title" for="youtube_url">Youtube</label>
                    <input
                      v-model="user.youtube_url"
                      type="text"
                      class="register-group__form"
                      id="youtube_url"
                      aria-describedby="passwordHelp"
                      required
                    />
                  </div>
                </span>
                <span class="row_profile">
                  <div class="register-group">
                    <label class="register-group__title" for="linkedin_url">Linkedin</label>
                    <input
                      v-model="user.linkedin_url"
                      type="text"
                      class="register-group__form"
                      id="linkedin_url"
                      aria-describedby="emailHelp"
                      required
                    />
                  </div>
                  <div class="register-group">
                    <label class="register-group__title" for="telegram_url">Telegram</label>
                    <input
                      v-model="user.telegram_url"
                      type="text"
                      class="register-group__form"
                      id="telegram_url"
                      aria-describedby="passwordHelp"
                      required
                    />
                  </div>
                </span>
                <span class="row_profile">
                  <div class="register-group">
                    <label class="register-group__title" for="weibo_url">Weibo</label>
                    <input
                      v-model="user.weibo_url"
                      type="text"
                      class="register-group__form"
                      id="weibo_url"
                      aria-describedby="emailHelp"
                      required
                    />
                  </div>
                  <div class="register-group">
                    <label class="register-group__title" for="background_video"
                      >Background url</label
                    >
                    <input
                      v-model="user.background_video"
                      type="text"
                      class="register-group__form"
                      id="background_video"
                      aria-describedby="passwordHelp"
                      required
                    />
                  </div>
                </span>
                <!-- <div class="register-group">
                  <label class="register-group__title" for="password">Password</label>
                  <input
                    v-model="user.password"
                    type="password"
                    class="register-group__form"
                    id="password"
                    aria-describedby="passwordHelp"
                    required
                  />
                </div> -->
                <button type="submit" class="register-bottom">Submit</button>
              </form>
              <h4 class="success" v-if="successMessage">Register Successful</h4>
              <h4 v-if="errorMessage">{{ errorMessage }}</h4>
              <h4 v-if="checkPassword == false">Please enter the correct password</h4>
            </template>
            <template #vi>
              <form class="register" @submit.prevent="editProfile()">
                <div class="register-group">
                  <label class="register-group__title" for="email">Email</label>
                  <input
                    v-model="user.email"
                    type="text"
                    class="register-group__form"
                    id="email"
                    aria-describedby="emailHelp"
                    required
                  />
                </div>

                <div class="register-group">
                  <label class="register-group__title" for="password">Mật khẩu</label>
                  <input
                    v-model="user.password"
                    type="password"
                    class="register-group__form"
                    id="password"
                    aria-describedby="passwordHelp"
                    required
                  />
                </div>

                <div class="register-group">
                  <label class="register-group__title" for="confirm-password"
                    >Xác nhận mật khẩu</label
                  >
                  <input
                    v-model="user.confirmPassword"
                    type="password"
                    class="register-group__form"
                    id="confirm-password"
                    aria-describedby="passwordHelp"
                    required
                  />
                </div>
                <button type="submit" class="register-bottom">Đăng ký</button>
              </form>
              <h4 class="success" v-if="successMessage">Đăng ký thành công</h4>
              <h4 v-if="errorMessage">{{ errorMessage }}</h4>

              <h4 v-if="checkPassword == false">Vui lòng nhập mật khẩu</h4>
              <h3 class="title">
                Nếu bạn đã có tài khoản, vui lòng
                <router-link :to="RouteName.Login">Đăng nhập</router-link>
              </h3>
            </template>
          </i18n>
        </container>
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
  import PageBanner from '/@/components/common/fullpage/profile.vue'
  import nodepress from '/@/services/nodepress'
  import { RouteName } from '/@/app/router'
  import { useUniversalFetch } from '/@/universal'
  import { useMetaStore } from '/@/stores/meta'

  export default defineComponent({
    name: 'EditProfile',
    components: {
      PageBanner
    },
    setup() {
      const { i18n, meta, isZhLang, adConfig } = useEnhancer()
      const brokers = computed(() => adConfig.value.PC_MERCH_BROKERS)
      const metaStore = useMetaStore()
      const adminInfo = computed(() => metaStore.userInfo.data)
      console.log(adminInfo.value)
      meta(() => {
        const enTitle = firstUpperCase(i18n.t(LanguageKey.PAGE_MERCH, Language.English)!)
        const titles = isZhLang.value ? [i18n.t(LanguageKey.PAGE_MERCH), enTitle] : [enTitle]
        return { pageTitle: titles.join(' | '), description: `${META.author} good things around` }
      })
      useUniversalFetch(
        async () => await Promise.all([metaStore.fetchUserInfo(), metaStore.fetchAppOptions()])
      )
      return {
        RouteName,
        brokers,
        adminInfo
      }
    },
    data() {
      return {
        user: {
          email: this.email,
          userName: this.userName,
          github_url: this.github_url,
          linkedin_url: this.linkedin_url,
          twitter_url: this.twitter_url,
          facebook_url: this.facebook_url,
          instagram_url: this.instagram_url,
          youtube_url: this.youtube_url,
          telegram_url: this.telegram_url,
          weibo_url: this.weibo_url,
          background_video: this.background_video
        },
        errorMessage: '',
        successMessage: '',
        checkPassword: true,
        loggingIn: false
      }
    },
    methods: {
      editProfile() {
        this.errorMessage = ''
        this.successMessage = ''
        this.loggingIn = true
        const body = {
          email: this.user.email,
          userName: this.user.userName,
          github_url: this.user.github_url,
          linkedin_url: this.user.linkedin_url,
          twitter_url: this.user.twitter_url,
          facebook_url: this.user.facebook_url,
          instagram_url: this.user.instagram_url,
          youtube_url: this.user.youtube_url,
          telegram_url: this.user.telegram_url,
          weibo_url: this.user.weibo_url,
          background_video: this.user.background_video
        }

        nodepress
          .patch(`/user?id=${this.adminInfo?._id}`, body)
          .then((result) => {
            setTimeout(() => {
              this.successMessage = result.status
            }, 2000)
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
  .row_profile {
    display: flex;
  }
  .register_group {
    padding: 10px;
  }
  .container {
    width: 100%;
    height: 100%;
    display: flex-start;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .banner {
    background: none;
    padding: 0;
    left: 0;
    margin-top: 0;
    margin-bottom: 0;
  }
  .register-page {
    width: 100%;
    height: auto;
    color: black !important;
    .title {
      background: linear-gradient(to right, transparent, $module-bg-opaque, transparent);
    }

    .success {
      color: green;
    }

    .register {
      margin: 0;
      padding: 0;
      display: block;
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
