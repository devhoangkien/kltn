/**
 * @file Expansion controller
 * @module module/expansion/controller
 * 
 */

import { Credentials } from 'google-auth-library'
import { Controller, Get, Post, Patch, UploadedFile, Body, UseGuards, UseInterceptors } from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { AdminOnlyGuard } from '@app/guards/admin-only.guard'
import { AdminMaybeGuard } from '@app/guards/admin-maybe.guard'
import { Responsor } from '@app/decorators/responsor.decorator'
import { QueryParams, QueryParamsResult } from '@app/decorators/queryparams.decorator'
import { AWSService } from '@app/processors/helper/helper.service.aws'
import { GoogleService } from '@app/processors/helper/helper.service.google'
import { StatisticService, Statistic } from './expansion.service.statistic'
import { DBBackupService } from './expansion.service.dbbackup'
import * as APP_CONFIG from '@app/app.config'
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger'
import FileUploadDto from './fileUploadDto'

@Controller('expansion')
@ApiTags('expansion')
export class ExpansionController {
  constructor(
    private readonly awsService: AWSService,
    private readonly googleService: GoogleService,
    private readonly dbBackupService: DBBackupService,
    private readonly statisticService: StatisticService
  ) {}

  @Get('statistic')
  //@UseGuards(AdminMaybeGuard)
  @Responsor.handle('Get statistic')
  getSystemStatistics(@QueryParams() { isUnauthenticated }: QueryParamsResult): Promise<Statistic> {
    return this.statisticService.getStatistic(isUnauthenticated)
  }

  @Get('google-token')
  @UseGuards(AdminOnlyGuard)
  @Responsor.handle('Get Google credentials')
  getGoogleToken(): Promise<Credentials> {
    return this.googleService.getCredentials()
  }

  @Patch('database-backup')
  @UseGuards(AdminOnlyGuard)
  @Responsor.handle('Update database backup')
  updateDatabaseBackup() {
    return this.dbBackupService.backup()
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
        ...result,
      }))
  }

}
