/**
 * @file user controller
 * @module module/user/controller
 */

import lodash from 'lodash'
import { Controller, Get, Put, Delete, Query, Body, UseGuards, Param, Post, UploadedFile, UseInterceptors, Req, Patch } from '@nestjs/common'
import { PermissionPipe } from '@app/pipes/permission.pipe'
import { ExposePipe } from '@app/pipes/expose.pipe'
import { Responsor } from '@app/decorators/responsor.decorator'
import { QueryParams, QueryParamsResult } from '@app/decorators/queryparams.decorator'
import { PaginateResult, PaginateQuery, PaginateOptions } from '@app/utils/paginate'
import { UsersDTO, UserPaginateQueryDTO, UserLoginDTO } from './user.dto'
import { UserService } from './user.service'
import { User, USER_ROLE } from './user.model'
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger'
// import RoleGuard from '@app/guards/roles.guard'
// import JwtAutGuard from '@app/guards/jwtAuth.guard'
import { FileInterceptor } from '@nestjs/platform-express'
import { Express } from 'express';
import { AdminOnlyGuard } from '@app/guards/admin-only.guard'
import * as APP_CONFIG from '@app/app.config'
import { AWSService } from '@app/processors/helper/helper.service.aws'

@Controller('user')
@ApiTags('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly awsService: AWSService
    ) { }

  @Get()
  @Responsor.paginate()
  @Responsor.handle('Get Users')
  getUsers(
    @Query(PermissionPipe, ExposePipe) query: UserPaginateQueryDTO,
    @QueryParams() { isUnauthenticated }: QueryParamsResult
  ): Promise<PaginateResult<User>> {
    const { sort, page, per_page, ...filters } = query
    const paginateQuery: PaginateQuery<User> = {}
    const paginateOptions: PaginateOptions = { page, perPage: per_page, dateSort: sort }

    // search
    if (filters.keyword) {
      const trimmed = lodash.trim(filters.keyword)
      const keywordRegExp = new RegExp(trimmed, 'i')
      paginateQuery.$or = [{ name: keywordRegExp }, { slug: keywordRegExp }, { description: keywordRegExp }]
    }

    // paginater
    return this.userService.paginater(paginateQuery, paginateOptions, isUnauthenticated)
  }

  @Get()
  @Responsor.handle('Get all User')
  getAllUsers(): Promise<Array<User>> {
    return this.userService.getAllUsersCache()
  }

  @Get(':userName')
  @Responsor.handle('Get User by UserName')
  getDetailByUserName(@Param('userName') userName: string,): Promise<User> {
    return this.userService.getDetailByUserName(userName)
  }

  @Post('login')
  @Responsor.handle('Login')
  loginUser(@Body() body: UserLoginDTO) {
    return this.userService.loginUser(body)
  }


  @Delete()
  @ApiBearerAuth()
  // @UseGuards(RoleGuard(USER_ROLE.ADMIN) || RoleGuard(USER_ROLE.SUPER_ADMIN))
  // @UseGuards(JwtAutGuard)
  @Responsor.handle('Delete users')
  delTags(@Body() body: UsersDTO) {
    return this.userService.batchDelete(body.user_ids)
  }

  @Put()
  @Responsor.handle('Update User by admin')
  putUser(@Query('id') id: string, @Body() user: User): Promise<User> {
    return this.userService.updateUserByAdmin(id, user)
  }

  @Patch()
  @Responsor.handle('Update User by admin')
  patchUser(@Query('id') id: string, @Body() user: User): Promise<User> {
    return this.userService.updateUserByAdmin(id, user)
  }

  @Post()
  @ApiBearerAuth()
  @Responsor.handle('create User')
  createUser( @Body() user: User): Promise<User> {
    return this.userService.create(user)
  }

  @Delete(':id')
  @ApiBearerAuth()
  // @UseGuards(RoleGuard(USER_ROLE.ADMIN) || RoleGuard(USER_ROLE.SUPER_ADMIN))
  // @UseGuards(JwtAutGuard)
  @Responsor.handle('Delete User')
  delTag(@QueryParams() { params }: QueryParamsResult): Promise<User> {
    return this.userService.delete(params.id)
  }

  @Post('upload')
  @UseGuards(AdminOnlyGuard)
  @UseInterceptors(FileInterceptor('file'))
  @Responsor.handle('Upload file to cloud storage')
  uploadStatic(@UploadedFile() file: Express.Multer.File, @Body() body) {
    return this.awsService
      .uploadFile({
        name: body.name,
        file: file.buffer,
        fileContentType: file.mimetype,
        region: APP_CONFIG.AWS.s3StaticRegion,
        bucket: APP_CONFIG.AWS.s3StaticBucket,
      })
      .then((result) => ({
        ...result
      }))
  }
}
