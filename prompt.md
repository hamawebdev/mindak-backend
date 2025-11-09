yarn docker:up
yarn migration:run


Goal: Begin the backend implementation for the Agency Website Project based on the uploaded specification document (mindak backend.md).

Instruction: Start the backend development process phase by phase, following the structure and details provided in the document. Each phase should include well-defined deliverables, API design adherence, and database alignment.



The backend implementation for the agency platform is complete.
Generate a comprehensive API documentation for frontend integration.

The documentation must clearly define for each endpoint:

Endpoint URL and HTTP method

Request headers (if required)

Request body schema (with example)

Response structure (with example)

Validation rules or notes if applicable

Focus first on the user-side (client) endpoints related to:

Services retrieval and forms — including both general and service-specific sections.

Podcast forms and reservations — covering question retrieval and form submission.

Ensure the structure follows a consistent format and uses concise technical language for developers.
Clearly separate each group (services form, podcast form, reservation submission) and include example JSON for request and response.

The goal is to produce integration-ready API documentation for frontend developers to successfully connect all user-facing features.



# Connect to PostgreSQL (you'll be prompted for password)
psql -U postgres -h localhost

# Then create the database
CREATE DATABASE api_db;

# Exit psql
\q