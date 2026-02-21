import { google } from 'googleapis';
import { Readable } from 'stream';

const DRIVE_FOLDER_ID = process.env.GDRIVE_FOLDER_ID; // ใส่ folder id ที่ต้องการเก็บไฟล์
const KEYFILE_PATH = process.env.GDRIVE_KEYFILE_PATH; // path ไปยัง service account key json

const auth = new google.auth.GoogleAuth({
  keyFile: KEYFILE_PATH,
  scopes: ['https://www.googleapis.com/auth/drive.file'],
});

const drive = google.drive({ version: 'v3', auth });

export async function uploadPdfToGoogleDrive(fileBuffer: Buffer, fileName: string, mimeType: string): Promise<string> {
  const fileMetadata = {
    name: fileName,
    parents: DRIVE_FOLDER_ID ? [DRIVE_FOLDER_ID] : undefined,
  };
  const media = {
    mimeType,
    body: Readable.from(fileBuffer),
  };
  const res = await drive.files.create({
    requestBody: fileMetadata,
    media,
    fields: 'id',
  });
  const fileId = res.data.id;
  if (!fileId) {
    throw new Error('Google Drive fileId is null or undefined');
  }
  // สร้างลิงก์ดาวน์โหลดแบบสาธารณะ
  await drive.permissions.create({
    fileId: fileId,
    requestBody: {
      role: 'reader',
      type: 'anyone',
    },
  });
  return `https://drive.google.com/uc?id=${fileId}&export=download`;
}
