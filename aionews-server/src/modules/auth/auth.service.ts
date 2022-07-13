/**
 * @file Auth service
 * @module module/auth/service
 */
import { Types } from 'mongoose'
import lodash from 'lodash'
import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { UNDEFINED } from '@app/constants/value.constant'
import { InjectModel } from '@app/transformers/model.transformer'
import { decodeBase64, decodeMD5 } from '@app/transformers/codec.transformer'
import { MongooseDoc, MongooseID, MongooseModel } from '@app/interfaces/mongoose.interface'
import { TokenResult } from './auth.interface'
import { Auth } from './auth.model'
import { AuthCreateDTO, AuthUpdateDTO } from './auth.dto'
import * as APP_CONFIG from '@app/app.config'
import bcrypt from 'bcryptjs'
import { PaginateOptions, PaginateQuery, PaginateResult } from '@app/utils/paginate'
import { Article, ARTICLE_LIST_QUERY_GUEST_FILTER } from '@app/modules/article/article.model'
import { User } from '@app/modules/user/user.model'
import TokenPayload from './tokenPayload.interface'
@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectModel(Auth) private readonly authModel: MongooseModel<Auth>,
    @InjectModel(User) private readonly userModel: MongooseModel<User>,
    @InjectModel(Article) private readonly articleModel: MongooseModel<Article>
  ) {}

  public createToken(userId: MongooseID) {
    const expires_in = APP_CONFIG.AUTH.expiresIn as number;
    const access_token = this.jwtService.sign({
      id: userId,
      expires_in
    });

    return {
      access_token,
      expires_in
    }
  }

  private async aggregate(publicOnly: boolean, documents: Array<Auth>) {
    const counts = await this.articleModel.aggregate<{ _id: Types.ObjectId; count: number }>([
      { $match: publicOnly ? ARTICLE_LIST_QUERY_GUEST_FILTER : {} },
      { $unwind: '$user' },
      { $group: { _id: '$user', count: { $sum: 1 } } },
    ])
    const hydratedDocs = documents.map((user) => {
      const found = counts.find((item) => String(item._id) === String((user as any)._id))
      return { ...user, articles_count: found ? found.count : 0 } as Auth
    })
    return hydratedDocs
  }

  public async paginater(
    querys: PaginateQuery<Auth>,
    options: PaginateOptions,
    publicOnly: boolean
  ): Promise<PaginateResult<Auth>> {
    const users = await this.authModel.paginate(querys, { ...options, lean: true })
    const documents = await this.aggregate(publicOnly, users.documents)
    return { ...users, documents }
  }

  public validateAuthData(payload: any): Promise<any> {
    const isVerified = lodash.isEqual(payload.data, APP_CONFIG.AUTH.data)
    return isVerified ? payload.data : null
  }

  public async getAdminInfo(): Promise<Auth> {
    const adminInfo = await this.authModel.findOne(UNDEFINED, '-_id').exec()
    return adminInfo as Auth
  }
  public async getListAdmin(): Promise<Auth[]> {
    const adminList = await this.authModel.find().exec()
    return adminList
  }

  // public async putAdminInfo(id: MongooseID , auth: AuthUpdateDTO): Promise<Auth> {
  //   const { password, new_password, ...restAuth } = auth
    
  //   let newPassword: string | void
  //   if (password || new_password) {
  //     // verify password
  //     if (!password || !new_password) {
  //       throw 'Incomplete passwords'
  //     }
  //     if (password === new_password) {
  //       throw 'Old password and new password cannot be same'
  //     }

  //     // update password
  //     // const user = await this.authModel.findOne({ auth?.email }, '+password').exec();

  //     // const checkPassword = await this.verifyPassword(oldPassword, user?.password);
  //     const existedPassword = await this.authModel.findOne({ id },'+password').exec()
  //     console.log(existedPassword)
  //     if (password !== existedPassword?.password) {
  //       throw 'Old password incorrect'
  //     } else {
  //       const salt = 10
  //       newPassword = await bcrypt.hash(new_password,salt)
  //     }
  //   }

  //   // data
  //   const targetAuthData: Auth = { ...restAuth }
  //   if (newPassword) {
  //     targetAuthData.password = newPassword
  //   }

  //   // save

  //   if(targetAuthData){
  //     await this.authModel.findByIdAndUpdate({ id }, targetAuthData, { new: true }).exec()
  //   } else {
  //   await this.authModel.create(targetAuthData)
  //   }
  //   return this.getAdminInfo()
  // }
  
  public async createAdmin(newUser: Auth): Promise<Auth> {
    const existedEmail = await this.authModel.findOne({ email: newUser.email }).exec()
    const existedUserName = await this.authModel.findOne({ userName: newUser.userName }).exec()
    // check userName and email existed
    if (existedEmail) {
      throw `User '${newUser.email}' is existed`
    }
    if (existedUserName) {
      throw `User '${newUser.userName}' is existed`
    }
    // create user
    const user = await this.authModel.create(newUser)
    return user
  }
 
  public async adminLogin(email: string, password: string){
    try {
      const user = await this.authModel.findOne({ email }, '+password').exec();
      if (user?.role !== '2' && user?.role !== '1') {
        throw 'Bạn không có quyền truy cập vào trang này';
      }
      await this.verifyPassword(password, user!.password);
      const token = await this.createToken(user!._id)
      console.log(token)
      return {
        user,
        token
      }
    } catch (error) {
      throw 'Wrong credentials provided'

    }

    
    
  }

