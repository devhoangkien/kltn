/**
 * @file User service
 * @module module/user/service
 */

import { Types } from 'mongoose'
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@app/transformers/model.transformer'
import { getTagUrl, getUserUrl } from '@app/transformers/urlmap.transformer'
import { CacheService, CacheIOResult } from '@app/processors/cache/cache.service'
import { SeoService } from '@app/processors/helper/helper.service.seo'
import { MongooseModel, MongooseDoc, MongooseID } from '@app/interfaces/mongoose.interface'
import { PaginateResult, PaginateQuery, PaginateOptions } from '@app/utils/paginate'
import { SortType } from '@app/constants/biz.constant'
import { ArchiveService } from '@app/modules/archive/archive.service'
import { Article, ARTICLE_LIST_QUERY_GUEST_FILTER } from '@app/modules/article/article.model'
import { User } from './user.model'
import * as CACHE_KEY from '@app/constants/cache.constant'
import logger from '@app/utils/logger'
import bcrypt from 'bcryptjs'
import { AWSService } from '@app/processors/helper/helper.service.aws'
import { UserLoginDTO } from './user.dto'

@Injectable()
export class UserService {
  private allUsersCache: CacheIOResult<Array<User>>

  constructor(
    private readonly seoService: SeoService,
    private readonly cacheService: CacheService,
    private readonly archiveService: ArchiveService,
    private readonly awsService: AWSService,
    
    @InjectModel(User) private readonly userModel: MongooseModel<User>,
    @InjectModel(Article) private readonly articleModel: MongooseModel<Article>
  ) {
    this.allUsersCache = this.cacheService.promise({
      ioMode: true,
      key: CACHE_KEY.ALL_USERS,
      promise: () => this.getAllUsers(),
    })

    this.updateAllUsersCache().catch((error) => {
      logger.warn('[user]', 'init tagPaginateCache', error)
    })
  }

  private async aggregate(publicOnly: boolean, documents: Array<User>) {
    const counts = await this.articleModel.aggregate<{ _id: Types.ObjectId; count: number }>([
      { $match: publicOnly ? ARTICLE_LIST_QUERY_GUEST_FILTER : {} },
      { $unwind: '$user' },
      { $group: { _id: '$user', count: { $sum: 1 } } },
    ])
    const hydratedDocs = documents.map((user) => {
      const found = counts.find((item) => String(item._id) === String((user as any)._id))
      return { ...user, articles_count: found ? found.count : 0 } as User
    })
    return hydratedDocs
  }

  public async getAllUsers(): Promise<Array<User>> {
    const allUsers = await this.userModel.find().lean().sort({ _id: SortType.Desc }).exec()
    const documents = await this.aggregate(true, allUsers)
    return documents
  }

  public getAllUsersCache(): Promise<Array<User>> {
    return this.allUsersCache.get()
  }

  public updateAllUsersCache(): Promise<Array<User>> {
    return this.allUsersCache.update()
  }

  public async paginater(
    querys: PaginateQuery<User>,
    options: PaginateOptions,
    publicOnly: boolean
  ): Promise<PaginateResult<User>> {
    const users = await this.userModel.paginate(querys, { ...options, lean: true })
    const documents = await this.aggregate(publicOnly, users.documents)
    return { ...users, documents }
  }

  public getDetailByUserName(userName: string): Promise<MongooseDoc<User>> {
    return this.userModel
      .findOne({ userName },'+password')
      .exec()
      .then((result) => result || Promise.reject(`User '${userName}' not found`))
  }
  public getDetailByEmail(email: string): Promise<MongooseDoc<User>> {
    return this.userModel
      .findOne({ email }, '+password')
      .exec()
      .then((result) => result || Promise.reject(`User '${email}' not found`))
  }

  public getDetailByid(id: number): Promise<MongooseDoc<User>> {
    return this.userModel
      .findOne({ id }, '+password')
      .exec()
      .then((result) => result || Promise.reject(`User '${id}' not found`))
  }
  public getSUPER_ADMIN_USER(): Promise<MongooseDoc<User>> {
    return this.userModel
      .findOne({ role: 'SUPER_ADMIN' })
      .exec()
      .then((result) => result || Promise.reject(`User role 'SURPER_ADMIN' not found`))
  }

  public async create(newUser: User): Promise<MongooseDoc<User>> {
    const existedEmail = await this.userModel.findOne({ email: newUser.email }).exec()
    const existedUserName = await this.userModel.findOne({ userName: newUser.userName }).exec()
    // check userName and email existed
    if (existedEmail) {
      throw `User '${newUser.email}' is existed`
    }
    if (existedUserName) {
      throw `User '${newUser.userName}' is existed`
    }
    // create user
    const user = await this.userModel.create(newUser)
    this.seoService.push(getUserUrl(user.email))
    this.archiveService.updateCache()
    this.updateAllUsersCache()
    return user
  }

  public async loginUser(body: UserLoginDTO): Promise<MongooseDoc<User>> {
    const user = await this.getDetailByEmail(body.email)
    if (!user) {
      throw `User '${body.email}' not found`
    }
    const isValid = await bcrypt.compare(body.password, user.password)
    if (!isValid) {
      throw `Password is invalid`
    }
    return user
  }

  public async updateUserByAdmin(userID: MongooseID, newUser: User): Promise<MongooseDoc<User>> {
    const existedUserName = await this.userModel.findOne({ userName: newUser.userName }).exec()
    const existedEmail = await this.userModel.findOne({ email: newUser.email }).exec()
    if (existedUserName && String(existedUserName._id) !== String(userID)) {
      throw `User '${newUser.userName}' is existed`
    }
    if (existedEmail && String(existedEmail._id) !== String(userID)) {
      throw `User '${newUser.email}' is existed`
    }
    if (newUser?.password){
      const salt = 10
      const newPassword = await bcrypt.hash(newUser?.password, salt)
      newUser.password = newPassword;
    }
    
    const user = await this.userModel.findByIdAndUpdate(userID, newUser as any, { new: true }).exec()
    if (!user) {
      throw `User '${userID}' not found`
    }

    this.seoService.push(getUserUrl(user.userName))
    this.archiveService.updateCache()
    this.updateAllUsersCache()
    return user
  }

  public async delete(userID: MongooseID): Promise<MongooseDoc<User>> {
    const user = await this.userModel.findByIdAndRemove(userID).exec()
    if (!user) {
      throw `User '${userID}' not found`
    }

    this.seoService.delete(getUserUrl(user.userName))
    this.archiveService.updateCache()
    this.updateAllUsersCache()
    return user
  }

  public async batchDelete(userIDs: MongooseID[]) {
    // SEO remove
    const users = await this.userModel.find({ _id: { $in: userIDs } }).exec()
    this.seoService.delete(users.map((user) => getTagUrl(user.userName)))
    // DB remove
    const actionResult = await this.userModel.deleteMany({ _id: { $in: userIDs } }).exec()
    this.archiveService.updateCache()
    this.updateAllUsersCache()
    return actionResult
  }

  public async getTotalCount(): Promise<number> {
    return await this.userModel.countDocuments().exec()
  }

  async setCurrentRefreshToken(token: string, userId: MongooseID) {
    const currentHashedRefreshToken = await bcrypt.hash(token, 10);
    await this.userModel.findByIdAndUpdate(userId, {
      currentHashedRefreshToken
    });
  }

  async removeRefreshToken(userId: MongooseID) {
    return this.userModel.findByIdAndUpdate(userId, {
      currentHashedRefreshToken: null
    });
  }
}
