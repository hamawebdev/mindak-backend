# Client-Side Image Integration Guide

## Overview

The client endpoints for Podcast and Services form questions now return images with answer options. This guide shows how to integrate and display these images in your frontend application.

## API Endpoints

### Podcast Questions
```
GET /client/forms/podcast/questions
```

### Services Questions
```
GET /client/forms/services/questions
```

Both endpoints return answer images in the `answer_metadata.image` field.

---

## Response Format

### Answer with Image

```json
{
  "id": "d4e5f6a7-b8c9-0123-def1-234567890123",
  "answer_text": "Technology",
  "answer_value": "tech",
  "answer_metadata": {
    "image": "/uploads/question-answers/1699876543210-a1b2c3d4e5f6g7h8.jpg",
    "description": "Tech topics"
  },
  "order": 1
}
```

### Answer without Image

```json
{
  "id": "e5f6a7b8-c9d0-1234-ef12-345678901234",
  "answer_text": "Other",
  "answer_value": "other",
  "answer_metadata": null,
  "order": 3
}
```

---

## Frontend Integration

### React Example

```jsx
import React, { useState, useEffect } from 'react';

function PodcastQuestions() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const response = await fetch('/api/v1/client/forms/podcast/questions');
      const data = await response.json();
      
      if (data.success) {
        setQuestions(data.data);
      }
    } catch (error) {
      console.error('Error fetching questions:', error);
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    return `${process.env.REACT_APP_API_URL}${imagePath}`;
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="questions-container">
      {questions.map((question) => (
        <div key={question.id} className="question">
          <h3>{question.question_text}</h3>
          {question.required && <span className="required">*</span>}
          
          {question.help_text && (
            <p className="help-text">{question.help_text}</p>
          )}

          {/* Render answers with images */}
          {question.answers.length > 0 && (
            <div className="answers">
              {question.question_type === 'radio' && (
                <div className="radio-group">
                  {question.answers.map((answer) => (
                    <label key={answer.id} className="answer-option">
                      <input
                        type="radio"
                        name={question.id}
                        value={answer.answer_value}
                      />
                      
                      {/* Display image if available */}
                      {answer.answer_metadata?.image && (
                        <img
                          src={getImageUrl(answer.answer_metadata.image)}
                          alt={answer.answer_text}
                          className="answer-image"
                        />
                      )}
                      
                      <span className="answer-text">{answer.answer_text}</span>
                      
                      {/* Display description if available */}
                      {answer.answer_metadata?.description && (
                        <small className="answer-description">
                          {answer.answer_metadata.description}
                        </small>
                      )}
                    </label>
                  ))}
                </div>
              )}

              {question.question_type === 'checkbox' && (
                <div className="checkbox-group">
                  {question.answers.map((answer) => (
                    <label key={answer.id} className="answer-option">
                      <input
                        type="checkbox"
                        name={question.id}
                        value={answer.answer_value}
                      />
                      
                      {answer.answer_metadata?.image && (
                        <img
                          src={getImageUrl(answer.answer_metadata.image)}
                          alt={answer.answer_text}
                          className="answer-image"
                        />
                      )}
                      
                      <span className="answer-text">{answer.answer_text}</span>
                    </label>
                  ))}
                </div>
              )}

              {question.question_type === 'select' && (
                <select name={question.id}>
                  <option value="">Select an option...</option>
                  {question.answers.map((answer) => (
                    <option key={answer.id} value={answer.answer_value}>
                      {answer.answer_text}
                    </option>
                  ))}
                </select>
              )}
            </div>
          )}

          {/* Free-form input types */}
          {question.answers.length === 0 && (
            <>
              {question.question_type === 'text' && (
                <input
                  type="text"
                  name={question.id}
                  placeholder={question.placeholder || ''}
                />
              )}
              
              {question.question_type === 'email' && (
                <input
                  type="email"
                  name={question.id}
                  placeholder={question.placeholder || ''}
                />
              )}
              
              {question.question_type === 'textarea' && (
                <textarea
                  name={question.id}
                  placeholder={question.placeholder || ''}
                />
              )}
            </>
          )}
        </div>
      ))}
    </div>
  );
}

export default PodcastQuestions;
```