public async userLogin(email: string, password: string): Promise<TokenResult> {
    const user = await this.userModel.findOne({ email }, '+password').exec();
    const checkPassword = await this.verifyPassword(password, user?.password);
    if (checkPassword) {
      return this.createToken(user!._id)
    } else {
      throw 'Password incorrect'
    }
  }

  private async verifyPassword(password: string, hashedPassword: any) {
    const isPasswordMatching = await bcrypt.compare(
      password,
      hashedPassword
    );
    if (!isPasswordMatching) {
      throw 'Wrong credentials provided';
    }
    return isPasswordMatching;
  }

  public async updateAdmin(userID: MongooseID, newUser: Auth): Promise<MongooseDoc<Auth>> {
    const existedUserName = await this.authModel.findOne({ userName: newUser.userName }).exec()
    const existedEmail = await this.authModel.findOne({ email: newUser.email }).exec()
    if (existedUserName && String(existedUserName._id) !== String(userID)) {
      throw `User '${newUser.userName}' is existed`
    }
    if (existedEmail && String(existedEmail._id) !== String(userID)) {
      throw `User '${newUser.email}' is existed`
    }
    if (newUser?.password) {
      const salt = 10
      const newPassword = await bcrypt.hash(newUser?.password, salt)
      newUser.password = newPassword;
    }

    const user = await this.authModel.findByIdAndUpdate(userID, newUser as any, { new: true }).exec()
    if (!user) {
      throw `User '${userID}' not found`
    }
    return user
  }

  public async deleteAdmin(userID: MongooseID): Promise<MongooseDoc<Auth>> {
    const user = await this.authModel.findByIdAndRemove(userID).exec()
    if (!user) {
      throw `User '${userID}' not found`
    }

    return user
  }


  public async getAdminFromAuthenticationToken(token: string) {
    const payload = this.jwtService.verify(token, {
      secret: APP_CONFIG.AUTH.jwtTokenSecret as string,
    });
    console.log(payload)
    if (payload.id) {
      return this.authModel.findOne({ _id: payload.id }).exec();
    }
  }

  public async getUserFromAuthenticationToken(token: string) {
    const payload = this.jwtService.verify(token, {
      secret: APP_CONFIG.AUTH.jwtTokenSecret as string,
    });
    console.log(payload)
    if (payload.id) {
      return this.userModel.findOne({ _id: payload.id }).exec();
    }
  }
}
