# Changelog

All notable changes to this project will be documented in this file.

### v3.11.0 (2022-05-01)

**Chore**

- Upgrade deps

**Feature**

- Improve `lozad` directive and composable.
- Improve `webfont` component.
- Improve `ulink` component.
- Improve image loading and error fallback status.

### v3.8.2 (2022-03-18)

**Feature**

- Add Sponsor page
- Upgrade Sponsor component (modal)
- Remove CSS `source-url` and `cdn-url`

### v3.8.0 (2022-03-15)

**Feature**

- Upgrade `lru-cache` to [`v7.x`](https://github.com/isaacs/node-lru-cache/blob/main/CHANGELOG.md#v7---2022-02)
- Improve `highlight.js` themes
- Improve styles

**Chore**

- Upgrade deps
- Remove `@vue/x` deps

### v3.6.30 (2022-03-02)

**Feature**

- Add feedback widget

### v3.6.27 (2022-02-20)

**Feature**

- Add instagram & twitter calendar to About page calendar
- Improve i18n & language
- Improve transforms
- `Udate` component

**Fix**

- Eslint with `@typescript-eslint`

### v3.6.24 (2022-02-17)

**Feature**

- About page GitHub cahrt to article calendar
- Music page to popup

### v3.6.1 (2022-01-16)

**Feature**

- Improve cache & cacher (Redis first & LRU second)

### v3.6.0 (2022-01-15)

**Feature**

- Announcement to Twitter
- improve BFF cacher logic

### v3.5.0 (2022-01-11)

**Feature**

- Bilibili to YouTube

### v3.4.5 (2022-01-05)

**Feature**

- Improve Article detail page

### v3.4.0 (2022-01-03)

**Feature**

- Add BFF proxy server
- Add Plogs on Lens page

### v3.3.6 (2022-01-02)

**Feature**

- Improve copyrighter when focus comment publisher

**Fix**

- Fix comment reply preview

### v3.3.4 (2022-01-01)

**Feature**

- Improve comment components

### v3.3.0 (2021-12-31)

**Feature**

- Disqus comment
- Remove comment blocklist
- Improve global config

### v3.2.15 (2021-12-22)

**Fix**

- Fix SSR render BUG

**Feature**

- Improve global styles
- Improve article detail page layout
- Improve article page like-share
- Improve article page skeleton
- Improve `comment` component
- Improve `loading` component

### v3.2.14 (2021-12-21)

**Fix**

- BFF tunnel service responser
- GTag events

**Feature**

- Improve background style
- Improve gtag events
- Improve state types `Extend`
- Add article language text on desktop flow

### v3.2.11 (2021-12-20)

**Fix**

- filters style url

### v3.2.10 (2021-12-20)

**Feature**

- Improve BFF server cache logic
- Serverless support 🚧

### v3.2.9 (2021-12-18)

**Fix**

- SSR `store.prefetch` [pass `pinia` instance](https://pinia.esm.dev/ssr/#using-the-store-outside-of-setup)

### v3.2.7 (2021-12-18)

**Fix**

- Wallpeper fetch on CSR mounted

### v3.2.6 (2021-12-17)

**Fix**

- Mobile flow page title

### v3.2.5 (2021-12-17)

**Feature**

- `HitHub` > `GitHub`
- Improve axios error infos
- Suspend `Wallpaper` service

### v3.2.4 (2021-12-17)

**Feature**

- Mobile pages
- `Archive` rename to `Flow`
- `Divider` component
- Improve universal styles
- Improve SSR cache logic

### v3.2.3 (2021-12-11)

**Feature**

- Improve email link
- Improve `job` page banner

### v3.2.2 (2021-12-11)3.2.3

**Feature**

- `public` resources
- Improve `archive` page
- Improve `search` input
- Improve `share` component

### v3.2.1 (2021-12-08)

**Fix**

- Fix pages banner height
- Fix PC aside AdSense

### v3.2.0 (2021-12-08)

**Feature**

- SSR > `usePrefetch`
- `Vuex` > `Pinia`
- Add Merch page
- Add Article nav in sidebar
- Refactoring SSR (by vite) done
- Refactoring Markdown parser
- Redesign Music player
- Redesign Comment component
- Improve About/Archive/Lens/Job pages
- Remove Desktop WebSocket
- Add SSR archive (RSS/Sitemap) function
- Upgrade Swiper (remove `vue-awesome-swiper`)

### v3.1.0 (2021-02-16)

**Feature**

- Upgrade deps
- Upgrade vite to 2.x
- Upgrade marked (sanitize)

### v3.0.3 (2020-12-24)

**Fix**

- Fix mobile search logic

**Improve**

- Improve body style for Google AdSense
- Improve music service (delay)

**Feature**

- Upgrade deps

### v3.0.2 (2020-12-16)

**Fix**

- Upgrade music service
- Hidden marked warn message (HACK)
- Add marked comment

**Feature**

- Add github chart server
- Add fortune page
- Add tunnel server for Music/BiliBili/Wallpaper

### v3.0.1 (2020-12-03)

**Fix**

- Console style
- Assets CDN url
- SSR prefetch \* validate
- Error page & 404 Page
- Upgrade deps

### v3.0.0 (2020-12-01)

### v3.0.0.beta-0.1 (2020-05-20)

**Upgrade**

- Nuxt.js to Vuniversal
- Vue -> Vue3
- ...

### v2.5.8 (2020-03-29)

**Update**

- Upgrade vue-awesome-swiper
- Upgrade `webpack.splitChunks` with `nuxt.config.js`

### v2.5.7 (2020-03-27)

**Update**

- Support i18n wallpaper

### v2.5.6 (2020-03-21)

**Add**

- Add ICP link
- Add font `SFMonoRegular` for code

**Update**

- Auto language by device
- Update README.md badges
- Update workflows config
- Update `code` style
- Upgrade Swiper component & filter styles
- Upgrade TypeScript config
- Upgrade ESlint config
- Upgrade /pc/layout/toolbox component to composition-api

**Removed**

- Removed `normalize.css`
- Removed