### Vue.js Example

```vue
<template>
  <div class="questions-container">
    <div v-if="loading">Loading...</div>
    
    <div v-else>
      <div v-for="question in questions" :key="question.id" class="question">
        <h3>
          {{ question.question_text }}
          <span v-if="question.required" class="required">*</span>
        </h3>
        
        <p v-if="question.help_text" class="help-text">
          {{ question.help_text }}
        </p>

        <!-- Radio buttons with images -->
        <div v-if="question.question_type === 'radio' && question.answers.length > 0" 
             class="radio-group">
          <label v-for="answer in question.answers" 
                 :key="answer.id" 
                 class="answer-option">
            <input
              type="radio"
              :name="question.id"
              :value="answer.answer_value"
            />
            
            <img
              v-if="answer.answer_metadata?.image"
              :src="getImageUrl(answer.answer_metadata.image)"
              :alt="answer.answer_text"
              class="answer-image"
            />
            
            <span class="answer-text">{{ answer.answer_text }}</span>
            
            <small v-if="answer.answer_metadata?.description" 
                   class="answer-description">
              {{ answer.answer_metadata.description }}
            </small>
          </label>
        </div>

        <!-- Checkboxes with images -->
        <div v-if="question.question_type === 'checkbox' && question.answers.length > 0" 
             class="checkbox-group">
          <label v-for="answer in question.answers" 
                 :key="answer.id" 
                 class="answer-option">
            <input
              type="checkbox"
              :name="question.id"
              :value="answer.answer_value"
            />
            
            <img
              v-if="answer.answer_metadata?.image"
              :src="getImageUrl(answer.answer_metadata.image)"
              :alt="answer.answer_text"
              class="answer-image"
            />
            
            <span class="answer-text">{{ answer.answer_text }}</span>
          </label>
        </div>

        <!-- Free-form inputs -->
        <input
          v-if="question.question_type === 'text' && question.answers.length === 0"
          type="text"
          :name="question.id"
          :placeholder="question.placeholder || ''"
        />
        
        <input
          v-if="question.question_type === 'email' && question.answers.length === 0"
          type="email"
          :name="question.id"
          :placeholder="question.placeholder || ''"
        />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      questions: [],
      loading: true
    };
  },
  mounted() {
    this.fetchQuestions();
  },
  methods: {
    async fetchQuestions() {
      try {
        const response = await fetch('/api/v1/client/forms/podcast/questions');
        const data = await response.json();
        
        if (data.success) {
          this.questions = data.data;
        }
      } catch (error) {
        console.error('Error fetching questions:', error);
      } finally {
        this.loading = false;
      }
    },
    getImageUrl(imagePath) {
      if (!imagePath) return null;
      return `${process.env.VUE_APP_API_URL}${imagePath}`;
    }
  }
};
</script>

<style scoped>
.answer-option {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  margin-bottom: 8px;
  cursor: pointer;
}

.answer-option:hover {
  background-color: #f5f5f5;
}

.answer-image {
  width: 48px;
  height: 48px;
  object-fit: cover;
  border-radius: 4px;
}

.answer-text {
  font-weight: 500;
}

.answer-description {
  color: #666;
  font-size: 0.875rem;
}
</style>
```

---

## Styling Examples

### CSS for Image-Enhanced Answers

```css
/* Card-style answer options with images */
.answer-option {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  margin-bottom: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.answer-option:hover {
  border-color: #2196F3;
  background-color: #f0f7ff;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(33, 150, 243, 0.15);
}

.answer-option input[type="radio"],
.answer-option input[type="checkbox"] {
  width: 20px;
  height: 20px;
  cursor: pointer;
}

.answer-image {
  width: 64px;
  height: 64px;
  object-fit: cover;
  border-radius: 8px;
  flex-shrink: 0;
}

.answer-text {
  font-size: 16px;
  font-weight: 500;
  color: #333;
  flex: 1;
}

.answer-description {
  display: block;
  color: #666;
  font-size: 14px;
  margin-top: 4px;
}

/* Selected state */
.answer-option:has(input:checked) {
  border-color: #2196F3;
  background-color: #e3f2fd;
}

/* Grid layout for multiple image options */
.answers-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
}

.answer-option-grid {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 16px;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.answer-option-grid:hover {
  border-color: #2196F3;
  transform: scale(1.05);
}

.answer-option-grid .answer-image {
  width: 100%;
  height: 120px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 12px;
}
```

