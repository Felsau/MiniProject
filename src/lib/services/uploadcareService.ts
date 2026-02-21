// src/lib/services/uploadcareService.ts

const UPLOADCARE_PUBLIC_KEY = process.env.UPLOADCARE_PUBLIC_KEY!;

export async function uploadToUploadcare(file: File): Promise<{ cdnUrl: string; subdomainUrl: string; filename: string; uuid: string }> {
  const formData = new FormData();
  formData.append('UPLOADCARE_PUB_KEY', UPLOADCARE_PUBLIC_KEY);
  formData.append('UPLOADCARE_STORE', '1');
  formData.append('file', file);

  const response = await fetch('https://upload.uploadcare.com/base/', {
    method: 'POST',
    body: formData,
  });
  if (!response.ok) {
    throw new Error('Uploadcare upload failed');
  }
  const data = await response.json();
  const uuid = data.file;
  const filename = file.name;
  const cdnUrl = `https://ucarecdn.com/${uuid}/`;
  // หากต้องการใช้ subdomain เฉพาะของบัญชี (เช่น 4ouhv8kt55.ucarecd.net)
  // ให้ตั้งค่า UPLOADCARE_CDN_SUBDOMAIN ใน .env เป็นชื่อ subdomain นั้น
  const cdnSubdomain = process.env.UPLOADCARE_CDN_SUBDOMAIN;
  const subdomainUrl = cdnSubdomain
    ? `https://${cdnSubdomain}.ucarecd.net/${uuid}/${filename}`
    : `https://${uuid.substring(0,12)}.ucarecd.net/${uuid}/${filename}`;
  return {
    cdnUrl,
    subdomainUrl,
    filename,
    uuid
  };
}
