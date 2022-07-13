<template>
  <header :id="HEADER_ELEMENT_ID" class="header" :class="{ 'enable-nav': isEnabledNav }">
    <div class="header-container container">
      <div class="header-header">
        <uimage cdn src="/aio-noboder.png" class="header-logo" />
        <span class="header-slogan">
          <i18n :k="LanguageKey.APP_SLOGAN" />
        </span>
        <router-link
          to="/"
          class="header-link"
          :title="t(LanguageKey.APP_SLOGAN)"
          @mousedown="handleRootNavEvent"
        />
      </div>
      <div class="toolbox">
        <button class="username"  v-if="userInfo">
          <uimage :src="userInfo.avatar" class="user_avatar" /> {{ userInfo.userName }}
          <div class="dropdown_user">
            <router-link to="/profile">Profile</router-link>
            <a @click="handleUserLogout">Logout</a>
          </div>
        </button>
        <router-link class="button-auth auth__login" to="/login" v-if="!userInfo">Login</router-link>
        <router-link class="button-auth auth__register" to="/register" v-if="!userInfo">Register</router-link>
        <button
          class="button language"
          title="Switch language"
          :class="language"
          @click="tooggleLanguage"
        >
          {{ language || '-' }}
        </button>
        <a class="button theme" :class="theme" @click="toggleTheme">
          <i class="iconfont" :class="themeIcon"></i>
        </a>
      </div>
    </div>
    <div class="header-nav">
      <nav class="nav-list container">
        <template v-for="(menu, index) in menus" :key="menu.id">
          <span class="divider" v-if="index > 0"></span>
          <router-link
            v-if="menu.route"
            class="item"
            :class="[menu.id, { hot: menu.hot }]"
            :to="menu.route"
            exact
          >
            <uimage v-if="menu.imageIcon" class="image-icon" :src="menu.imageIcon" />
            <i v-else class="iconfont" :class="menu.icon"></i>
            <span class="text">
              <i18n :k="menu.i18nKey" />
            </span>
            <span v-if="menu.hot" class="superscript">
              <i class="iconfont icon-hot-fill"></i>
            </span>
          </router-link>
          <ulink
            v-else-if="menu.url"
            class="item"
            :class="[menu.id, { hot: menu.hot }]"
            :href="menu.url"
          >
            <i class="iconfont" :class="menu.icon"></i>
            <span class="text">
              <i18n :k="menu.i18nKey" />
            </span>
            <span class="newscript" v-if="menu.newWindow">
              <i class="iconfont icon-new-window-s"></i>
            </span>
            <span class="superscript" v-if="menu.hot">
              <i class="iconfont icon-hot-fill"></i>
            </span>
          </ulink>
        </template>
      </nav>
    </div>
  </header>
</template>

<script lang="ts">
  import { defineComponent, computed } from 'vue'
  import { useEnhancer } from '/@/app/enhancer'
  import { LanguageKey } from '/@/language'
  import { Theme } from '/@/composables/theme'
  import { HEADER_ELEMENT_ID } from '/@/constants/anchor'
  import { GAEventCategories } from '/@/constants/gtag'
  import { menus } from './menu'
  import { useMetaStore } from '/@/stores/meta'
  import { useUniversalFetch } from '/@/universal'

  export default defineComponent({
    name: 'DesktopHeader',
    setup() {
      const metaStore = useMetaStore()
      const { i18n, gtag, theme, globalState } = useEnhancer()
      const userInfo = computed(() => metaStore.userInfo.data)

      // Bố cục độc đáo cho phép menu
      const isEnabledNav = computed(() => !globalState.layoutColumn.value.isNormal)

      const themeValue = theme.theme
      const themeIcon = computed(() => {
        const themeIconMap = {
          [Theme.Light]: 'icon-sun',
          [Theme.Dark]: 'icon-moon'
        }
        return themeIconMap[themeValue.value]
      })

      const handleGTagEvent = (event: string) => {
        gtag?.event(event, {
          event_category: GAEventCategories.Widget
        })
      }

      const toggleTheme = () => {
        theme.toggle()
        gtag?.event('switch_theme', {
          event_category: GAEventCategories.Widget,
          event_label: theme.theme.value
        })
      }

      const tooggleLanguage = () => {
        i18n.toggle()
        gtag?.event('switch_language', {
          event_category: GAEventCategories.Widget,
          event_label: i18n.l.value?.name
        })
      }
      const handleLogin = () => {
        globalState.toggleSwitcher('login', true)
        handleGTagEvent('login_modal')
      }

      const handleRootNavEvent = () => {
        gtag?.event('root_header_home_nav', {
          event_category: GAEventCategories.Universal
        })
      }

      const handleUser = async () => {
        const userToken = await localStorage.getItem('access_token')
        if (userToken) {
          useUniversalFetch(() => Promise.all([metaStore.fetchUserInfo()]))
        }
      }
      const handleUserLogout = async () => {
        await localStorage.removeItem('access_token')
        window.location.href = '/login'
      }
      

      return {
        menus,
        HEADER_ELEMENT_ID,
        LanguageKey,
        isEnabledNav,
        handleRootNavEvent,
        t: i18n.t,
        language: i18n.language,
        tooggleLanguage,
        theme: themeValue,
        themeIcon,
        toggleTheme,
        handleLogin,
        userInfo,
        handleUserLogout,
        handleUser
      }
    }
  })
