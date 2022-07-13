<template>
  <div class="job-page">
    <page-banner :blur="false" image="/images/page-job/banner-2.jpg">
      <template #title>
        <webfont>
          <i18n zh="内推找我，绝对靠谱" en="We work together" />
        </webfont>
      </template>
      <template #description>
        <i18n zh="一手人脉，假一赔万" en="We fight for future together" />
      </template>
    </page-banner>
    <div class="container">
      <ul class="jobs">
        <li class="item" :class="job.id" :key="index" v-for="(job, index) in jobs">
          <div
            class="logo"
            :style="{
              backgroundImage: `url('${getTargetCDNURL(job.logo)}')`
            }"
          >
            <uimage cdn class="qrcode" :src="job.qrcode" v-if="job.qrcode" />
          </div>
          <div class="content">
            <ulink class="title" :href="job.url">
              {{ job.company }}
              <span class="location" v-if="job.location">（{{ job.location }}）</span>
            </ulink>
            <p class="description" v-if="job.description" v-html="job.description" />
            <button class="submit" @click="handleSubmit(job)" v-if="job.email">
              {{ job.email().replace('@', '#') }}
              <i class="iconfont icon-mail-plane"></i>
            </button>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent, computed } from 'vue'
  import { useEnhancer } from '/@/app/enhancer'
  import { useMetaStore } from '/@/stores/meta'
  import { GAEventCategories } from '/@/constants/gtag'
  import { Language, LanguageKey } from '/@/language'
  import { getTargetCDNURL } from '/@/transforms/url'
  import { firstUpperCase } from '/@/transforms/text'
  import { emailLink } from '/@/transforms/email'
  import { META } from '/@/config/app.config'
  import PageBanner from '/@/components/common/fullpage/banner.vue'

  export default defineComponent({
    name: 'JobPage',
    components: {
      PageBanner
    },
    setup() {
      const { i18n, meta, gtag, isZhLang } = useEnhancer()
      const adminEmail = computed(() => useMetaStore().appOptions.data?.site_email || '')

      meta(() => {
        const enTitle = firstUpperCase(i18n.t(LanguageKey.PAGE_JOB, Language.English)!)
        const titles = isZhLang.value ? [i18n.t(LanguageKey.PAGE_JOB), enTitle] : [enTitle]
        return { pageTitle: titles.join(' | '), description: `找 ${META.author} 内推` }
      })

      const jobs = [
        {
          id: 'ekoios',
          company: 'EKOIOS',
          logo: '/images/page-job/ekoios.jpg',
          url: 'https://careers.ekoios.vn/',
          location: 'Ha Noi, Viet Nam',
          description: 'The company makes money, the leader is nice, the colleagues are perfect, the business is reliable, and there is very little overtime',
          email: () => 'contact@ekoios.vn'
        },
        {
          id: 'bytedance',
          company: 'ByteDance',
          logo: '/images/page-job/bytedance.jpg',
          qrcode: '/images/page-job/bytedance-qrcode.png',
          url: 'https://job.toutiao.com/s/J9oWrQQ',
          location: 'Domestic',
          description: 'Delicious food, no money<br> Salary is not low, overtime is paid; listed immediately, the future can be expected',
          email: () => adminEmail.value
        },
        {
          id: 'sotatek',
          company: 'Sotatek',
          logo: '/images/page-job/sotatek.jpg',
          url: 'https://www.sotatek.com/careers/',
          description: 'More coupons <br> Technology OK',
          email: () => `contact@sotatek.com`
        },
        {
          id: 'ant',
          company: 'Ant Financial',
          location: 'Domestic',
          logo: '/images/page-job/ant.jpg',
          url: 'https://www.antgroup.com/about/join-us',
          description: 'Giant market value, big bulls live in groups',
          email: () => adminEmail.value
        },
        {
          id: 'github-veact',
          company: 'GitHub Veact Project',
          location: 'remote',
          logo: '/images/page-job/github.jpg',
          url: 'https://github.com/veactjs',
          description: 'Become the maintainer of the <code>veact</code> project',
          email: () => adminEmail.value
        },
        {
          id: 'todo',
          company: 'Pretending to be an ad',
          logo: '/images/page-job/github.jpg',
          description: 'If you have a good opportunity, please contact me~',
          email: () => adminEmail.value
        }
      ]

      const handleSubmit = (job: any) => {
        gtag?.event('job_send_mail', {
          event_category: GAEventCategories.Universal
        })

        const location = job.location ? `- ${job.location} ` : ''
        window.open(
          emailLink({
            email: job.email(),
            subject: `Hi! Ask for an insider!/ from ${META.title}`,
            body: `I would like to ask for the opportunity/position of "${job.company} ${location}", my resume is attached.\n\nfrom ${META.title}`
          })
        )
      }

      return {
        jobs,
        handleSubmit,
        getTargetCDNURL
      }
    }
  })
</script>

<style lang="scss" scoped>
  @import 'src/styles/variables.scss';
  @import 'src/styles/mixins.scss';

  .job-page {
    .jobs {
      padding: 0;
      margin: $gap * 2 0;
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      grid-gap: $gap * 2;

      .item {
        display: block;
        height: auto;
        @include radius-box($sm-radius);
        @include common-bg-module();

        .logo {
          width: 100%;
          height: 16rem;
          display: flex;
          justify-content: center;
          align-items: center;
          overflow: hidden;
          background-color: $module-bg-darker-2;
          background-size: cover;
          background-position: center;

          .qrcode {
            height: 50%;
            background-color: $white;
            @include radius-box($sm-radius);
          }
        }

        .content {
          padding: $lg-gap;

          .title {
            margin: 0;
            font-weight: bold;
            font-size: $font-size-h4;
            border-bottom: 1px solid transparent;
            &:hover {
              text-decoration: none;
              border-color: initial;
            }

            .location {
              font-weight: normal;
            }
          }

          .description {
            margin-top: $gap;
            margin-bottom: 0;
            line-height: 2;
          }

          .submit {
            $height: 2.4em;
            display: block;
            width: 100%;
            margin-top: $lg-gap;
            line-height: $height;
            border: 1px solid;
            border-color: $primary;
            color: $primary;
            font-size: $font-size-small;
            text-align: center;
            letter-spacing: 1px;
            transition: color $transition-time-fast, background-color $transition-time-fast;
            @include radius-box($xs-radius);

            &:hover {
              color: $text-reversal;
              background-color: $primary;
            }
          }
        }
      }
    }
  }
</style>
