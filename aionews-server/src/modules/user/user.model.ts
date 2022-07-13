/**
 * @file User model
 * @module module/User/model
 */
import { ApiProperty } from '@nestjs/swagger';
import { AutoIncrementID } from '@typegoose/auto-increment'
import { pre, prop, plugin, modelOptions } from '@typegoose/typegoose'
import { IsString, IsNotEmpty } from 'class-validator'
import { generalAutoIncrementIDConfig } from '@app/constants/increment.constant'
import { getProviderByTypegooseClass } from '@app/transformers/model.transformer'
import { mongoosePaginate } from '@app/utils/paginate'
import bcrypt from 'bcryptjs'
import { IsEmail } from 'class-validator';
import { random } from 'lodash';



export enum USER_ROLE {
  USER = 'USER',
  ADMIN = 'ADMIN',
  SUPER_ADMIN = 'SUPER_ADMIN',
}

export const USER_STATUS = Object.freeze({
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  BANNED: 'BANNED',
})
@plugin(mongoosePaginate)
@plugin(AutoIncrementID, generalAutoIncrementIDConfig)
@modelOptions({
  schemaOptions: {
    timestamps: {
      createdAt: 'create_at',
      updatedAt: 'update_at',
    },
  },
})
/**
 * User model
 * @presave User slug is generated from User name
 */
@pre<User>('save', async function () {
  const salt = 10
  const hashedPassword = await bcrypt.hash(this.password, salt)
  this.password = hashedPassword
  const userName = await this.email.split("@")
  this.userName = userName[0]+'_'+Math.random().toString(36).substring(2, 10)
})
export class User {
  @prop({ unique: true })
  id: number

  @ApiProperty({ description: 'Email', example: 'example@gmail.com' })
  @IsNotEmpty()
  @IsEmail()
  @prop({ required: true, unique: true, validate: /\S+/ })
  email: string

  @ApiProperty({ description: 'UserName', example: 'example' })
  @prop({ validate: /^[0-9a-zA-Z_.-]+$/ })
  userName: string

  @prop({ isNull: true })
  phoneNumber?: string;

  @ApiProperty({ description: 'First name' })
  @prop({  validate: /\S+/ })
  firstName: string

  @ApiProperty({ description: 'First name' })
  @prop({  validate: /\S+/ })
  lastName: string

  @prop({ required: true, default: 'https://s3.ap-southeast-1.amazonaws.com/aio.news/user.png' })
  avatar: string

  @ApiProperty({ description: 'Password' })
  @prop({ select:false,  validate: /\S+/ })
  password: string

  @prop({ default: 1 })
  level: string

  @prop({ default: 0 })
  vip: string

  @prop({ default: 0 })
  point: string

  @prop({ default: USER_STATUS.ACTIVE, enum: Object.values(USER_STATUS) })
  status: string

  @prop({ default: false })
  public isEmailConfirmed: boolean;

  @prop({ default: false })
  public isPhoneNumberConfirmed: boolean;

  @prop({ default: null })
  github_url: string;

  @prop({ default: null })
  twitter_url: string;

  @prop({ default: null })
  instagram_url: string;

  @prop({ default: null })
  youtube_url: string;

  @prop({ default: null })
  facebook_url: string;

  @prop({ default: null })
  linkedin_url: string;

  @prop({ default: null })
  telegram_url: string;

  @prop({ default: null })
  weibo_url: string;

  @prop({ default: null })
  background_video: string;

  @prop({ default: Date.now, immutable: true })
  create_at?: Date

  @prop({ default: Date.now })
  update_at?: Date

}

export const UserProvider = getProviderByTypegooseClass(User)
