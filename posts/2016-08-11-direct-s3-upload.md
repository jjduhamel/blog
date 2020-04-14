---
title: Uploading files to S3
author: John Duhamel
---

I recently encountered a scenario where I needed to accept a file upload through an API I was working on.  I tried a couple different approaches.

## Multipart Form

My first approach was to accept the file using a multipart form.  This is the traditional method of transfering files over HTTP.

I was nervous about doing this because it would significantly increase the amount of data the server would consume.  I knew this approach would work, but I felt it was worthwhile to research alternatives.

*Example*

```javascript
import Router from 'koa-router';
import multer from 'koa-multer';

const router = new Router();

const upload = multer({
  storage: multer.memoryStorage()
});

router.post('/upload', upload.single('document'), async ctx => {
  const { file } = ctx.req;

  // Do stuff with the file here

  ctx.status = 200;
});
```

## Direct Upload

The ideal scenario would be to allow the client to upload the file directly.  However, configuring S3 to accept file uploads directly would be a pretty major security hazard.

It turns out that Amazon provides a method to accept direct uploads securely.  Using the [AWS SDK](https://aws.amazon.com/sdk-for-node-js/), it's possible to create a signature which the client can use to upload a file to S3 directly.  The server signs the URL using the bucket, filename, and permissions that the client must set when uploading the file.  Futhermore, the server sets a finite TTL on the signature, so it must be used reasonably quickly after it is created.

You can then use [Lambda](https://aws.amazon.com/lambda/) you can monitor the S3 bucket and trigger whatever action you need whenever a new file is uploaded.  I'll try to cover that in a later post.

*Example*

```javascript
import Router from 'koa-router';
import bodyParser from 'koa-bodyparser';
import AWS from 'aws-sdk';
import mime from 'mime-types';
import util from 'util';

const S3_BUCKET=<bucket>;

const router = new Router();
router.use(bodyParser());

router.post('/upload', async ctx => {
  const { fileType } = ctx.request.body;
  
  const s3 = new AWS.S3();
  
  const fileName = util.format(
      'upload-%s.%s'
    , new Date().getTime()
    , mime.extension(fileType)
  );

  const signedUrl = s3.getSignedUrl('putObject', {
      Bucket: S3_BUCKET
    , Key: fileName
    , Expires: 60
    , ContentType: fileType
    , ACL: 'private'
  });

  ctx.body = {
    signedUrl, fileName
  };
});
```

*Testing*

```bash
$ curl -XPOST -d '{"fileType": "image/jpeg"}' http://localhost/upload
{
  "signedUrl": "<s3 url>",
  "fileName": "upload-<timestamp>.jpeg"
}
$ curl -t "<file path>" "<s3 url>"
```
