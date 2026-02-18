# Batch-Bridge Full Stack Setup

## 1. Start the Backend
Open a terminal:
```bash
cd backend
npm run dev
```
*Server runs on http://localhost:5000*

## 2. Start the Frontend
Open a **new** terminal (keep the backend running):
```bash
npm run dev
```
*Frontend runs on http://localhost:8080*

## 3. Features
-   **Upload**: Click the upload button on the homepage.
-   **View**: Approved notes appear in the grid.
-   **Admin**: Go to `http://localhost:8080/admin-mayank-7722`.
    -   Enter Password: `Ankola_BCA_2026`
    -   Approve or Reject notes.

## 4. Deployment Request (Recommended)
Since we allow **30MB** uploads, we should split hosting:
-   **Backend**: Deploy to **Render** (Free Web Service). Vercel has a 4.5MB upload limit, so Render is better for this.
-   **Frontend**: Deploy to **Vercel**.

### Order Matters!
1.  **Deploy Backend FIRST**: because you need its URL.
2.  **Deploy Frontend SECOND**: and add `VITE_API_URL` = `https://your-backend-url.com` in Vercel settings.
