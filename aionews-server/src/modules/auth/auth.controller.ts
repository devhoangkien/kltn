/**
 * @file Auth controller
 * @module module/auth/controller
 * 
 */

import { Controller, Get, Put, Post, Body, UseGuards, HttpStatus, Query, Param, Delete, Patch } from '@nestjs/common'
import { AdminOnlyGuard } from '@app/guards/admin-only.guard'
import { IPService } from '@app/processors/helper/helper.service.ip'
import { EmailService } from '@app/processors/helper/helper.service.email'
import { Responsor } from '@app/decorators/responsor.decorator'
import { QueryParams, QueryParamsResult } from '@app/decorators/queryparams.decorator'
import { AuthCreateDTO, AuthLoginDTO, AuthUpdateDTO } from './auth.dto'
import { AuthService } from './auth.service'
import { TokenResult } from './auth.interface'
import { Auth } from './auth.model'
import { APP } from '@app/app.config'
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger'
import { MongooseID } from '@app/interfaces/mongoose.interface'
import { PermissionPipe } from '@app/pipes/permission.pipe'
import { ExposePipe } from '@app/pipes/expose.pipe'
import { UserPaginateQueryDTO } from '../user/user.dto'
import { PaginateOptions, PaginateQuery, PaginateResult } from '@app/utils/paginate'
import lodash from 'lodash'
import {ADMIN_ROLE} from './auth.model'
import {RolesGuard} from '@app/guards/roles.guard'
import { Roles } from '@app/guards/roles.decorator';
@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(
    private readonly ipService: IPService,
    private readonly emailService: EmailService,
    private readonly authService: AuthService
  ) {}

  @Post('login')
  @Responsor.handle({ message: 'Login', error: HttpStatus.BAD_REQUEST })
  async login(
    @QueryParams() { visitor: { ip } }: QueryParamsResult,
    @Body() body: AuthLoginDTO
  ){
    const token = await this.authService.adminLogin(body.email,body.password)
    if (ip) {
      this.ipService.queryLocation(ip).then((location) => {
        const subject = `App has new login activity`
        const locationText = location ? [location.country, location.region, location.city].join(' · ') : 'unknow'
        const content = `${subject}, IP: ${ip}, location: ${locationText}`
        this.emailService.sendMailAs(APP.NAME, {
          to: body.email,
          subject,
          text: content,
          html: content,
        })
      })
    }
    return token
  }

  @Post('user/login')
  @Responsor.handle({ message: 'Login', error: HttpStatus.BAD_REQUEST })
  async loginUser(
    @QueryParams() { visitor: { ip } }: QueryParamsResult,
    @Body() body: AuthLoginDTO
  ): Promise<TokenResult> {
    const token = await this.authService.userLogin(body.email, body.password)
    if (ip) {
      this.ipService.queryLocation(ip).then((location) => {
        const subject = `App has new login activity`
        const locationText = location ? [location.country, location.region, location.city].join(' · ') : 'unknow'
        const content = `${subject}, IP: ${ip}, location: ${locationText}`
        this.emailService.sendMailAs(APP.NAME, {
          to: APP.ADMIN_EMAIL,
          subject,
          text: content,
          html: content,
        })
      })
    }
    return token
  }

  @Get('admin/profile')
  @Responsor.handle('Get admin info')
  getAdminInfo(
    @Query('token') token : string,
  ) {
    return this.authService.getAdminFromAuthenticationToken(token)
  }

  @Get('admin')
  //  @UseGuards(AdminOnlyGuard, RolesGuard)
  // @Roles(ADMIN_ROLE.SUPER_ADMIN)
  @Responsor.paginate()
  @Responsor.handle('Get Admin')
  getUsers(
    @Query(PermissionPipe, ExposePipe) query: UserPaginateQueryDTO,
    @QueryParams() { isUnauthenticated }: QueryParamsResult
  ): Promise<PaginateResult<Auth>> {
    const { sort, page, per_page, ...filters } = query
    const paginateQuery: PaginateQuery<Auth> = {}
    const paginateOptions: PaginateOptions = { page, perPage: per_page, dateSort: sort }

    // search
    if (filters.keyword) {
      const trimmed = lodash.trim(filters.keyword)
      const keywordRegExp = new RegExp(trimmed, 'i')
      paginateQuery.$or = [{ name: keywordRegExp }, { slug: keywordRegExp }, { description: keywordRegExp }]
    }

    // paginater
    return this.authService.paginater(paginateQuery, paginateOptions, isUnauthenticated)
  }

  @Patch('admin')
  @Responsor.handle('Update admin info')
  @UseGuards(AdminOnlyGuard, RolesGuard)
  @Roles(ADMIN_ROLE.SUPER_ADMIN)
  putAdminInfo(@Query('id') id: string, @Body() auth: Auth): Promise<Auth> {
    return this.authService.updateAdmin(id, auth)
  }

  // @Put('admin/profile')
  // // @UseGuards(AdminOnlyGuard)
  // @Responsor.handle('Update User by admin')
  // putUser(@Query('id') id: string, @Body() user: AuthUpdateDTO): Promise<Auth> {
  //   return this.authService.putAdminInfo(id, user)
  // }

  @Post('admin')
  @UseGuards(AdminOnlyGuard, RolesGuard)
  @Roles(ADMIN_ROLE.SUPER_ADMIN)
  @Responsor.handle('Create admin ')
  createAdmin(@Body() auth: AuthCreateDTO): Promise<Auth> {
    return this.authService.createAdmin(auth)
  } 

  // check token
  @Post('check')
  @ApiBearerAuth()
  @Responsor.handle('Check token')
  checkToken(): string {
    return 'ok'
  }

  // refresh token
  @Post('renewal')
  @UseGuards(AdminOnlyGuard)
  
  @Responsor.handle('Renewal Token')
  renewalToken(@Query('id') id: string): TokenResult {
    return this.authService.createToken(id)
  }


  @Delete('admin/:id')
    @UseGuards(AdminOnlyGuard, RolesGuard)
  @Roles(ADMIN_ROLE.SUPER_ADMIN)
  @Responsor.handle('Delete User')
  delTag(@QueryParams() { params }: QueryParamsResult): Promise<Auth> {
    return this.authService.deleteAdmin(params.id)
  }

  @Get('user/profile')
  @Responsor.handle('Get user info')
  getUserProfile(
    @Query('token') token: string,
  ) {
    return this.authService.getUserFromAuthenticationToken(token)
  }

}
