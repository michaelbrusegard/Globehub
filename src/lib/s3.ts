import { env } from '@/env';
import {
  DeleteObjectCommand,
  PutBucketPolicyCommand,
  PutObjectCommand,
  S3Client,
  type S3ClientConfig,
} from '@aws-sdk/client-s3';

let isBucketPolicySet = false;

async function setPublicBucketPolicy(bucketName: string) {
  const params = {
    Bucket: bucketName,
    Policy: JSON.stringify({
      Version: '2012-10-17',
      Statement: [
        {
          Sid: 'PublicReadGetObject',
          Effect: 'Allow',
          Principal: '*',
          Action: ['s3:GetObject'],
          Resource: [`arn:aws:s3:::${bucketName}/*`],
        },
      ],
    }),
  };

  await s3.send(new PutBucketPolicyCommand(params));
}

const endpoint: string = 'http://' + env.STORAGE_HOST + ':' + env.STORAGE_PORT;

const path: string = env.NEXT_PUBLIC_STORAGE_PATH;

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

void (async () => {
  if (!isBucketPolicySet) {
    await setPublicBucketPolicy(destinationsBucket);
    await setPublicBucketPolicy(reviewsBucket);
    isBucketPolicySet = true;
  }
})();

export {
  s3,
  path as endpoint,
  destinationsBucket,
  reviewsBucket,
  PutObjectCommand,
  DeleteObjectCommand,
};
