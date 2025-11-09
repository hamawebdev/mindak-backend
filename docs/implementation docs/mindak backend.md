# Agency Website - Backend Implementation Task Breakdown

## Project Overview

Backend system for an agency website with dynamic reservation forms, admin dashboard, and analytics capabilities.

---

## 📋 Task Breakdown Table

### Phase 1: Database Design & Setup

|Task ID|Task Name|Subtasks|Priority|Complexity|
|---|---|---|---|---|
|**DB-1**|**Database Schema Design**|- Design normalized schema for all entities<br>- Create ER diagrams<br>- Define indexes and relationships<br>- Plan data types and constraints|High|Medium|
|**DB-2**|**Initial Migration Setup**|- Set up migration tool (Sequelize/Prisma/TypeORM)<br>- Create base migration files<br>- Configure database connection pooling|High|Low|
|**DB-3**|**Core Tables Creation**|- Users & Roles table<br>- Form Questions table (polymorphic)<br>- Services table<br>- Podcast Reservations table<br>- Service Reservations table<br>- Reservation Status table<br>- Analytics Events table|High|Medium|

**Suggested Schema Structure:**

```
users (id, email, password_hash, role, created_at, updated_at)

form_questions (
  id, 
  form_type ENUM('podcast', 'services'), 
  section_type ENUM('general', 'service_specific') DEFAULT 'general',
  service_id INTEGER NULL (FK to services, only for service_specific questions),
  question_text TEXT, 
  question_type ENUM('text', 'email', 'phone', 'textarea', 'select', 'radio', 'checkbox', 'date', 'file', 'number', 'url'), 
  required BOOLEAN DEFAULT false, 
  order INTEGER,
  placeholder TEXT,
  help_text TEXT,
  validation_rules JSON (e.g., {"min": 3, "max": 100, "pattern": "regex"}),
  is_active BOOLEAN DEFAULT true,
  created_at, 
  updated_at,
  CONSTRAINT check_service_specific CHECK (
    (section_type = 'service_specific' AND service_id IS NOT NULL) OR
    (section_type = 'general' AND service_id IS NULL)
  )
)

form_question_answers (
  id,
  question_id (FK to form_questions),
  answer_text TEXT NOT NULL,
  answer_value VARCHAR(255) (value to be stored when selected),
  answer_metadata JSON ({
    "image": "url",
    "description": "text",
    "price": 99.99,
    "icon": "icon-name",
    "color": "#hex"
  }),
  order INTEGER,
  is_active BOOLEAN DEFAULT true,
  created_at,
  updated_at
)

services (
  id, 
  name, 
  description, 
  price DECIMAL, 
  category_id,
  is_active BOOLEAN, 
  display_order INTEGER,
  created_at, 
  updated_at
)

service_categories (
  id,
  name,
  description,
  is_active BOOLEAN,
  created_at,
  updated_at
)

podcast_reservations (
  id, 
  confirmation_id UNIQUE,
  status ENUM('pending', 'confirmed', 'completed', 'cancelled'), 
  client_answers JSON (array of {questionId, questionText, value}),
  client_ip,
  user_agent,
  submitted_at, 
  created_at, 
  updated_at,
  deleted_at (for soft deletes)
)

service_reservations (
  id,
  confirmation_id UNIQUE, 
  service_ids JSON (array of selected service IDs: [1, 2, 3]), 
  status ENUM('pending', 'confirmed', 'completed', 'cancelled'), 
  client_answers JSON (array of {questionId, questionText, questionType, sectionType, serviceId, serviceName, value, answerId, answerText, answerMetadata}),
  client_ip,
  user_agent,
  submitted_at, 
  created_at, 
  updated_at,
  deleted_at (for soft deletes)
)

reservation_status_history (
  id, 
  reservation_id, 
  reservation_type ENUM('podcast', 'service'), 
  old_status, 
  new_status, 
  notes TEXT,
  changed_by (FK to users), 
  changed_at
)

reservation_notes (
  id,
  reservation_id,
  reservation_type ENUM('podcast', 'service'),
  note_text TEXT,
  created_by (FK to users),
  created_at
)

analytics_events (
  id, 
  event_type ENUM('reservation_submitted', 'reservation_confirmed', 'form_viewed', 'service_viewed'), 
  event_data JSON,
  created_at
)
```

---

### Phase 2: Authentication & Authorization

| Task ID    | Task Name                       | API Endpoints                                                                                                   | Priority | Complexity |
| ---------- | ------------------------------- | --------------------------------------------------------------------------------------------------------------- | -------- | ---------- |
| **AUTH-1** | **Admin Authentication System** | `POST /api/v1/auth/login`<br>`POST /api/v1/auth/logout`<br>`POST /api/v1/auth/refresh`<br>`GET /api/v1/auth/me` | High     | Medium     |
| **AUTH-2** | **JWT Implementation**          | - Generate & validate JWT tokens<br>- Implement refresh token mechanism<br>- Token blacklist for logout         | High     | Medium     |
| **AUTH-3** | **Role-Based Access Control**   | - Create middleware for role verification<br>- Implement permission guards<br>- Admin-only route protection     | High     | Medium     |
| **AUTH-4** | **Password Management**         | `POST /api/v1/auth/forgot-password`<br>`POST /api/v1/auth/reset-password`<br>`PUT /api/v1/auth/change-password` | Medium   | Low        |

