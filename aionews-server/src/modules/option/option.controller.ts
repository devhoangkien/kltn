/**
 * @file Option controller
 * @module module/option/controller
 * 
 */

import { Controller, Get, Put, Body, UseGuards, Patch } from '@nestjs/common'
import { QueryParams, QueryParamsResult } from '@app/decorators/queryparams.decorator'
import { Responsor } from '@app/decorators/responsor.decorator'
import { AdminOnlyGuard } from '@app/guards/admin-only.guard'
import { AdminMaybeGuard } from '@app/guards/admin-maybe.guard'
import { OptionService } from './option.service'
import { Option } from './option.model'
import { RolesGuard } from '@app/guards/roles.guard'
import { Roles } from '@app/guards/roles.decorator'
import { ADMIN_ROLE } from '../auth/auth.model'

@Controller('option')
export class OptionController {
  constructor(private readonly optionService: OptionService) {}

  @Get()
  //@UseGuards(AdminMaybeGuard)
  @Responsor.handle('Get site options')
  getOption(@QueryParams() { isAuthenticated }: QueryParamsResult) {
    return isAuthenticated ? this.optionService.ensureAppOption() : this.optionService.getOptionCacheForGuest()
  }

  @Patch()
   @UseGuards(AdminOnlyGuard, RolesGuard)
  @Roles(ADMIN_ROLE.SUPER_ADMIN)
  @Responsor.handle('Update site options')
  putOption(@Body() option: Option): Promise<Option> {
    return this.optionService.putOption(option)
  }
}
