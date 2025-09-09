Assignment 1 - REST API Project - Response to Criteria

## Overview

- **Name:** Ben Muir
- **Student number:** n10867716
- **Application name:** Video Wiz
- **Two line description:** This REST API allows users to upload and transcode video files. It handles structured and unstructured data, and is deployed via Docker on AWS EC2.

---

## Core criteria

### Containerise the app

- **ECR Repository name:** 10867716-video-wiz
- **Video timestamp:** 0:09
- **Relevant files:**
  - /Dockerfile
  - /package.json
  - /index.js

### Deploy the container

- **EC2 instance ID:** i-02f24cfd8b7bb0bce
- **Video timestamp:** 0:28

### User login

- **One line description:** JWT-based login system with token verification middleware.
- **Video timestamp:** 0:46
- **Relevant files:**
  - /routes/auth.js
  - /middleware/authMiddleware.js

### REST API

- **One line description:** REST endpoints for login, upload, metadata retrieval, and transcoding.
- **Video timestamp:** 0:40
- **Relevant files:**
  - /routes/auth.js
  - /routes/upload.js
  - /routes/transcode.js
  - /routes/download.js
  - /routes/delete.js
  - /routes/list.js

### Two kinds of data

#### First kind

- **One line description:** Uploaded video files stored in the server.
- **Type:** Unstructured
- **Rationale:** Raw media files used for transcoding and metadata extraction.
- **Video timestamp:** 1:11
- **Relevant files:**
  - /routes/upload.js
  - /uploads/

#### Second kind

- **One line description:** JWT tokens and extracted metadata.
- **Type:** Structured
- **Rationale:** Used for authentication and UI display (duration, size).
- **Video timestamp:** 1:38
- **Relevant files:**
  - /middleware/authMiddleware.js
  - /routes/transcode.js
  - /metadata.json

### CPU intensive task

- **One line description:** FFmpeg-based video transcoding triggered via REST endpoint.
- **Video timestamp:** 2:30
- **Relevant files:**
  - /routes/transcode.js
  - /testscript.js

### CPU load testing

- **One line description:** Simulated concurrent transcoding with htop monitoring.
- **Video timestamp:** 2:58
- **Relevant files:**
  - /stress-test.sh
  - demo footage showing htop output
  - /testscript.js

---

## Additional criteria

### Extensive REST API features

- **One line description:** Includes DELETE and DOWNLOAD endpoints, plus pagination for metadata display.
- **Video timestamp:** 0:57, 2:30
- **Relevant files:**
  - /routes/upload.js
  - /frontend/script.js
  - /routes/download.js
  - metadata.js

### External API(s)

- **One line description:** Not attempted
- **Video timestamp:**
- **Relevant files:**

### Additional kinds of data

- **One line description:** Metadata extracted from video files and stored for UI display.
- **Video timestamp:** 1:37
- **Relevant files:**
  - /routes/transcode.js
  - /routes/upload.js
  - /metadata.json
  - /frontend/script.js

### Custom processing

- **One line description:** Transcoding uploaded videos to `.webm` format using FFmpeg.
- **Video timestamp:** 2:03
- **Relevant files:**
  - /routes/transcode.js
  - /metadata.json

### Infrastructure as code

- **One line description:** Not attempted
- **Video timestamp:**
- **Relevant files:**

### Web client

- **One line description:** Frontend UI for upload, preview, and metadata display.
- **Video timestamp:** 3:30
- **Relevant files:**
  - /frontend/index.html
  - /frontend/script.js
  - /style.css

### Upon request

- **One line description:** Not attempted
- **Video timestamp:**
- **Relevant files:**