---

### Phase 3: Form Management APIs

#### 3.1 Admin - Form Question Management

| Task ID    | Task Name                               | API Endpoints                                                                                                                                                                                                                                                                                                                         | Priority | Complexity |
| ---------- | --------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- | ---------- |
| **FORM-1** | **Admin: Podcast Form Questions CRUD**  | `GET /api/v1/admin/forms/podcast/questions`<br>`POST /api/v1/admin/forms/podcast/questions`<br>`PUT /api/v1/admin/forms/podcast/questions/:id`<br>`DELETE /api/v1/admin/forms/podcast/questions/:id`<br>`PATCH /api/v1/admin/forms/podcast/questions/:id/reorder`<br>`PATCH /api/v1/admin/forms/podcast/questions/bulk-reorder`       | High     | Medium     |
| **FORM-1A** | **Admin: Podcast Question Answers CRUD**  | `GET /api/v1/admin/forms/podcast/questions/:questionId/answers`<br>`POST /api/v1/admin/forms/podcast/questions/:questionId/answers`<br>`PUT /api/v1/admin/forms/podcast/questions/:questionId/answers/:id`<br>`DELETE /api/v1/admin/forms/podcast/questions/:questionId/answers/:id`<br>`PATCH /api/v1/admin/forms/podcast/questions/:questionId/answers/bulk-reorder`       | High     | Medium     |
| **FORM-2** | **Admin: Services Form Questions CRUD** | `GET /api/v1/admin/forms/services/questions?section=general`<br>`GET /api/v1/admin/forms/services/questions?section=service_specific&serviceId=123`<br>`POST /api/v1/admin/forms/services/questions`<br>`PUT /api/v1/admin/forms/services/questions/:id`<br>`DELETE /api/v1/admin/forms/services/questions/:id`<br>`PATCH /api/v1/admin/forms/services/questions/:id/reorder`<br>`PATCH /api/v1/admin/forms/services/questions/bulk-reorder` | High     | High     |
| **FORM-2A** | **Admin: Services Question Answers CRUD**  | `GET /api/v1/admin/forms/services/questions/:questionId/answers`<br>`POST /api/v1/admin/forms/services/questions/:questionId/answers`<br>`PUT /api/v1/admin/forms/services/questions/:questionId/answers/:id`<br>`DELETE /api/v1/admin/forms/services/questions/:questionId/answers/:id`<br>`PATCH /api/v1/admin/forms/services/questions/:questionId/answers/bulk-reorder`       | High     | Medium     |
| **FORM-3** | **Admin: Form Preview **                | `GET /api/v1/admin/forms/podcast/preview`<br>`GET /api/v1/admin/forms/services/preview`<br>                                                                                                                                                                                                                                           | Medium   | Low        |

#### 3.2 Client - Form Retrieval

| Task ID    | Task Name                               | API Endpoints                                                                                                                                                                                                                                 | Priority | Complexity |
| ---------- | --------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- | ---------- |
| **FORM-4** | **Client: Get Podcast Form Questions**  | `GET /api/v1/client/forms/podcast/questions`<br>- Returns only active questions<br>- Ordered by admin-defined sequence<br>- Includes validation rules                                                                                         | High     | Low        |
| **FORM-5** | **Client: Get Services Form Questions** | `GET /api/v1/client/forms/services/questions`<br>- Returns structured two-section format<br>- Section 1: General questions (applicable to all services)<br>- Section 2: Service-specific questions grouped by serviceId<br>- Only active questions<br>- Ordered by admin-defined sequence<br>- Includes validation rules and answer options with metadata                                                                                        | High     | Medium        |
| **FORM-6** | **Form Validation Service**             | - Implement dynamic field validation<br>- Create validation schemas based on question types<br>- Handle custom field types (text, email, phone, dropdown, checkbox, radio, date, file, etc.)<br>- Server-side validation for form submissions | High     | High       |

---

### Phase 4: Services Management

#### 4.1 Admin - Services Management

| Task ID   | Task Name                            | API Endpoints                                                                                                                                                                               | Priority | Complexity |
| --------- | ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- | ---------- |
| **SRV-1** | **Admin: Services CRUD**             | `GET /api/v1/admin/services` (all services)<br>`GET /api/v1/admin/services/:id`<br>`POST /api/v1/admin/services`<br>`PUT /api/v1/admin/services/:id`<br>`DELETE /api/v1/admin/services/:id` | High     | Low        |
| **SRV-2** | **Admin: Service Status Management** | `PATCH /api/v1/admin/services/:id/toggle-status`<br>`PATCH /api/v1/admin/services/bulk-status`                                                                                              | Medium   | Low        |
|           |                                      |                                                                                                                                                                                             |          |            |

