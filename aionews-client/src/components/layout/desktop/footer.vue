<template>
  <footer :id="FOOTER_ELEMENT_ID" class="footer">
    <div class="container">
      <div class="container__tab">
        <div class="footer__tabs">
          <div class="footer__tabs___title">
            <i18n :zh="'AIO.NEWS'" :en="'AIO.NEWS'" :vi="'AIO.NEWS'" />
          </div>
          <div class="footer__tabs___title2">
            <i18n :zh="'AIO.NEWS'" :en="'AIO.NEWS'" :vi="'AIO.NEWS'" />
          </div>
          <div class="footer__tabs___content">
            <i18n
              :zh="'ALL IN ONE 是关于技术、生活、知识、技巧、源代码、股票等有用新闻的聚集地……关注我们以获取最快的新闻更新。'"
              :en="'ALL IN ONE is a gathering place for useful news about technology, life, knowledge, tips, source code, stock,... Follow us for the fastest news updates.'"
              :vi="'ALL IN ONE là nơi tập hợp các tin tức hữu ích về công nghệ, đời sống, kiến thức, thủ thuật, mã nguồn, chứng khoán,... Hãy theo dõi chúng tôi để có thể cập nhật tin tức nhanh nhất.'"
            />
          </div>
        </div>
        <div class="socials">
          <span class="normal">
            <ulink class="item github" :href="VALUABLE_LINKS.GITHUB">
              <i class="iconfont icon-github" />
              <span class="text">GitHub</span>
            </ulink>
            <ulink class="item twitter" :href="VALUABLE_LINKS.TWITTER">
              <i class="iconfont icon-twitter" />
              <span class="text">Twitter</span>
            </ulink>
            <ulink class="item instagram" :href="VALUABLE_LINKS.INSTAGRAM">
              <i class="iconfont icon-instagram" />
              <span class="text">Instagram</span>
            </ulink>
            <ulink class="item youtube" :href="VALUABLE_LINKS.YOUTUBE_CHANNEL">
              <i class="iconfont icon-youtube" />
              <span class="text">YouTube</span>
            </ulink>
          </span>
          <span class="mini">
            <ulink class="item telegram" :href="VALUABLE_LINKS.TELEGRAM">
              <i class="iconfont icon-telegram" />
            </ulink>
            <!-- <button class="item wechat" @click="handleOpenWechat">
              <i class="iconfont icon-wechat" />
              <popup v-model:visible="modalState.wechat" :scroll-close="false">
                <div class="qrcode-modal wechat">
                  <div class="background"></div>
                  <uimage class="image" cdn src="/images/qrcodes/wechat.jpg" />
                  <span class="text">👋 &nbsp; Friend me on WeChat</span>
                </div>
              </popup>
            </button> -->
            <ulink class="item linkedin" :href="VALUABLE_LINKS.LINKEDIN">
              <i class="iconfont icon-linkedin" />
            </ulink>
            <ulink class="item douban" :href="VALUABLE_LINKS.DOUBAN">
              <i class="iconfont icon-douban" />
            </ulink>
          </span>
        </div>
      </div>
      <div class="container__sub">
        <div class="footer__copyright">
          <i18n
            :zh="'Copyright © 2022 版权所有。'"
            :en="'Copyright © 2022 All Rights Reserved.'"
            :vi="'Bản quyền © 2022 Tất cả các quyền được bảo lưu.'"
          />
        </div>
      </div>
    </div>
  </footer>
</template>

<script lang="ts">
  import { defineComponent } from 'vue'
  import { useEnhancer } from '/@/app/enhancer'
  import { RouteName } from '/@/app/router'
  import { GAEventCategories } from '/@/constants/gtag'
  import { FOOTER_ELEMENT_ID } from '/@/constants/anchor'
  import { getPageRoute } from '/@/transforms/route'
  import { VALUABLE_LINKS } from '/@/config/app.config'

  export default defineComponent({
    name: 'DesktopFooter',
    setup() {
      const { globalState, gtag } = useEnhancer()
      const handleStatementModal = () => {
        globalState.toggleSwitcher('statement', true)
        gtag?.event('statement_modal', {
          event_category: GAEventCategories.Universal
        })
      }

      return {
        FOOTER_ELEMENT_ID,
        VALUABLE_LINKS,
        aboutPageUrl: getPageRoute(RouteName.About),
        handleStatementModal
      }
    }
  })
