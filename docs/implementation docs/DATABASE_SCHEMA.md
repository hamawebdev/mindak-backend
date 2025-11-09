# Database Schema Reference

## Overview
This document provides a quick reference for the database schema of the Agency Website backend.

---

## Tables

### 1. user
**Purpose**: Store user accounts (admin and regular users)

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PRIMARY KEY | Unique identifier |
| email | varchar(255) | NOT NULL, UNIQUE | User email |
| username | varchar(20) | NOT NULL, UNIQUE | Username |
| hash_password | varchar(255) | NOT NULL | Hashed password |
| role | varchar(50) | NOT NULL, DEFAULT 'user' | User role (admin/user) |
| created_at | timestamp | NOT NULL, DEFAULT now() | Creation timestamp |
| updated_at | timestamp | NOT NULL, DEFAULT now() | Last update timestamp |
| deleted_at | timestamp | NULL | Soft delete timestamp |

---

### 2. service_category
**Purpose**: Organize services into categories

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PRIMARY KEY | Unique identifier |
| name | varchar(255) | NOT NULL | Category name |
| description | text | NULL | Category description |
| is_active | boolean | NOT NULL, DEFAULT true | Active status |
| created_at | timestamp | NOT NULL, DEFAULT now() | Creation timestamp |
| updated_at | timestamp | NOT NULL, DEFAULT now() | Last update timestamp |

---

### 3. service
**Purpose**: Store services offered by the agency

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PRIMARY KEY | Unique identifier |
| name | varchar(255) | NOT NULL | Service name |
| description | text | NULL | Service description |
| price | numeric(10,2) | NULL | Service price |
| category_id | uuid | FK → service_category.id | Category reference |
| is_active | boolean | NOT NULL, DEFAULT true | Active status |
| display_order | integer | NOT NULL, DEFAULT 0 | Display order |
| created_at | timestamp | NOT NULL, DEFAULT now() | Creation timestamp |
| updated_at | timestamp | NOT NULL, DEFAULT now() | Last update timestamp |

---

### 4. form_question
**Purpose**: Store dynamic form questions for podcast and services forms

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PRIMARY KEY | Unique identifier |
| form_type | varchar(50) | NOT NULL | Form type (podcast/services) |
| section_type | varchar(50) | NOT NULL, DEFAULT 'general' | Section type (general/service_specific) |
| service_id | uuid | FK → service.id | Service reference (for service_specific) |
| question_text | text | NOT NULL | Question text |
| question_type | varchar(50) | NOT NULL | Question type (text/email/phone/etc) |
| required | boolean | NOT NULL, DEFAULT false | Required flag |
| order | integer | NOT NULL, DEFAULT 0 | Display order |
| placeholder | text | NULL | Placeholder text |
| help_text | text | NULL | Help text |
| validation_rules | jsonb | NULL | Validation rules (JSON) |
| is_active | boolean | NOT NULL, DEFAULT true | Active status |
| created_at | timestamp | NOT NULL, DEFAULT now() | Creation timestamp |
| updated_at | timestamp | NOT NULL, DEFAULT now() | Last update timestamp |

**Constraints**:
- CHECK: service_specific questions must have service_id, general questions must not

**Question Types**: text, email, phone, textarea, select, radio, checkbox, date, file, number, url

---

### 5. form_question_answer
**Purpose**: Store answer options for select/radio/checkbox questions

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PRIMARY KEY | Unique identifier |
| question_id | uuid | NOT NULL, FK → form_question.id (CASCADE) | Question reference |
| answer_text | text | NOT NULL | Answer display text |
| answer_value | varchar(255) | NULL | Answer value to store |
| answer_metadata | jsonb | NULL | Answer metadata (JSON) |
| order | integer | NOT NULL, DEFAULT 0 | Display order |
| is_active | boolean | NOT NULL, DEFAULT true | Active status |
| created_at | timestamp | NOT NULL, DEFAULT now() | Creation timestamp |
| updated_at | timestamp | NOT NULL, DEFAULT now() | Last update timestamp |

**Answer Metadata Structure**:
```json
{
  "image": "url",
  "description": "text",
  "price": 99.99,
  "icon": "icon-name",
  "color": "#hex"
}
```

---