</script>

<style lang="scss" scoped>
  @import 'src/styles/variables.scss';
  @import 'src/styles/mixins.scss';

  .header {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 50px;
    z-index: $z-index-header;
    background-color: $module-bg;
    border-bottom: 1px solid $module-bg-darker-2;
    @include backdrop-blur(5px);

    &.enable-nav:hover {
      .header-nav {
        @include visible();
      }
    }
    .username {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      background: linear-gradient(255.39deg, #e59b80 3.84%, #ed0707 96.2%);
      font-size: 16px;
      color: white;
      position: relative;
      border-radius: 90px;
      padding: 0 10px 1px 0;
      &:hover {
        .dropdown_user {
          display: block;
          width: 100%;
        }
      }
      .user_avatar {
        width: 30px;
        height: 30px;
        border-radius: 50%;
        margin-right: 5px;
      }
      .dropdown_user {
        display: none;
        position: absolute;
        background: linear-gradient(255.39deg, #e59b80 3.84%, #ed0707 96.2%);
        min-width: 160px;
        z-index: 1000;
        padding: 0;
        top: 0px;
        left:130px;
        box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
        border-radius: 5px 5px 5px 5px;
        a {
          color: white;
          display: block;
          padding: 5px;
          padding-bottom: 7px;
          z-index: 999999999;
          &:hover {
            border-radius: 10px;
            background: linear-gradient(255.39deg, #5020ff 3.84%, #ed0707 96.2%);
          }
        }
      }
    }

    .button-auth {
      color: white;
      display: inline-block;
      padding: 5px 24px;
      padding-bottom: 8px;
      font-size: 16px;
      background: linear-gradient(255.39deg, #188b77 53.84%, #77e436 96.2%);
      border-radius: 90px;
    }
    .auth__login:hover {
      background: linear-gradient(255.39deg, #001be6 53.84%, #8f9cff 96.2%);
    }
    .auth__register:hover {
      background: linear-gradient(255.39deg, #001be6 53.84%, #8f9cff 96.2%);
    }
    .header-container {
      height: 100%;
      display: flex;
      justify-content: space-between;

      .header-header {
        height: 100%;
        display: flex;
        position: relative;
        align-items: center;
        padding-left: $sm-gap;
        width: 29em;
        overflow: hidden;

        @keyframes logo-blink {
          0% {
            mask-position: -30%;
          }
          100% {
            mask-position: 666%;
          }
        }

        .header-logo {
          width: 7rem;
          margin-right: $gap * 4;
          .logo-st {
            fill: $primary;
          }
        }

        .header-slogan {
          left: 50%;
          color: $primary;
          font-size: $font-size-h5;
          font-family: 'webfont-medium', DINRegular;
        }

        .header-link {
          position: absolute;
          width: 100%;
          height: 100%;
        }
      }

      .toolbox {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;

        @include visibility-transition();
        &:hover {
          opacity: 0.8;
        }

        .button {
          position: relative;
          display: block;
          text-transform: uppercase;
          margin: 0 $gap;
          width: 2rem;
          height: 2rem;

          &::before {
            content: '';
            display: block;
            width: 50%;
            height: 2px;
            position: absolute;
            left: 25%;
            bottom: -2px;
          }

          &.menu {
            cursor: none;
            &::before {
              background-color: $black;
            }
          }

          &.theme {
            &::before {
              background-color: $primary;
            }
          }

          &.language {
            font-weight: bold;

            &.en {
              &::before {
                background-color: $en-primary;
              }
            }

             &.vi {
              &::before {
                background-color: $en-primary;
              }
            } 
            &.zh {
              &::before {
                background-color: $zh-primary;
              }
            }
          }
        }
      }
    }

    .header-nav {
      width: 100%;
      height: 4rem;
      background:linear-gradient(-180deg, #20a48e 35.39%, #81e447 94.42%) ;
      // @include hidden();
      @include visibility-transition();

      .nav-list {
        height: 100%;
        display: flex;
        justify-content: space-evenly;
        align-items: center;

        .divider {
          height: 6px;
          width: 1px;
          background-color: $module-bg-translucent;
        }

        .item {
          text-transform: uppercase;
          color: $text-reversal;
          @include visibility-transition();
          opacity: 0.7;
          &:hover {
            opacity: 1;
          }

          &.link-active {
            .text {
              padding-bottom: 4px;
              border-bottom: 2px solid;
            }
          }

          .image-icon {
            width: 1em;
            height: 1em;
            margin-right: $sm-gap;
            border-radius: $xs-radius;
          }

          > .iconfont {
            margin-right: $sm-gap;
          }

          .newscript,
          .superscript {
            margin-left: $xs-gap;
          }
        }
      }
    }
  }
</style>