#### 4.2 Client - Services Retrieval

| Task ID   | Task Name                       | API Endpoints                                                                                        | Priority | Complexity |
| --------- | ------------------------------- | ---------------------------------------------------------------------------------------------------- | -------- | ---------- |
| **SRV-4** | **Client: Get Active Services** | `GET /api/v1/client/services`<br>- Returns only active services<br>- Includes name, description.<br> | High     | Low        |
|           |                                 |                                                                                                      |          |            |
|           |                                 |                                                                                                      |          |            |
|           |                                 |                                                                                                      |          |            |

---

### Phase 5: Reservation Submission & Management

#### 5.1 Client - Reservation Submission

| Task ID   | Task Name                                | API Endpoints                                                                                                                                                                                                                                                                                                                                                                                                              | Priority | Complexity |
| --------- | ---------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- | ---------- |
| **RES-1** | **Client: Submit Podcast Reservation**   | `POST /api/v1/client/reservations/podcast`<br>Request Body: `{ answers: [{ questionId, value }] }`<br>- Validate all required fields<br>- Validate against current form structure<br>- Store submission with status "pending"<br>- Send confirmation email to client<br>- Send notification email to admin<br>- Trigger analytics event<br>- Return confirmation ID                                                        | High     | High       |
| **RES-2** | **Client: Submit Service Reservation**   | `POST /api/v1/client/reservations/services`<br>Request Body: `{ serviceIds: [1, 2], answers: [{ questionId, value, answerId }] }`<br>- Validate all selected services exist and are active<br>- Validate all required general questions are answered<br>- Validate all required service-specific questions for selected services are answered<br>- Validate against current form structure (both sections)<br>- Store submission with status "pending"<br>- Send confirmation email to client<br>- Send notification email to admin<br>- Trigger analytics event<br>- Return confirmation ID | High     | High       |
| **RES-3** | **Client: Get Reservation Confirmation** | `GET /api/v1/client/reservations/:confirmationId/confirmation`<br>- Public endpoint (no auth required)<br>- Returns basic reservation details<br>- Used for confirmation page display                                                                                                                                                                                                                                      | Medium   | Low        |

#### 5.2 Admin - Reservation Management

| Task ID    | Task Name                                  | API Endpoints                                                                                                                                                                                                                                                                                                       | Priority | Complexity |
| ---------- | ------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- | ---------- |
| **RES-4**  | **Admin: List Podcast Reservations**       | `GET /api/v1/admin/reservations/podcast`<br>Query params: `?page=1&limit=50&sortBy=created_at&order=desc&status=&dateFrom=&dateTo=&search=`<br>- Paginated results<br>- Filter by status, date range<br>- Search by client name/email/phone<br>- Sort by any column<br>- Return summary counts                      | High     | Medium     |
| **RES-5**  | **Admin: Get Podcast Reservation Details** | `GET /api/v1/admin/reservations/podcast/:id`<br>- Full reservation details<br>- Client answers with question labels<br>- Status history<br>- Metadata (IP, user agent, submission time)                                                                                                                             | High     | Low        |
| **RES-6**  | **Admin: List Service Reservations**       | `GET /api/v1/admin/reservations/services`<br>Query params: `?page=1&limit=50&sortBy=created_at&order=desc&status=&dateFrom=&dateTo=&search=&serviceId=`<br>- Paginated results<br>- Filter by status, date range, service<br>- Search by client name/email/phone<br>- Sort by any column<br>- Return summary counts | High     | Medium     |
| **RES-7**  | **Admin: Get Service Reservation Details** | `GET /api/v1/admin/reservations/services/:id`<br>- Full reservation details<br>- Service information<br>- Client answers with question labels<br>- Status history<br>- Metadata (IP, user agent, submission time)                                                                                                   | High     | Low        |
| **RES-8**  | **Admin: Update Reservation Status**       | `PATCH /api/v1/admin/reservations/podcast/:id/status`<br>`PATCH /api/v1/admin/reservations/services/:id/status`<br>Request Body: `{ status, notes }`<br>- Available statuses: pending, confirmed, completed, cancelled<br>- Log status change in history table                                                      | High     | Medium     |
| **RES-9**  | **Admin: Add Internal Notes**              | `POST /api/v1/admin/reservations/podcast/:id/notes`<br>`POST /api/v1/admin/reservations/services/:id/notes`<br>- Add internal admin notes (not visible to clients)                                                                                                                                                  | Medium   | Low        |
|            |                                            |                                                                                                                                                                                                                                                                                                                     | Medium   | Medium     |
|            |                                            |                                                                                                                                                                                                                                                                                                                     | Medium   | Medium     |
|            |                                            |                                                                                                                                                                                                                                                                                                                     | Low      | Medium     |
| **RES-13** | **Admin: Delete Reservations**             | `DELETE /api/v1/admin/reservations/podcast/:id`<br>`DELETE /api/v1/admin/reservations/services/:id`<br>- hard delete <br>                                                                                                                                                                                           | Low      | Low        |

