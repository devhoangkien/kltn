/**
 * @file user module
 * @module module/user/module
 */

import { Module } from '@nestjs/common'
import { ArchiveModule } from '@app/modules/archive/archive.module'
import { ArticleProvider } from '@app/modules/article/article.model'
import { UserController } from './user.controller'
import { UserProvider } from './user.model'
import { UserService } from './user.service'

@Module({
  imports: [ArchiveModule],
  controllers: [UserController],
  providers: [ArticleProvider, UserProvider, UserService],
  exports: [UserService],
})
export class UserModule { }
