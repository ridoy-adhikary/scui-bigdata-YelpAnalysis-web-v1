# Backend Connection Guide (Frontend + Ubuntu Backend)

This guide explains how to connect this frontend to your Ubuntu-hosted backend stack:
- PostgreSQL
- HDFS data access/processing
- Deepseek-powered natural-language assistant

It is written so your backend engineer can connect quickly with minimal back-and-forth.

---

## 0) Target Architecture

User query in UI -> Frontend API call -> Ubuntu backend endpoint ->
1. Parse natural language
2. Retrieve/process from HDFS + PostgreSQL
3. Ask Deepseek (server-side)
4. Return:
   - natural language explanation
   - optional table payload
   - optional chart payload

Frontend renders all three in `Research AI`.

---

## 1) Run Frontend on Port 3000 (instead of 5173)

### 1.1 Update Vite config
In `vite.config.ts`, add a `server` block:

```ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  server: {
    host: '0.0.0.0',
    port: 3000,
    strictPort: true,
  },
});
```

### 1.2 Run
```powershell
npm install
npm run dev
```

Frontend should now run at:
- `http://localhost:3000`

---

## 2) Environment Variables (Frontend)

Create `.env.local` in project root:

```env
VITE_API_BASE_URL=http://<UBUNTU_SERVER_IP_OR_HOST>:8000
VITE_API_TIMEOUT_MS=30000
```

Recommended:
- Keep all secrets in backend only (Deepseek key, DB creds, HDFS creds).
- Frontend should never hold model/database credentials.

---

## 3) Backend API Contract (Recommended)

Use `/api` namespace to keep future routing clean.

### 3.1 Health endpoint
`GET /api/health`

Response:
```json
{
  "status": "ok",
  "services": {
    "postgres": true,
    "hdfs": true,
    "deepseek": true
  }
}
```

### 3.2 Chat query endpoint (core)
`POST /api/chat/query`

Request:
```json
{
  "sessionId": "optional-session-id",
  "query": "Show top cities with high ratings and explain why",
  "mode": "business",
  "filters": {
    "city": "Boise",
    "yearFrom": 2018,
    "yearTo": 2023
  }
}
```

Response (natural language + table + chart payload):
```json
{
  "sessionId": "sess_123",
  "answer": "Boise and Tampa show strong 5-star share in weekend categories...",
  "table": {
    "columns": ["city", "avg_rating", "review_count"],
    "rows": [
      ["Boise", 3.92, 12045],
      ["Tampa", 3.88, 11120]
    ]
  },
  "chart": {
    "type": "bar",
    "title": "Average Rating by City",
    "labels": ["Boise", "Tampa"],
    "datasets": [
      {
        "label": "Avg Rating",
        "data": [3.92, 3.88]
      }
    ]
  },
  "meta": {
    "source": ["hdfs://...", "postgres://..."],
    "model": "deepseek",
    "processingMs": 1280
  }
}
```

### 3.3 Error format (consistent)
```json
{
  "error": {
    "code": "QUERY_VALIDATION_FAILED",
    "message": "City filter is invalid",
    "details": {}
  }
}
```

---

## 4) Backend Responsibilities (Ubuntu)

Your backend engineer should implement:

1. NL query parser
2. SQL generation and/or predefined analytics query mapping
3. HDFS data fetch + aggregation
4. PostgreSQL query execution
5. Prompt construction for Deepseek
6. Unified response shaping (`answer`, `table`, `chart`, `meta`)

Keep this logic backend-only.

---

## 5) CORS + Network Setup

Backend must allow frontend origin:
- `http://localhost:3000`

Allow:
- `GET, POST, OPTIONS`
- `Content-Type, Authorization`

If credentials/cookies are used, set:
- `Access-Control-Allow-Credentials: true`
- exact origin (not `*`)

---

## 6) Frontend Integration Files to Add/Update

### 6.1 API client
Create `src/services/apiClient.ts` with Axios:
- base URL from `VITE_API_BASE_URL`
- timeout from `VITE_API_TIMEOUT_MS`
- common error normalization

### 6.2 Chat service
Create `src/services/chatService.ts`:
- `queryChat(request)` -> POST `/api/chat/query`

### 6.3 AI page wiring
Update `src/pages/ResearchAI.tsx`:
- replace mock timeout response with actual API call
- render backend `answer`
- render backend `table`
- render backend `chart` using your existing chart components

### 6.4 Optional shared types
Create `src/types/api.types.ts` for:
- `ChatQueryRequest`
- `ChatQueryResponse`
- `ApiErrorResponse`

---

## 7) Minimal Frontend Request Flow

When user submits query:
1. Disable input + show loading state
2. Call `/api/chat/query`
3. Append assistant `answer` message
4. If `table` exists -> render table block
5. If `chart` exists -> render chart block
6. Show errors with retry button

---

## 8) Validation Workflow (Step-by-Step)

### 8.1 Backend smoke test from terminal
```bash
curl -X POST http://<BACKEND_HOST>:8000/api/chat/query \
  -H "Content-Type: application/json" \
  -d '{
    "query":"Top 5 cities by average rating",
    "mode":"business"
  }'
```

### 8.2 Frontend smoke test
1. Open `http://localhost:3000`
2. Go to `Research AI`
3. Send test query
4. Confirm:
   - natural-language text appears
   - table appears (if returned)
   - chart appears (if returned)

### 8.3 Health checks
- `GET /api/health` reports all services `true`

---

## 9) Deployment Handoff Checklist

Backend team confirms:
- [ ] endpoint URL + port
- [ ] expected request schema
- [ ] response schema (`answer/table/chart/meta`)
- [ ] CORS origin includes `http://localhost:3000`
- [ ] timeout expectations (slow HDFS jobs)
- [ ] error codes documented

Frontend team confirms:
- [ ] `.env.local` updated
- [ ] API client wired
- [ ] ResearchAI page consumes real backend
- [ ] loading/error/empty states handled

---

## 10) Notes for Smooth Integration

- Keep table/chart payload **optional**; answer-only responses should still render.
- Prefer backend-controlled chart metadata (`type`, `labels`, `datasets`) so frontend doesn’t infer incorrectly.
- For long-running analytics, backend can return `jobId` and frontend can poll `/api/chat/result/{jobId}`.

---

If you want, next I can generate the actual frontend connector files (`apiClient`, `chatService`, typed DTOs, and `ResearchAI` integration) directly in this codebase.
