/*
  scripts/normalize-resume-urls.ts
  - แก้ resumeUrl เก่าในตาราง application ให้ใช้ Uploadcare account subdomain จาก UPLOADCARE_CDN_SUBDOMAIN
  - สำรองข้อมูลก่อนรัน
  Usage (local):
    npm run ts-node ./scripts/normalize-resume-urls.ts
  or
    npx ts-node ./scripts/normalize-resume-urls.ts
*/

require('dotenv').config();
const { prisma } = require('../src/lib/db/prisma');

async function main() {
  const cdnSub = process.env.UPLOADCARE_CDN_SUBDOMAIN;
  if (!cdnSub) {
    console.error('UPLOADCARE_CDN_SUBDOMAIN not set in .env');
    process.exit(1);
  }

  // เลือกเรคคอร์ดที่มี resumeUrl และเป็น url ของ uploadcare
  const apps = await prisma.application.findMany({
    where: { resumeUrl: { not: null } },
    select: { id: true, resumeUrl: true },
  });

  console.log(`Found ${apps.length} applications with resumeUrl`);

  let updated = 0;

  for (const a of apps) {
    const url = a.resumeUrl!;
    // หา uuid และ filename
    const m = url.match(/([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})(?:\/([^?#]+))?/);
    if (!m) continue;
    const uuid = m[1];
    const filename = m[2] || '';
    const newUrl = `https://${cdnSub}.ucarecd.net/${uuid}${filename ? `/${filename}` : ''}`;

    if (url === newUrl) continue;

    await prisma.application.update({ where: { id: a.id }, data: { resumeUrl: newUrl } });
    updated++;
    console.log(`Updated ${a.id}: ${url} -> ${newUrl}`);
  }

  console.log(`Done. Updated ${updated} records.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