---

### Phase 6: Analytics & Insights

| Task ID   | Task Name                    | API Endpoints                                                                                                                     | Priority | Complexity                                                        |
| --------- | ---------------------------- | --------------------------------------------------------------------------------------------------------------------------------- | -------- | ----------------------------------------------------------------- |
| **ANA-1** | **Dashboard Metrics**        | `GET /api/v1/admin/analytics/overview?period=daily                                                                                | weekly   | monthly`<br>Returns: total reservations, conversion rates, trends |
| **ANA-2** | **Podcast Analytics**        | `GET /api/v1/admin/analytics/podcast?period=&dateFrom=&dateTo=`<br>Returns: total count, status breakdown, time series data       | High     | Medium                                                            |
| **ANA-3** | **Services Analytics**       | `GET /api/v1/admin/analytics/services?period=&dateFrom=&dateTo=`<br>Returns: total count, top services, revenue, status breakdown | High     | Medium                                                            |
| **ANA-4** | **Trend Analysis**           | `GET /api/v1/admin/analytics/trends?metric=reservations&period=30d`<br>Returns: chart-ready time series data                      | Medium   | High                                                              |
| **ANA-5** | **Top Services Report**      | `GET /api/v1/admin/analytics/top-services?limit=10&period=30d`                                                                    | Medium   | Low                                                               |
| **ANA-6** | **Analytics Events Logging** | - Background service to log events<br>- Aggregate data for performance<br>- Implement caching strategy                            | Medium   | High                                                              |
| **ANA-7** | **Real-time Dashboard Data** | `GET /api/v1/admin/analytics/realtime`<br>Consider WebSocket for live updates                                                     | Low      | High                                                              |

---

## 📝 Detailed API Specifications

### Form Management - Enhanced Two-Section Structure

#### Admin API Endpoints

##### 1. **Podcast Form Questions Management**

**Create Podcast Question**
```http
POST /api/v1/admin/forms/podcast/questions
Authorization: Bearer {token}

Request Body:
{
  "question_text": "What is your podcast topic?",
  "question_type": "select",
  "required": true,
  "order": 1,
  "placeholder": "Select a topic",
  "help_text": "Choose the main theme of your podcast",
  "validation_rules": {
    "min": 1,
    "max": 1
  },
  "is_active": true
}

Response: 201 Created
{
  "success": true,
  "data": {
    "id": 1,
    "form_type": "podcast",
    "question_text": "What is your podcast topic?",
    "question_type": "select",
    "required": true,
    "order": 1,
    "placeholder": "Select a topic",
    "help_text": "Choose the main theme of your podcast",
    "validation_rules": { "min": 1, "max": 1 },
    "is_active": true,
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  }
}
```

**Create Podcast Question Answer (with metadata)**
```http
POST /api/v1/admin/forms/podcast/questions/:questionId/answers
Authorization: Bearer {token}

Request Body:
{
  "answer_text": "Technology & Innovation",
  "answer_value": "tech_innovation",
  "answer_metadata": {
    "image": "https://example.com/images/tech.jpg",
    "description": "Explore cutting-edge technology trends",
    "icon": "cpu",
    "color": "#3B82F6"
  },
  "order": 1,
  "is_active": true
}

Response: 201 Created
{
  "success": true,
  "data": {
    "id": 1,
    "question_id": 1,
    "answer_text": "Technology & Innovation",
    "answer_value": "tech_innovation",
    "answer_metadata": {
      "image": "https://example.com/images/tech.jpg",
      "description": "Explore cutting-edge technology trends",
      "icon": "cpu",
      "color": "#3B82F6"
    },
    "order": 1,
    "is_active": true,
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  }
}
```

**Get All Podcast Questions**
```http
GET /api/v1/admin/forms/podcast/questions
Authorization: Bearer {token}

Response: 200 OK
{
  "success": true,
  "data": [
    {
      "id": 1,
      "form_type": "podcast",
      "question_text": "What is your podcast topic?",
      "question_type": "select",
      "required": true,
      "order": 1,
      "placeholder": "Select a topic",
      "help_text": "Choose the main theme of your podcast",
      "validation_rules": { "min": 1, "max": 1 },
      "is_active": true,
      "answers": [
        {
          "id": 1,
          "answer_text": "Technology & Innovation",
          "answer_value": "tech_innovation",
          "answer_metadata": {
            "image": "https://example.com/images/tech.jpg",
            "description": "Explore cutting-edge technology trends",
            "icon": "cpu",
            "color": "#3B82F6"
          },
          "order": 1,
          "is_active": true
        }
      ],
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

##### 2. **Services Form Questions Management (Two-Section Structure)**

**Create General Question (Section 1)**
```http
POST /api/v1/admin/forms/services/questions
Authorization: Bearer {token}

