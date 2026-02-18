# Batch-Bridge Backend

High-capacity MERN backend for sharing class notes.

## Setup

1.  **Install Dependencies:**
    ```bash
    cd backend
    npm install
    ```

2.  **Environment Variables:**
    Create a `.env` file in the `backend` directory with the following keys:
    ```
    MONGODB_URI=your_mongodb_uri
    ADMIN_PASSWORD=Ankola_BCA_2026
    CLOUDINARY_CLOUD_NAME=your_cloud_name
    CLOUDINARY_API_KEY=your_api_key
    CLOUDINARY_API_SECRET=your_api_secret
    ```

3.  **Run Locally:**
    ```bash
    npm run dev
    ```

## API Endpoints

-   `POST /api/upload`: Upload a note (multipart/form-data: `file`, `subject`, `unit`).
-   `GET /api/notes`: Get approved notes (`?subject=...&unit=...`).
-   `GET /api/admin/pending`: Get pending notes (Header: `x-admin-password`).
-   `PATCH /api/admin/approve/:id`: Approve a note (Header: `x-admin-password`).
-   `DELETE /api/admin/reject/:id`: Reject a note (Header: `x-admin-password`).

## Deployment

Deploy to Vercel:
```bash
cd backend
vercel --prod
```
Make sure to set the environment variables in the Vercel dashboard.
