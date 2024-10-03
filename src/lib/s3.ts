import { env } from '@/env';
import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
  type S3ClientConfig,
} from '@aws-sdk/client-s3';

let s3: S3Client | undefined;

function getS3(): S3Client {
  if (!s3) {
    const endpoint: string =
      'http://' + env.STORAGE_HOST + ':' + env.STORAGE_PORT;

    const config: S3ClientConfig = {
      credentials: {
        accessKeyId: env.STORAGE_USER,
        secretAccessKey: env.STORAGE_PASSWORD,
      },
      endpoint: endpoint,
      forcePathStyle: true,
      region: 'eu-north-1',
    };

    s3 = new S3Client(config);
  }

  return s3;
}

const buckets = env.STORAGE_NAME.split(',');

const destinationsBucket = buckets[0]!;
const reviewsBucket = buckets[1]!;

export {
  getS3 as s3,
  destinationsBucket,
  reviewsBucket,
  PutObjectCommand,
  DeleteObjectCommand,
};