Request Body:
{
  "section_type": "general",
  "question_text": "What is your company name?",
  "question_type": "text",
  "required": true,
  "order": 1,
  "placeholder": "Enter your company name",
  "help_text": "This will appear on all documentation",
  "validation_rules": {
    "min": 2,
    "max": 100
  },
  "is_active": true
}

Response: 201 Created
{
  "success": true,
  "data": {
    "id": 1,
    "form_type": "services",
    "section_type": "general",
    "service_id": null,
    "question_text": "What is your company name?",
    "question_type": "text",
    "required": true,
    "order": 1,
    "placeholder": "Enter your company name",
    "help_text": "This will appear on all documentation",
    "validation_rules": { "min": 2, "max": 100 },
    "is_active": true,
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  }
}
```

**Create Service-Specific Question (Section 2)**
```http
POST /api/v1/admin/forms/services/questions
Authorization: Bearer {token}

Request Body:
{
  "section_type": "service_specific",
  "service_id": 5,
  "question_text": "Select your preferred design style",
  "question_type": "radio",
  "required": true,
  "order": 1,
  "placeholder": null,
  "help_text": "Choose the style that best fits your brand",
  "validation_rules": {
    "min": 1,
    "max": 1
  },
  "is_active": true
}

Response: 201 Created
{
  "success": true,
  "data": {
    "id": 10,
    "form_type": "services",
    "section_type": "service_specific",
    "service_id": 5,
    "question_text": "Select your preferred design style",
    "question_type": "radio",
    "required": true,
    "order": 1,
    "placeholder": null,
    "help_text": "Choose the style that best fits your brand",
    "validation_rules": { "min": 1, "max": 1 },
    "is_active": true,
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  }
}
```

**Create Service-Specific Question Answer (with price metadata)**
```http
POST /api/v1/admin/forms/services/questions/:questionId/answers
Authorization: Bearer {token}

Request Body:
{
  "answer_text": "Modern Minimalist",
  "answer_value": "modern_minimalist",
  "answer_metadata": {
    "image": "https://example.com/images/modern.jpg",
    "description": "Clean lines, simple color palette, focus on functionality",
    "price": 299.99,
    "icon": "layout-grid",
    "color": "#000000"
  },
  "order": 1,
  "is_active": true
}

Response: 201 Created
{
  "success": true,
  "data": {
    "id": 15,
    "question_id": 10,
    "answer_text": "Modern Minimalist",
    "answer_value": "modern_minimalist",
    "answer_metadata": {
      "image": "https://example.com/images/modern.jpg",
      "description": "Clean lines, simple color palette, focus on functionality",
      "price": 299.99,
      "icon": "layout-grid",
      "color": "#000000"
    },
    "order": 1,
    "is_active": true,
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  }
}
```

**Get General Questions**
```http
GET /api/v1/admin/forms/services/questions?section=general
Authorization: Bearer {token}

