import "dotenv/config";
import { google } from "googleapis";
const SCOPES = ["https://www.googleapis.com/auth/drive.readonly"];
const FOLDER_MIMETYPE = "application/vnd.google-apps.folder";
const SHORTCUT_MIMETYPE = "application/vnd.google-apps.shortcut";
import slugify from "slugify";

export async function getDriveClient() {
  const credentials = JSON.parse(
    Buffer.from(process.env.SERVICE_ACCOUNT, "base64").toString(),
  );

  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: SCOPES,
  });
  console.log("Successfully authenticated!");
  return google.drive({ version: "v3", auth });
}

const drive = await getDriveClient();
async function retrieveAllFiles(
  folder,
  path = "",
  allFiles = [],
  seen = new Set(),
) {
  // side edge for folder shortcuts, removes function from stack immediately
  if (seen.has(folder)) {
    return allFiles;
  }

  seen.add(folder);
  const files = await retrieveFile(drive, folder);

  for (const file of files) {
    const itemSlug = slugify(file.name);
    const fullSlug = path ? `${path}/${itemSlug}` : itemSlug;

    // SHORTCUT
    if (file.mimeType === SHORTCUT_MIMETYPE) {
      const targetId = file.shortcutDetails?.targetId;
      const targetType = file.shortcutDetails?.targetMimeType;

      allFiles.push({
        id: file.id,
        targetId: targetId,
        name: file.name,
        type: "shortcut",
        targetType: targetType === FOLDER_MIMETYPE ? "folder" : "file",
        path: path,
        fullSlug: fullSlug,
      });
    }

    // 2. TYPE: FOLDER
    else if (file.mimeType === FOLDER_MIMETYPE) {
      allFiles.push({
        id: file.id,
        name: file.name,
        type: "folder",
        path: path,
        fullSlug: fullSlug,
      });
      await retrieveAllFiles(file.id, fullSlug, allFiles, seen);
    }

    // 3. TYPE: FILE
    else {
      allFiles.push({
        ...file,
        type: "file",
        path: path,
        fullSlug: fullSlug,
      });
    }
  }

  console.log(allFiles);
  return allFiles;
}

async function retrieveFile(drive, folderId) {
  const res = await drive.files.list({
    q: `'${folderId}' in parents and trashed = false`,
    fields: "files(id, name, mimeType)",
  });

  return res.data.files || [];
}

await retrieveAllFiles("1bIegmdZL-T-tJfp1zl-eEwf3iimxopPg");
