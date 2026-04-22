# Creator-Brand Collaboration Platform — Implementation Plan

## Overview
A full-stack platform connecting content creators with brands for collaborations. Three roles: Admin, Content Creator, Brand. Public visitors can view portfolio/work without logging in.

## Tech Stack
| Layer | Technology |
|-------|-----------|
| Frontend | React (Vite) |
| Backend | Go + GORM + Gin |
| Database | SQLite (dev) → Supabase (prod) |
| Auth | JWT-based |

---

## Database Schema

### Users Table
| Column | Type | Description |
|--------|------|-------------|
| id | uint (PK) | Auto-increment |
| email | string | Unique |
| password | string | Hashed |
| role | string | "admin", "creator", "brand" |
| name | string | Display name |
| created_at | timestamp | |

### Creators Table
| Column | Type | Description |
|--------|------|-------------|
| id | uint (PK) | |
| user_id | uint (FK) | Links to Users |
| name | string | |
| bio | text | |
| category | string | e.g. tech, lifestyle |
| followers | int | Social media followers |
| instagram | string | |
| youtube | string | |
| profile_image | string | URL |
| is_public | bool | Visible on public page |

### Brands Table
| Column | Type | Description |
|--------|------|-------------|
| id | uint (PK) | |
| user_id | uint (FK) | Links to Users |
| name | string | |
| description | text | |
| industry | string | |
| website | string | |
| logo | string | URL |
| is_public | bool | Visible on public page |

### CollaborationRequests Table
| Column | Type | Description |
|--------|------|-------------|
| id | uint (PK) | |
| brand_id | uint (FK) | |
| creator_id | uint (FK) | |
| status | string | "pending", "accepted", "rejected" |
| message | text | Brand's message |
| created_at | timestamp | |
| updated_at | timestamp | |

### Portfolio/Works Table (Public showcase)
| Column | Type | Description |
|--------|------|-------------|
| id | uint (PK) | |
| title | string | |
| description | text | |
| image_url | string | |
| category | string | |
| is_featured | bool | |

---

## API Endpoints

### Public (No Auth)
- `GET /api/public/works` — View portfolio/works
- `GET /api/public/creators` — View limited creator info
- `GET /api/public/brands` — View limited brand info

### Auth
- `POST /api/auth/login` — Login
- `POST /api/auth/register` — Register (admin only creates accounts)

### Admin
- `GET /api/admin/creators` — List all creators
- `POST /api/admin/creators` — Add creator
- `DELETE /api/admin/creators/:id` — Remove creator
- `GET /api/admin/brands` — List all brands
- `POST /api/admin/brands` — Add brand
- `DELETE /api/admin/brands/:id` — Remove brand
- `GET /api/admin/collaborations` — View all collaborations
- `POST /api/admin/works` — Add portfolio work
- `DELETE /api/admin/works/:id` — Remove portfolio work

### Brand
- `GET /api/brand/creators` — View all creators
- `POST /api/brand/request` — Send collab request to creator
- `GET /api/brand/requests` — View sent requests + status

### Creator
- `GET /api/creator/brands` — View partner brands
- `GET /api/creator/requests` — View received requests
- `PUT /api/creator/requests/:id` — Accept/Reject request

---

## Frontend Pages

### Public Pages (No Login Required)
1. **Landing Page** — Hero section, featured works, partner logos
2. **Our Work Page** — Portfolio showcase grid

### Auth Pages
3. **Login Page**

### Admin Dashboard
4. **Admin Home** — Stats overview
5. **Manage Creators** — Add/view/remove creators
6. **Manage Brands** — Add/view/remove brands
7. **Manage Works** — Add/view/remove portfolio items
8. **View Collaborations** — See all matches

### Brand Dashboard
9. **Brand Home** — Overview
10. **Browse Creators** — See all creators, send requests
11. **My Requests** — Track request status

### Creator Dashboard
12. **Creator Home** — Overview
13. **Partner Brands** — See brands partnering
14. **Incoming Requests** — Accept/reject requests

---

## Implementation Order

### Phase 1: Backend Setup
1. Initialize Go module with Gin + GORM
2. Define models
3. Setup database + migrations
4. Implement auth (JWT)
5. Implement all API endpoints

### Phase 2: Frontend Setup
6. Initialize React (Vite)
7. Setup routing (React Router)
8. Build public pages (Landing, Our Work)
9. Build auth pages (Login)
10. Build Admin dashboard
11. Build Brand dashboard
12. Build Creator dashboard

### Phase 3: Integration
13. Connect frontend to backend APIs
14. Test full flow
