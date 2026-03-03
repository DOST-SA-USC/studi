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

export async function retrieveFile(folderId, currentPath = "") {
  try {
    const drive = await getDriveClient();

    const folderMetadata = await drive.files.get({
      fileId: folderId,
      fields: "id, name, mimeType",
    });
    const currentFolderName = folderMetadata.data.name;

    const res = await drive.files.list({
      q: `'${folderId}' in parents and trashed = false`,
      fields: "files(id, name, mimeType, shortcutDetails)",
    });
    const files = res.data.files || [];

    let allFiles = [];

    for (const file of files) {
      // EXPECTED SLUG: /[NAME]--[FOLDER_ID]/[NAME]--[FOLDER_ID]...
      const itemSlug = slugify(file.name, { lower: true, strict: true });
      const targetId =
        file.mimeType === SHORTCUT_MIMETYPE
          ? file.shortcutDetails?.targetId
          : file.id;

      const fullSlug = currentPath
        ? `${currentPath}/${itemSlug}--${targetId}`
        : `${itemSlug}--${targetId}`;

      const baseData = {
        id: file.id,
        name: file.name,
        fullSlug: fullSlug,
        parentPath: currentPath,
      };

      // 1. SHORTCUT
      if (file.mimeType === SHORTCUT_MIMETYPE) {
        allFiles.push({
          ...baseData,
          type: "shortcut",
          targetId: file.shortcutDetails?.targetId,
          targetType:
            file.shortcutDetails?.targetMimeType === FOLDER_MIMETYPE
              ? "folder"
              : "file",
        });
      }
      // 2. FOLDER
      else if (file.mimeType === FOLDER_MIMETYPE) {
        allFiles.push({
          ...baseData,
          type: "folder",
        });
      }
      // 3. FILE
      else {
        const fileData = {
          ...baseData,
          type: "file",
          mimeType: file.mimeType,
        };

        if (file.mimeType.startsWith("application/vnd.google-apps")) {
          // google docs / sheets / slides
          fileData.viewlink = file.webViewLink;
        } else {
          // pdf / image / etc.
          fileData.viewlink = file.webViewLink;
          fileData.contentLink = file.webContentLink;
        }

        allFiles.push(fileData);
      }
    }
    console.log(allFiles);

    let data = {
      folderName: currentFolderName,
      entries: allFiles
    }
    return data;
  } catch (error) {
    console.error("Google Drive API Error:", error.message);

    if (error.code === 404 || error.code === 400) {
      return {
        error: "Folder not found",
        message: "The provided Folder ID is invalid or doesn't exist.",
        code: 404,
      };
    }

    if (error.code === 403) {
      return {
        error: "Access Denied",
        message:
          "The service account does not have permission to view this folder.",
        code: 403,
      };
    }

    return {
      error: "Server Error",
      message: "Something went wrong with the Drive API.",
      code: 500,
    };
  }
}
