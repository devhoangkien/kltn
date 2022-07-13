/**
 * @file Auth & admin model
 * @module module/auth/model
 * 
 */

import { prop, modelOptions, pre, plugin } from '@typegoose/typegoose'
import { IsString, IsDefined, IsOptional, IsNotEmpty, IsEmail } from 'class-validator'
import { getProviderByTypegooseClass } from '@app/transformers/model.transformer'
import bcrypt from 'bcryptjs'
import { ApiProperty } from '@nestjs/swagger'
import { mongoosePaginate } from '@app/utils/paginate'
import { AutoIncrementID } from '@typegoose/auto-increment'
import { generalAutoIncrementIDConfig } from '@app/constants/increment.constant'

// export const DEFAULT_AUTH = Object.freeze<Auth>({
//   id: '',
//   email:'',
//   userName:'',
//   name: '',
//   slogan: '',
//   avatar: '',
//   role:''
// })
export enum ADMIN_ROLE {
  SUPER_ADMIN = '1',
  ADMIN = '2'
}

@modelOptions({
  schemaOptions: {
    versionKey: false,
  },
})
@pre<Auth>('save', async function () {
    const salt = 10
    const hashedPassword = await bcrypt.hash(this.password, salt)
    this.password = hashedPassword
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
export class Auth {
  @prop({ unique: true })
  id: number
  
  @ApiProperty({ description: 'Name', example: 'admin' })
  @IsString()
  @prop({ required: true })
  name: string

  @ApiProperty({ description: 'Slogan', example: 'admin' })
  @IsString()
  @prop({ required: true })
  slogan: string

  @ApiProperty({ description: 'avatar', example: 'https://awsaionews.s3.ap-southeast-1.amazonaws.com/7719a930-8c5c-4690-9560-4b6acc8ece38-0116016F18F.jpg?image_process=format,webp/quality,q_88/resize,w_1190,h_420/crop,mid,w_1190,h_420/watermark,text_U3VybW9uLm1l,type_bm90b3NhbnM,color_ffffff,size_31,g_sw,t_26,x_30,y_18' })
  @IsString()
  @IsOptional()
  @prop({ default:'https://s3.ap-southeast-1.amazonaws.com/aio.news/user.png'})
  avatar: string

  @ApiProperty({ description: 'Email', example: 'admin@aio.news' })
  @IsNotEmpty()
  @IsEmail()
  @prop({ required: true, unique: true, validate: /\S+/ })
  email: string

  @ApiProperty({ description: 'userName', example: 'devhoangkien' })
  @IsString()
  @IsDefined()
  @prop({ required: true })
  userName: string

  @ApiProperty({ description: 'Role', example: '2' })
  @IsString()
  @prop({ default: ADMIN_ROLE.ADMIN, enum: Object.values(ADMIN_ROLE) })
  role: ADMIN_ROLE

  @ApiProperty({ description: 'Password', example: 'thangdien' })
  @prop({ select: false })
  password?: string
}

export const AuthProvider = getProviderByTypegooseClass(Auth)
