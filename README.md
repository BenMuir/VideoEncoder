SECURE VIDEO MANAGEMENT PLATFORM
A full-stack web application for authenticated video upload, transcoding, and metadata handling, built with Node.js and deployed on AWS.


──────────────────────────────────────────────
OVERVIEW
──────────────────────────────────────────────


+----------------------+--------------------------------------------------+
| Feature              | Description                                      |
+----------------------+--------------------------------------------------+
| Secure Upload        | Authenticated video upload via drag-and-drop     |
| Transcoding          | FFmpeg-based media processing                    |
| Metadata Storage     | DynamoDB integration for video metadata          |
| File Management      | List, download, delete with access control       |
| Pagination           | Paginated media display for users                |
| Deployment           | Dockerized backend hosted on AWS EC2             |
+----------------------+--------------------------------------------------+



──────────────────────────────────────────────
TECH STACK
──────────────────────────────────────────────
+--------------+-------------------------------------------+
| Layer        | Tools & Services                          |
+--------------+-------------------------------------------+
| Frontend     | HTML, CSS, JavaScript                     |
| Backend      | Node.js, Express, express-fileupload      |
| Media Tools  | FFmpeg, ffprobe-static                    |
| Auth         | JWT-based token verification              |
| Cloud        | AWS EC2, DynamoDB                         |
| Container    | Docker                                    |
+--------------+-------------------------------------------+



──────────────────────────────────────────────
FILE STRUCTURE
──────────────────────────────────────────────
+------------------+------------------------------------------+
| Folder/File      | Purpose                                  |
+------------------+------------------------------------------+
| /frontend        | Static frontend assets                   |
| /routes          | API route handlers                       |
| /uploads         | Temporary video storage                  |
| /middleware      | Token verification middleware            |
| /utils           | DynamoDB client and helpers              |
| server.js        | Main Express server                      |
| .env             | Environment variables                    |
+------------------+------------------------------------------+



──────────────────────────────────────────────
AUTHENTICATION
──────────────────────────────────────────────
+------------------+--------------------------------------------------+
| Mechanism        | Description                                      |
+------------------+--------------------------------------------------+
| JWT Tokens       | Verified via middleware before route access      |
| Access Control   | File operations restricted to authenticated users|
+------------------+--------------------------------------------------+


──────────────────────────────────────────────
API ENDPOINTS
──────────────────────────────────────────────
+--------+--------------------+--------------------------------------+
| Method | Endpoint           | Description                          |
+--------+--------------------+--------------------------------------+
| POST   | /api/upload        | Upload video file                    |
| POST   | /api/auth          | Authenticate user                    |
| GET    | /api/list          | List uploaded videos                 |
| POST   | /api/transcode     | Transcode uploaded video             |
| GET    | /api/download      | Download video file                  |
| DELETE | /api/delete        | Delete video file                    |
+--------+--------------------+--------------------------------------+



──────────────────────────────────────────────
METADATA FIELDS
──────────────────────────────────────────────
+---------------+------------------------------------------+
| Field         | Description                              |
+---------------+------------------------------------------+
| video_id      | Unique filename identifier               |
| user_id       | Authenticated uploader’s ID              |
| originalName  | Original name of uploaded file           |
| uploadedAt    | ISO timestamp of upload                  |
| sizeMB        | File size in megabytes                   |
| duration      | Video duration in seconds                |
+---------------+------------------------------------------+
