/**
 * @file App config
 * @module app/config
 * 
 */

import path from 'path'
import { argv } from 'yargs'

const ROOT_PATH = path.join(__dirname, '..')
const packageJSON = require(path.resolve(ROOT_PATH, 'package.json'))

export const APP = {
  PORT: 8000,
  ROOT_PATH,
  DEFAULT_CACHE_TTL: 60 * 60 * 24,
  MASTER: 'AllInOne',
  NAME: 'AllInOne-API',
  URL: 'https://api.aio.news',
  ADMIN_EMAIL: (argv.admin_email as string) || 'devhoangkien@gmail.com',
  FE_NAME: 'Aio.news',
  FE_URL: 'https://aio.news',
  STATIC_URL: 'https://api.aio.news/static',
}

export const PROJECT = {
  name: packageJSON.name,
  version: packageJSON.version,
  author: packageJSON.author,
  homepage: packageJSON.homepage,
  documentation: packageJSON.documentation,
  issues: packageJSON.bugs.url,
}

export const SWAGGER = {
  SWAGGER_IS_SHOW: 'true',
  SWAGGER_TITLE: 'AIO.NEWS API',
  SWAGGER_DESCRIPTION: 'AIO.NEWS API',
  SWAGGER_VERSION: '1.0.0',
  SWAGGER_PATH: '/swagger',
  SWAGGER_USER: 'aionews',
  SWAGGER_PASSWORD: 'devhoangkien',

}

export const CROSS_DOMAIN = {
  allowedOrigins: ['http://localhost:8000', 'https://aio.news', 'https://admin.aio.news', 'http://localhost:3000', 'http://localhost:3001', 'http://localhost:9000'],
  allowedReferer: 'aio.news',
}

export const MONGO_DB = {
  // uri: (argv.db_uri as string) || `mongodb+srv://thetricks-admin:drcsCm0aIWzQRFhh@cluster0.k72gz.mongodb.net/thetricks?retryWrites=true&w=majority`,
  uri: (argv.db_uri as string) || `mongodb+srv://aionews:HTzuB2pBDQkZOeP4@aio.jnwh0.mongodb.net/aionews?retryWrites=true&w=majority`, //devhoangkien.com@gmail.com
}

export const REDIS = {
  host: argv.redis_host || 'localhost',
  port: argv.redis_port || 6379,
  username: (argv.redis_username || null) as string,
  password: (argv.redis_password || null) as string,
}

export const AUTH = {
  expiresIn: argv.auth_expires_in || 3600*60*24*7,// 7 days,
  data: argv.auth_data || { user: 'root' },
  defaultEmail: argv.auth_default_email || 'noreply.aio.news@gmail.com',
  jwtTokenSecret: argv.auth_key || 'nodepress',
  defaultPassword: argv.auth_default_password || 'root',
}

export const EMAIL = {
  port: 587,
  host: (argv.email_host as string) || 'smtp.zoho.com',
  account: (argv.email_account as string) || 'email example',
  password: (argv.email_password as string) || 'password',
  from: `"${APP.FE_NAME}" <${argv.email_from || argv.email_account}>` || `"${APP.FE_NAME}"<admin@aio.news> `,
}

export const DISQUS = {
  // https://disqus.com/api/applications/<app_id> & Keep permissions: <Read, Write, Manage Forums>
  adminAccessToken: (argv.disqus_admin_access_token as string) || 'disqus token',
  adminUsername: (argv.disqus_admin_username as string) || 'disqus username',
  forum: (argv.disqus_forum_shortname as string) || 'disqus forum',
  // https://disqus.com/api/applications/
  publicKey: (argv.disqus_public_key as string) || 'public key',
  secretKey: (argv.disqus_secret_key as string) || 'secret key',
}


export const AKISMET = {
  key: 'key akismet',
  blog: 'htt://aio.news',
}

// https://ziyuan.baidu.com/linksubmit/index
export const BAIDU_INDEXED = {
  site: argv.baidu_site || 'your baidu site domain. e.g. https://aio.news',
  token: argv.baidu_token || 'your baidu seo push token',
}

export const GOOGLE = {
  jwtServiceAccountCredentials: argv.google_jwt_cred_json ? JSON.parse(argv.google_jwt_cred_json as string) : null,
  type: "service_account",
  project_id: "",
  private_key_id: "",
  private_key: "",
  client_email: "",
  client_id: "",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url: ""
}

export const AWS = {
  accessKeyId: (argv.aws_access_key_id as string) || '',
  secretAccessKey: (argv.aws_secret_access_key as string) || '',
  s3StaticRegion: (argv.aws_s3_static_region as string) ||'region aws',
  s3StaticBucket: (argv.aws_s3_static_bucket as string) ||'bucket',
}

export const DB_BACKUP = {
  s3Region: argv.db_backup_s3_region as string,
  s3Bucket: argv.db_backup_s3_bucket as string,
  password: argv.db_backup_file_password as string,
}
