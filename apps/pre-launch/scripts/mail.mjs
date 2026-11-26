import { Client } from "pg";
import { unseal } from "../src/lib/security/crypto.ts";
const url = new URL(process.env.DATABASE_URL ?? "");
if (url.hostname !== "127.0.0.1" || url.pathname !== "/prelaunch")
  throw new Error("Use the dedicated loopback mailbox");
const id = process.argv[2];
if (id && !/^[a-f0-9-]{36}$/i.test(id))
  throw new Error("Use the capture ID shown in the mailbox list");
const client = new Client({
  connectionString: url.href,
  connectionTimeoutMillis: 3000,
});
await client.connect();
try {
  const { rows } = await client.query(
    'SELECT "deliveryId","sealed","createdAt" FROM "CapturedMail" WHERE ($1::uuid IS NULL OR "deliveryId"=$1) ORDER BY "createdAt" DESC LIMIT 20',
    [id ?? null],
  );
  const items = rows.flatMap((row) => {
    const value = JSON.parse(unseal(row.sealed, "mail:" + row.deliveryId));
    if (!value.to.endsWith("@" + process.env.LOCAL_TEST_MAIL_DOMAIN)) return [];
    return [
      {
        id: row.deliveryId,
        createdAt: row.createdAt,
        to: value.to,
        subject: value.subject,
        ...(id ? { text: value.text } : {}),
      },
    ];
  });
  console.log(JSON.stringify(items, null, 2));
} finally {
  await client.end();
}