</script>

<style lang="scss" scoped>


  @import 'src/styles/variables.scss';
  @import 'src/styles/mixins.scss';

  .footer {
    display: flex;
    align-items: center;
    height: 250px;
    // @include common-bg-module();
    background: linear-gradient(0deg, #20a48e 35.39%, #81e447 94.42%);

    .container {
      color: $text-secondary;
      font-size: $font-size-h6;
      text-align: center;
      text-transform: uppercase;

      a {
        border-bottom: 1px solid transparent;
        &:hover {
          border-color: initial;
        }
      }

      .socials {
        $button-size: 3rem;
        display: flex;
        justify-content: center;
        height: $button-size;
        margin-bottom: $gap * 2;

        .normal {
          display: inline-flex;
          align-items: center;
          margin-right: $gap;

          .item {
            padding: 0 $gap;
            margin-right: $gap;
            height: 100%;
            display: inline-flex;
            align-items: center;
            border-radius: $sm-radius;
            color: $white;
            transition: all $transition-time-fast;

            .iconfont {
              font-size: $font-size-h4;
              margin-right: $sm-gap;
            }

            .text {
              font-weight: bold;
            }

            &.github {
              background-color: $github-primary;

              &:hover {
                background-color: $github-primary-hover;
              }
            }

            &.twitter {
              background-color: $twitter-primary;

              &:hover {
                background-color: $twitter-primary-hover;
              }
            }

            &.youtube {
              margin: 0;
              background-color: $youtube-primary;

              &:hover {
                background-color: mix($black, $youtube-primary, 8%);
              }
            }

            &.instagram {
              opacity: 0.8;
              background: $instagram-primary;
              background: $instagram-gradient;

              &:hover {
                opacity: 1;
              }
            }
          }
        }

        > .mini {
          display: flex;

          > .item {
            display: inline-block;
            width: $button-size;
            height: $button-size;
            line-height: $button-size;
            margin-right: $gap;
            text-align: center;
            border-radius: $sm-radius;
            color: $white;
            opacity: 0.8;
            transition: all $transition-time-fast;

            &:hover {
              opacity: 1;
            }

            .iconfont {
              font-size: $font-size-h4;
            }

            &.wechat {
              background-color: $wechat-primary;
            }

            &.telegram {
              background-color: $telegram-primary;
            }

            &.douban {
              background-color: $douban-primary;
            }

            &.stackoverflow {
              background-color: $stackoverflow-primary;
            }

            &.algorithm {
              background-color: $leetcode-primary;
            }

            &.quora {
              background-color: $quora-primary;
            }

            &.linkedin {
              background-color: $linkedin-primary;
            }
          }
        }
      }

      .footer__tabs {
        position: relative;
        width: 50%;
        display: inline-table;
        padding-bottom: 10px;
        &___title {
          // display: block;
          // position: relative;
          color: rgb(236, 235, 234);
          filter: drop-shadow(-1px -1px 0px #cacac5);
          font-size: $font-size-h1;
          font-weight: 800;
          vertical-align: middle;
        }
        &___title2 {
          // display: block;
          // position: relative;
          margin-top: -31px;
          color: rgb(220, 143, 143);
          filter: drop-shadow(-2px -2px 0px rgb(128, 126, 126));
          font-size: $font-size-h1;
          font-weight: 800;
          vertical-align: middle;
        }
        &___content {
          display: block;
          position: relative;
          text-transform: none;
          word-wrap: break-word;
          font-size: larger;
        }
      }

      .container__sub {
        border-top: 1px solid $module-bg-darker-1;
        padding-top: 10px;
      }
    }
  }
</style>