### Tailwind CSS Example

```jsx
function AnswerOption({ answer, questionId, type = 'radio' }) {
  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    return `${process.env.REACT_APP_API_URL}${imagePath}`;
  };

  return (
    <label className="flex items-center gap-4 p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all duration-300 group">
      <input
        type={type}
        name={questionId}
        value={answer.answer_value}
        className="w-5 h-5 text-blue-600 focus:ring-2 focus:ring-blue-500"
      />
      
      {answer.answer_metadata?.image && (
        <img
          src={getImageUrl(answer.answer_metadata.image)}
          alt={answer.answer_text}
          className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
        />
      )}
      
      <div className="flex-1">
        <span className="text-base font-medium text-gray-900 group-hover:text-blue-600">
          {answer.answer_text}
        </span>
        
        {answer.answer_metadata?.description && (
          <p className="text-sm text-gray-600 mt-1">
            {answer.answer_metadata.description}
          </p>
        )}
      </div>
    </label>
  );
}
```

---

## Best Practices

### 1. Image Loading

```jsx
function AnswerImage({ src, alt }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  return (
    <div className="answer-image-container">
      {loading && <div className="image-skeleton" />}
      
      <img
        src={src}
        alt={alt}
        className={`answer-image ${loading ? 'hidden' : ''}`}
        onLoad={() => setLoading(false)}
        onError={() => {
          setLoading(false);
          setError(true);
        }}
        loading="lazy"
      />
      
      {error && <div className="image-error">📷</div>}
    </div>
  );
}
```

### 2. Responsive Images

```css
.answer-image {
  width: 100%;
  max-width: 64px;
  height: auto;
  aspect-ratio: 1 / 1;
  object-fit: cover;
}

@media (min-width: 768px) {
  .answer-image {
    max-width: 80px;
  }
}
```

### 3. Accessibility

```jsx
<label className="answer-option">
  <input
    type="radio"
    name={question.id}
    value={answer.answer_value}
    aria-label={answer.answer_text}
  />
  
  {answer.answer_metadata?.image && (
    <img
      src={getImageUrl(answer.answer_metadata.image)}
      alt={answer.answer_text}
      role="presentation"
      loading="lazy"
    />
  )}
  
  <span>{answer.answer_text}</span>
</label>
```

### 4. Fallback for Missing Images

```jsx
function AnswerOption({ answer }) {
  const hasImage = answer.answer_metadata?.image;
  
  return (
    <label className="answer-option">
      <input type="radio" value={answer.answer_value} />
      
      {hasImage ? (
        <img
          src={getImageUrl(answer.answer_metadata.image)}
          alt={answer.answer_text}
          className="answer-image"
        />
      ) : (
        <div className="answer-placeholder">
          <span className="placeholder-icon">📄</span>
        </div>
      )}
      
      <span>{answer.answer_text}</span>
    </label>
  );
}
```

---

## Image URL Format

All image URLs follow this format:
```
/uploads/question-answers/{timestamp}-{random-hash}.{extension}
```

Example:
```
/uploads/question-answers/1699876543210-a1b2c3d4e5f6g7h8.jpg
```

To construct the full URL:
```javascript
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';
const fullImageUrl = `${API_BASE_URL}${imagePath}`;
```

---

## Summary

✅ **Client endpoints already return images** - No backend changes needed  
✅ **Images in `answer_metadata.image`** - Check this field for image URLs  
✅ **Optional field** - Not all answers have images  
✅ **Lazy loading recommended** - Use `loading="lazy"` attribute  
✅ **Responsive design** - Adapt image sizes for different screens  
✅ **Accessibility** - Include proper alt text and ARIA labels  

For more details, see the [Complete API Documentation](./api/CLIENT_API_DOCUMENTATION.md).
