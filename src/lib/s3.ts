import { env } from '@/env';
import {
  DeleteObjectCommand,
  type ObjectCannedACL,
  PutObjectCommand,
  S3Client,
  type S3ClientConfig,
} from '@aws-sdk/client-s3';

const endpoint = 'http://' + env.STORAGE_HOST + ':' + env.STORAGE_PORT;

const config: S3ClientConfig = {
  credentials: {
    accessKeyId: env.STORAGE_USER,
    secretAccessKey: env.STORAGE_PASSWORD,
  },
  endpoint: endpoint,
  forcePathStyle: true,
  region: 'eu-north-1',
};

const s3 = new S3Client(config);

const buckets = env.STORAGE_NAME.split(',');

const destinationsBucket = buckets[0]!;
const reviewsBucket = buckets[1]!;

export {
  s3,
  endpoint,
  destinationsBucket,
  reviewsBucket,
  PutObjectCommand,
  DeleteObjectCommand,
  type ObjectCannedACL,
};
