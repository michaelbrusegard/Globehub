import { env } from '@/env';
import aws from 'aws-sdk';

const s3 = new aws.S3({
  accessKeyId: env.STORAGE_USER,
  secretAccessKey: env.STORAGE_PASSWORD,
  endpoint: 'http://' + env.STORAGE_HOST + ':' + env.STORAGE_PORT,
  s3ForcePathStyle: true,
  signatureVersion: 'v4',
});

const buckets = env.STORAGE_NAME.split(',');

const destinationsBucket = buckets[0];
const reviewsBucket = buckets[1];

export { s3, destinationsBucket, reviewsBucket };
