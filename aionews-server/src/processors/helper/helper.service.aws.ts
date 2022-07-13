/**
 * @file Expansion aws service
 * @module module/expansion/aws.service
 * 
 */
import { S3 } from 'aws-sdk';
import { v4 as uuid } from 'uuid';
import {
  S3Client,
  PutObjectCommand,
  GetObjectAttributesCommand,
  ObjectAttributes,
  StorageClass,
  ServerSideEncryption,
  PutObjectRequest,
} from '@aws-sdk/client-s3'

import { Injectable } from '@nestjs/common'
import * as APP_CONFIG from '@app/app.config'

export interface FileUploader {
  name: string
  file: PutObjectRequest['Body'] | string | Uint8Array | Buffer
  fileContentType?: string
  region: string
  bucket: string
  classType?: StorageClass
  encryption?: ServerSideEncryption
}

export interface UploadResult {
  key: string
  url: string
  eTag: string
  size: number
}

@Injectable()
export class AWSService {
  private createClient(region: string) {
    return new S3Client({
      region,
      credentials: {
        accessKeyId: APP_CONFIG.AWS.accessKeyId,
        secretAccessKey: APP_CONFIG.AWS.secretAccessKey,
      },
    })
  }

  public getObjectAttributes(payload: { region: string; bucket: string; key: string }) {
    const s3Client = this.createClient(payload.region)
    const command = new GetObjectAttributesCommand({
      Bucket: payload.bucket,
      Key: payload.key,
      ObjectAttributes: Object.values(ObjectAttributes),
    })
    return s3Client.send(command)
  }

  public uploadFile(payload: FileUploader): Promise<UploadResult> {
    const { region, bucket, name: key } = payload
    const s3Client = this.createClient(region)
    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: payload.file,
      ContentType: payload.fileContentType,
      ACL: 'public-read',
      StorageClass: payload.classType ?? 'STANDARD',
      ServerSideEncryption: payload.encryption,
    })
    console.log(command);
    return s3Client.send(command).then(() => {
      return this.getObjectAttributes({ region, bucket, key }).then((attributes) => {
        return {
          key,
          // https://stackoverflow.com/questions/44400227/how-to-get-the-url-of-a-file-on-aws-s3-using-aws-sdk
          url: `https://s3.${region}.amazonaws.com/${bucket}/${key}`,
          eTag: attributes.ETag!,
          size: attributes.ObjectSize!,
        }
      })
    })
  }

  async uploadPublicFile(dataBuffer: Buffer, filename: string){
    const s3 = new S3();
    const uploadResult = await s3.upload({
      Bucket: APP_CONFIG.AWS.s3StaticBucket,
      Body: dataBuffer,
      Key: `${uuid()}-${filename}`
    })
      .promise();
    console.log(uploadResult);
    return {
      key: uploadResult.Key!,
      url: uploadResult.Location!,
    }
  }
}
