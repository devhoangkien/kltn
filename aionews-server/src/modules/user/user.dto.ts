/**
 * @file user dto
 * @module module/user/dto
 */

import { IntersectionType } from '@nestjs/mapped-types'
import { IsArray, ArrayNotEmpty, ArrayUnique } from 'class-validator'
import { PaginateOptionDTO } from '@app/models/paginate.model'
import { KeywordQueryDTO } from '@app/models/query.model'

export class UserPaginateQueryDTO extends IntersectionType(PaginateOptionDTO, KeywordQueryDTO) { }

export class UsersDTO {
  @IsArray()
  @ArrayNotEmpty()
  @ArrayUnique()
  user_ids: string[]
}

export class UserLoginDTO {
  email: string
  password: string
}