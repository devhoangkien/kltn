/**
 * @file Auth DTO
 * @module module/auth/dto
 * 
 */

import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsDefined, IsNotEmpty } from 'class-validator'
import { Auth } from './auth.model'

export class AuthLoginDTO {
  @ApiProperty({ description: 'email', example: 'admin@aio.news' })
  @IsString({ message: 'email must be string type' })
  @IsNotEmpty({ message: 'email?' })
  @IsDefined()
  email: string

  @ApiProperty({ description: 'password', example: 'thangdien' })
  @IsString({ message: 'password must be string type' })
  @IsNotEmpty({ message: 'password?' })
  @IsDefined()
  password: string
}

export class AuthUpdateDTO extends Auth {
  new_password?: string
}

export class AuthCreateDTO extends Auth {
  password?: string
}