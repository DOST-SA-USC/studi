# 📂 GDRIVE API

This endpoint dynamically retrieves the contents of a specified Google Drive folder.

## 🚀 API Endpoint

`GET` **`[website]/api/docs/[slug]--[folderId]`**

### 📍 Path Parameters

| Parameter  | Description                                           | Example                        |
| :--------- | :---------------------------------------------------- | :----------------------------- |
| `slug`     | A descriptive name for the folder.                    | `courses`, `materials`, `docs` |
| `--`       | **Required Separator** used to split the slug and ID. | `--`                           |
| `folderId` | The unique Google Drive alphanumeric ID.              | `1LnFka-sJNOwSx...`            |

---

## 🔒 Authorization

To prevent unauthorized access, all requests must include the following header:

| Header    | Value                                         |
| :-------- | :-------------------------------------------- |
| `api-key` | `API_KEY` (Check your messenger or call eman) |

---

## 📤 Response Data

The API returns a JSON array containing **only the immediate children** (files and subfolders) of the target folder.

### Example Output

```json
[
  {
    "id": "FILE_ID_1",
    "name": "Lecture_Notes.pdf",
    "mimeType": "application/pdf"
  },
  {
    "id": "FOLDER_ID_1",
    "name": "Assignments",
    "mimeType": "application/vnd.google-apps.folder"
  }
]
```