Response: 200 OK
{
  "success": true,
  "data": [
    {
      "id": 1,
      "form_type": "services",
      "section_type": "general",
      "service_id": null,
      "question_text": "What is your company name?",
      "question_type": "text",
      "required": true,
      "order": 1,
      "placeholder": "Enter your company name",
      "help_text": "This will appear on all documentation",
      "validation_rules": { "min": 2, "max": 100 },
      "is_active": true,
      "answers": [],
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

**Get Service-Specific Questions**
```http
GET /api/v1/admin/forms/services/questions?section=service_specific&serviceId=5
Authorization: Bearer {token}

Response: 200 OK
{
  "success": true,
  "data": [
    {
      "id": 10,
      "form_type": "services",
      "section_type": "service_specific",
      "service_id": 5,
      "service_name": "Web Design",
      "question_text": "Select your preferred design style",
      "question_type": "radio",
      "required": true,
      "order": 1,
      "placeholder": null,
      "help_text": "Choose the style that best fits your brand",
      "validation_rules": { "min": 1, "max": 1 },
      "is_active": true,
      "answers": [
        {
          "id": 15,
          "answer_text": "Modern Minimalist",
          "answer_value": "modern_minimalist",
          "answer_metadata": {
            "image": "https://example.com/images/modern.jpg",
            "description": "Clean lines, simple color palette, focus on functionality",
            "price": 299.99,
            "icon": "layout-grid",
            "color": "#000000"
          },
          "order": 1,
          "is_active": true
        }
      ],
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

**Update Question**
```http
PUT /api/v1/admin/forms/services/questions/:id
Authorization: Bearer {token}

Request Body:
{
  "question_text": "Updated question text",
  "question_type": "textarea",
  "required": false,
  "order": 2,
  "placeholder": "Updated placeholder",
  "help_text": "Updated help text",
  "validation_rules": { "min": 10, "max": 500 },
  "is_active": true
}

Response: 200 OK
{
  "success": true,
  "data": {
    "id": 10,
    "form_type": "services",
    "section_type": "service_specific",
    "service_id": 5,
    "question_text": "Updated question text",
    "question_type": "textarea",
    "required": false,
    "order": 2,
    "placeholder": "Updated placeholder",
    "help_text": "Updated help text",
    "validation_rules": { "min": 10, "max": 500 },
    "is_active": true,
    "updated_at": "2024-01-02T00:00:00Z"
  }
}
```

**Reorder Questions**
```http
PATCH /api/v1/admin/forms/services/questions/bulk-reorder
Authorization: Bearer {token}

Request Body:
{
  "questions": [
    { "id": 1, "order": 1 },
    { "id": 2, "order": 2 },
    { "id": 3, "order": 3 }
  ]
}

Response: 200 OK
{
  "success": true,
  "message": "Questions reordered successfully"
}
```

**Delete Question**
```http
DELETE /api/v1/admin/forms/services/questions/:id
Authorization: Bearer {token}

Response: 200 OK
{
  "success": true,
  "message": "Question deleted successfully"
}
```

#### Client API Endpoints

##### 1. **Get Podcast Form Questions**

```http
GET /api/v1/client/forms/podcast/questions

Response: 200 OK
{
  "success": true,
  "data": [
    {
      "id": 1,
      "question_text": "What is your podcast topic?",
      "question_type": "select",
      "required": true,
      "order": 1,
      "placeholder": "Select a topic",
      "help_text": "Choose the main theme of your podcast",
      "validation_rules": { "min": 1, "max": 1 },
      "answers": [
        {
          "id": 1,
          "answer_text": "Technology & Innovation",
          "answer_value": "tech_innovation",
          "answer_metadata": {
            "image": "https://example.com/images/tech.jpg",
            "description": "Explore cutting-edge technology trends",
            "icon": "cpu",
            "color": "#3B82F6"
          },
          "order": 1
        },
        {
          "id": 2,
          "answer_text": "Business & Entrepreneurship",
          "answer_value": "business",
          "answer_metadata": {
            "image": "https://example.com/images/business.jpg",
            "description": "Insights from successful entrepreneurs",
            "icon": "briefcase",
            "color": "#10B981"
          },
          "order": 2
        }
      ]
    },
    {
      "id": 2,
      "question_text": "What is your name?",
      "question_type": "text",
      "required": true,
      "order": 2,
      "placeholder": "Enter your full name",
      "help_text": null,
      "validation_rules": { "min": 2, "max": 100 },
      "answers": []
    }
  ]
}
```

##### 2. **Get Services Form Questions (Two-Section Structure)**

```http
GET /api/v1/client/forms/services/questions

Response: 200 OK
{
  "success": true,
  "data": {
    "general": [
      {
        "id": 1,
        "question_text": "What is your company name?",
        "question_type": "text",
        "required": true,
        "order": 1,
        "placeholder": "Enter your company name",
        "help_text": "This will appear on all documentation",
        "validation_rules": { "min": 2, "max": 100 },
        "answers": []
      },
      {
        "id": 2,
        "question_text": "What is your email address?",
        "question_type": "email",
        "required": true,
        "order": 2,
        "placeholder": "your@email.com",
        "help_text": "We'll send confirmation to this email",
        "validation_rules": { "pattern": "^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$" },
        "answers": []
      },
      {
        "id": 3,
        "question_text": "What is your budget range?",
        "question_type": "select",
        "required": true,
        "order": 3,
        "placeholder": "Select a budget range",
        "help_text": null,
        "validation_rules": { "min": 1, "max": 1 },
        "answers": [
          {
            "id": 5,
            "answer_text": "$1,000 - $5,000",
            "answer_value": "1000-5000",
            "answer_metadata": null,
            "order": 1
          },
          {
            "id": 6,
            "answer_text": "$5,000 - $10,000",
            "answer_value": "5000-10000",
            "answer_metadata": null,
            "order": 2
          }
        ]
      }
    ],
    "services": [
      {
        "serviceId": 5,
        "serviceName": "Web Design",
        "questions": [
          {
            "id": 10,
            "question_text": "Select your preferred design style",
            "question_type": "radio",
            "required": true,
            "order": 1,
            "placeholder": null,
            "help_text": "Choose the style that best fits your brand",
            "validation_rules": { "min": 1, "max": 1 },
            "answers": [
              {
                "id": 15,
                "answer_text": "Modern Minimalist",
                "answer_value": "modern_minimalist",
                "answer_metadata": {
                  "image": "https://example.com/images/modern.jpg",
                  "description": "Clean lines, simple color palette, focus on functionality",
                  "price": 299.99,
                  "icon": "layout-grid",
                  "color": "#000000"
                },
                "order": 1
              },
              {
                "id": 16,
                "answer_text": "Bold & Colorful",
                "answer_value": "bold_colorful",
                "answer_metadata": {
                  "image": "https://example.com/images/bold.jpg",
                  "description": "Vibrant colors, dynamic layouts, eye-catching elements",
                  "price": 349.99,
                  "icon": "palette",
                  "color": "#FF6B6B"
                },
                "order": 2
              }
            ]
          },
          {
            "id": 11,
            "question_text": "How many pages do you need?",
            "question_type": "select",
            "required": true,
            "order": 2,
            "placeholder": "Select number of pages",
            "help_text": "Additional pages can be added later",
            "validation_rules": { "min": 1, "max": 1 },
            "answers": [
              {
                "id": 17,
                "answer_text": "1-5 pages",
                "answer_value": "1-5",
                "answer_metadata": {
                  "price": 0,
                  "description": "Perfect for landing pages or small sites"
                },
                "order": 1
              },
              {
                "id": 18,
                "answer_text": "6-10 pages",
                "answer_value": "6-10",
                "answer_metadata": {
                  "price": 500,
                  "description": "Ideal for small business websites"
                },
                "order": 2
              }
            ]
          }
        ]
      },
      {
        "serviceId": 7,
        "serviceName": "SEO Optimization",
        "questions": [
          {
            "id": 20,
            "question_text": "What is your target market?",
            "question_type": "textarea",
            "required": true,
            "order": 1,
            "placeholder": "Describe your target audience",
            "help_text": "Be as specific as possible",
            "validation_rules": { "min": 20, "max": 500 },
            "answers": []
          }
        ]
      }
    ]
  }
}
```

### Implementation Notes

#### Database Constraints
1. **Service-Specific Questions**: Must have a valid `service_id` when `section_type = 'service_specific'`
2. **General Questions**: Must have `service_id = NULL` when `section_type = 'general'`
3. **Question Ordering**: Order is scoped within each section (general questions and per-service questions are ordered independently)
4. **Answer Metadata**: Stored as JSON, flexible structure to support various use cases (images, prices, descriptions, icons, colors)

#### Frontend Rendering Logic
1. **Services Form**:
   - First, render all "general" questions
   - When user selects one or more services, dynamically load and render service-specific questions for those services
   - Questions should be grouped by service with clear visual separation
   
2. **Podcast Form**:
   - Render all questions in order
   - For questions with answers (select, radio, checkbox), display answer metadata (images, descriptions, icons) for richer UI

#### Validation Rules Examples
```json
{
  "text": { "min": 2, "max": 100, "pattern": "^[a-zA-Z\\s]+$" },
  "email": { "pattern": "^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$" },
  "phone": { "pattern": "^\\+?[1-9]\\d{1,14}$" },
  "number": { "min": 0, "max": 1000 },
  "textarea": { "min": 10, "max": 5000 },
  "select": { "min": 1, "max": 1 },
  "checkbox": { "min": 1, "max": 5 },
  "file": { "maxSize": 5242880, "allowedTypes": ["image/jpeg", "image/png", "application/pdf"] }
}
```

#### Answer Metadata Use Cases
- **Images**: Display visual options for design styles, color schemes, package tiers
- **Descriptions**: Provide detailed explanations for each answer option
- **Prices**: Show pricing for different service tiers or add-ons
- **Icons**: Use icon names (e.g., from Lucide) for visual representation
- **Colors**: Theme colors for UI consistency

#### Question Types Supported
- `text`: Single-line text input
- `email`: Email validation
- `phone`: Phone number with validation
- `textarea`: Multi-line text input
- `select`: Dropdown selection
- `radio`: Single choice from multiple options
- `checkbox`: Multiple selections
- `date`: Date picker
- `file`: File upload
- `number`: Numeric input
- `url`: URL validation

---

## 📤 Reservation Submission Specifications

### Service Reservation Submission (Two-Section Structure)

The Service Reservation endpoint now handles both general questions and service-specific questions.

#### Request Format

```http
POST /api/v1/client/reservations/services
Content-Type: application/json

Request Body:
{
  "serviceIds": [5, 7],  // Array of selected service IDs
  "answers": [
    // General Questions (Section 1)
    {
      "questionId": 1,
      "value": "Acme Corporation",
      "answerId": null  // null for text/textarea/email/phone/date/number/url types
    },
    {
      "questionId": 2,
      "value": "contact@acme.com",
      "answerId": null
    },
    {
      "questionId": 3,
      "value": "5000-10000",
      "answerId": 6  // ID of selected answer for select/radio/checkbox types
    },
    
    // Service-Specific Questions (Section 2) - for serviceId: 5 (Web Design)
    {
      "questionId": 10,
      "value": "modern_minimalist",
      "answerId": 15  // Selected design style answer ID
    },
    {
      "questionId": 11,
      "value": "6-10",
      "answerId": 18  // Selected page count answer ID
    },
    
    // Service-Specific Questions (Section 2) - for serviceId: 7 (SEO Optimization)
    {
      "questionId": 20,
      "value": "Small businesses in the tech industry looking for cloud solutions...",
      "answerId": null
    }
  ]
}
```

#### Response Format

```http
Response: 201 Created
{
  "success": true,
  "data": {
    "confirmationId": "SRV-2024-001234",
    "status": "pending",
    "services": [
      {
        "id": 5,
        "name": "Web Design"
      },
      {
        "id": 7,
        "name": "SEO Optimization"
      }
    ],
    "submittedAt": "2024-01-01T12:00:00Z",
    "message": "Your service reservation has been submitted successfully. You will receive a confirmation email shortly."
  }
}
```

#### Validation Logic

The backend must validate:

1. **Service Validation**:
   - All `serviceIds` must exist in the database
   - All `serviceIds` must have `is_active = true`
   - At least one service must be selected

2. **General Questions Validation** (Section 1):
   - All general questions with `required = true` must be answered
   - Answers must match the question type validation rules
   - For select/radio/checkbox questions, `answerId` must be provided and valid

3. **Service-Specific Questions Validation** (Section 2):
   - For each selected service, all service-specific questions with `required = true` must be answered
   - Only questions belonging to the selected services should be validated
   - Answers must match the question type validation rules
   - For select/radio/checkbox questions, `answerId` must be provided and valid

4. **Answer Format Validation**:
   - Text types (text, email, phone, textarea, url): `answerId` should be `null`, `value` contains the user input
   - Selection types (select, radio, checkbox): `answerId` must reference a valid answer from `form_question_answers`, `value` contains the `answer_value`
   - Date type: `value` should be in ISO 8601 format (YYYY-MM-DD)
   - Number type: `value` should be a valid number
   - File type: `value` should be the uploaded file URL/path

#### Storage Format

The reservation should be stored in the `service_reservations` table with the following structure:

```sql
service_reservations (
  id: 123,
  confirmation_id: "SRV-2024-001234",
  service_ids: [5, 7],  -- JSON array of selected service IDs
  status: "pending",
  client_answers: [
    {
      "questionId": 1,
      "questionText": "What is your company name?",
      "questionType": "text",
      "sectionType": "general",
      "serviceId": null,
      "value": "Acme Corporation",
      "answerId": null,
      "answerText": null
    },
    {
      "questionId": 3,
      "questionText": "What is your budget range?",
      "questionType": "select",
      "sectionType": "general",
      "serviceId": null,
      "value": "5000-10000",
      "answerId": 6,
      "answerText": "$5,000 - $10,000",
      "answerMetadata": null
    },
    {
      "questionId": 10,
      "questionText": "Select your preferred design style",
      "questionType": "radio",
      "sectionType": "service_specific",
      "serviceId": 5,
      "serviceName": "Web Design",
      "value": "modern_minimalist",
      "answerId": 15,
      "answerText": "Modern Minimalist",
      "answerMetadata": {
        "image": "https://example.com/images/modern.jpg",
        "description": "Clean lines, simple color palette, focus on functionality",
        "price": 299.99,
        "icon": "layout-grid",
        "color": "#000000"
      }
    }
  ],
  client_ip: "192.168.1.1",
  user_agent: "Mozilla/5.0...",
  submitted_at: "2024-01-01T12:00:00Z",
  created_at: "2024-01-01T12:00:00Z",
  updated_at: "2024-01-01T12:00:00Z"
)
```

#### Error Responses

**Missing Required General Question**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Missing required general question",
    "details": {
      "questionId": 1,
      "questionText": "What is your company name?",
      "sectionType": "general"
    }
  }
}
```

**Missing Required Service-Specific Question**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Missing required service-specific question",
    "details": {
      "questionId": 10,
      "questionText": "Select your preferred design style",
      "sectionType": "service_specific",
      "serviceId": 5,
      "serviceName": "Web Design"
    }
  }
}
```

**Invalid Service**
```json
{
  "success": false,
  "error": {
    "code": "INVALID_SERVICE",
    "message": "One or more selected services are invalid or inactive",
    "details": {
      "invalidServiceIds": [99]
    }
  }
}
```

**Invalid Answer**
```json
{
  "success": false,
  "error": {
    "code": "INVALID_ANSWER",
    "message": "Invalid answer provided for question",
    "details": {
      "questionId": 10,
      "answerId": 999,
      "reason": "Answer does not belong to this question"
    }
  }
}
```

### Podcast Reservation Submission

For comparison, the Podcast form remains simpler as it has no sections:

```http
POST /api/v1/client/reservations/podcast
Content-Type: application/json

Request Body:
{
  "answers": [
    {
      "questionId": 1,
      "value": "tech_innovation",
      "answerId": 1
    },
    {
      "questionId": 2,
      "value": "John Doe",
      "answerId": null
    }
  ]
}

Response: 201 Created
{
  "success": true,
  "data": {
    "confirmationId": "POD-2024-001234",
    "status": "pending",
    "submittedAt": "2024-01-01T12:00:00Z",
    "message": "Your podcast reservation has been submitted successfully. You will receive a confirmation email shortly."
  }
}
```