### 6. podcast_reservation
**Purpose**: Store podcast reservation submissions

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PRIMARY KEY | Unique identifier |
| confirmation_id | varchar(50) | NOT NULL, UNIQUE | Confirmation ID (e.g., POD-2024-001234) |
| status | varchar(50) | NOT NULL, DEFAULT 'pending' | Status (pending/confirmed/completed/cancelled) |
| client_answers | jsonb | NOT NULL | Client answers (JSON array) |
| client_ip | varchar(45) | NULL | Client IP address |
| user_agent | varchar(500) | NULL | Client user agent |
| submitted_at | timestamp | NOT NULL, DEFAULT now() | Submission timestamp |
| created_at | timestamp | NOT NULL, DEFAULT now() | Creation timestamp |
| updated_at | timestamp | NOT NULL, DEFAULT now() | Last update timestamp |
| deleted_at | timestamp | NULL | Soft delete timestamp |

**Client Answers Structure**:
```json
[
  {
    "questionId": "uuid",
    "questionText": "text",
    "questionType": "text",
    "value": "answer",
    "answerId": "uuid or null",
    "answerText": "text or null",
    "answerMetadata": {}
  }
]
```

---

### 7. service_reservation
**Purpose**: Store service reservation submissions

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PRIMARY KEY | Unique identifier |
| confirmation_id | varchar(50) | NOT NULL, UNIQUE | Confirmation ID (e.g., SRV-2024-001234) |
| service_ids | jsonb | NOT NULL | Selected service IDs (JSON array) |
| status | varchar(50) | NOT NULL, DEFAULT 'pending' | Status (pending/confirmed/completed/cancelled) |
| client_answers | jsonb | NOT NULL | Client answers (JSON array) |
| client_ip | varchar(45) | NULL | Client IP address |
| user_agent | varchar(500) | NULL | Client user agent |
| submitted_at | timestamp | NOT NULL, DEFAULT now() | Submission timestamp |
| created_at | timestamp | NOT NULL, DEFAULT now() | Creation timestamp |
| updated_at | timestamp | NOT NULL, DEFAULT now() | Last update timestamp |
| deleted_at | timestamp | NULL | Soft delete timestamp |

**Client Answers Structure**:
```json
[
  {
    "questionId": "uuid",
    "questionText": "text",
    "questionType": "text",
    "sectionType": "general or service_specific",
    "serviceId": "uuid or null",
    "serviceName": "text or null",
    "value": "answer",
    "answerId": "uuid or null",
    "answerText": "text or null",
    "answerMetadata": {}
  }
]
```

---

### 8. reservation_status_history
**Purpose**: Track status changes for reservations

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PRIMARY KEY | Unique identifier |
| reservation_id | uuid | NOT NULL | Reservation reference |
| reservation_type | varchar(50) | NOT NULL | Type (podcast/service) |
| old_status | varchar(50) | NULL | Previous status |
| new_status | varchar(50) | NOT NULL | New status |
| notes | text | NULL | Change notes |
| changed_by | uuid | FK → user.id | User who made the change |
| changed_at | timestamp | NOT NULL, DEFAULT now() | Change timestamp |

---

### 9. reservation_note
**Purpose**: Store internal admin notes for reservations

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PRIMARY KEY | Unique identifier |
| reservation_id | uuid | NOT NULL | Reservation reference |
| reservation_type | varchar(50) | NOT NULL | Type (podcast/service) |
| note_text | text | NOT NULL | Note content |
| created_by | uuid | NOT NULL, FK → user.id | User who created the note |
| created_at | timestamp | NOT NULL, DEFAULT now() | Creation timestamp |

---

### 10. analytics_event
**Purpose**: Log analytics events

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PRIMARY KEY | Unique identifier |
| event_type | varchar(100) | NOT NULL | Event type |
| event_data | jsonb | NULL | Event data (JSON) |
| created_at | timestamp | NOT NULL, DEFAULT now() | Event timestamp |

**Event Types**: reservation_submitted, reservation_confirmed, form_viewed, service_viewed

---

## Relationships

```
service_category
    ↓ (1:N)
service
    ↓ (1:N)
form_question (service_specific)
    ↓ (1:N)
form_question_answer

form_question (general)
    ↓ (1:N)
form_question_answer

user
    ↓ (1:N)
reservation_status_history (changed_by)

user
    ↓ (1:N)
reservation_note (created_by)
```

---

## Indexes

Currently using default indexes on:
- Primary keys (all tables)
- Unique constraints (email, username, confirmation_id)
- Foreign keys (automatic in PostgreSQL)

**Recommended Additional Indexes** (to be added in future):
- `form_question(form_type, section_type, is_active)`
- `form_question(service_id)` where service_id IS NOT NULL
- `podcast_reservation(status, submitted_at)`
- `service_reservation(status, submitted_at)`
- `analytics_event(event_type, created_at)`

---

## Migration File

**Location**: `src/infra/database/migrations/0001_fixed_sister_grimm.sql`

**To apply migration**:
```bash
yarn migration:run
```

**Note**: Requires Docker containers to be running.

