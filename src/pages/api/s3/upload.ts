import { File, formidable } from "formidable";
import { NextApiRequest, NextApiResponse } from "next";
import S3 from "aws-sdk/clients/s3";
import { v4 as uuid } from "uuid";
import fs from "fs";

const s3 = new S3({
  endpoint: process.env.S3_ENDPOINT,
  // region: process.env.S3_REGION,
  accessKeyId: process.env.S3_ACCESS_KEY_ID,
  secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  // signatureVersion: "v4",
});

export default async function hanlder(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const form = formidable({});
  let fields;
  let files;
  try {
    [fields, files] = await form.parse(req);
  } catch (err: any) {
    return res.status(400).json({ message: err.message });
  }

  files = Array.isArray(files.files) ? files.files : [files.files];

  if (!files.length) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  try {
    files = await Promise.all<string>(
      files.map(async (file: File) => {
        const fileBufer = fs.readFileSync(file.filepath);

        const path = `${uuid()}/${file.originalFilename}`;

        const fileParams = {
          Bucket: process.env.S3_BUCKET_NAME as string,
          Key: path,
          ContentType: file.mimetype || "",
          Body: fileBufer,
          ACL: "public-read",
          err: null,
        };

        await s3.putObject(fileParams).promise();

        return path;
      }),
    );
  } catch (err: any) {
    return res.status(500).json({ message: "Unknown Error" });
  }

  const fileUrls = files.map((file: string) => {
    const url = s3.getSignedUrl("getObject", {
      Bucket: process.env.S3_BUCKET_NAME as string,
      Key: file,
      Expires: 60 * 60 * 24 * 7,
    });
    return {
      url,
      path: file,
    };
  });

  return res.json(fileUrls);
}

export const config = {
  api: {
    bodyParser: false,
    // bodyParser: {
    //   sizeLimit: "8mb", // Set desired value here,
    // },
  },
};
