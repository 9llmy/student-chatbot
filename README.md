# Student Chatbot 🤖🎓

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![OpenAI Powered](https://img.shields.io/badge/Powered%20by-OpenAI-412991.svg)](https://platform.openai.com/)

An AI-powered chatbot designed to assist students with academic queries and course-related questions. Features real-time interaction, conversation history, and personalized responses based on study tracks.

## ✨ Key Features
- **Intelligent Q&A** - GPT-powered academic assistance
- **Track-based Personalization** - Tailored responses for scientific/literary tracks
- **Conversation History** - MongoDB-backed chat history
- **Real-time Interaction** - Socket.IO powered communication
- **Responsive UI** - Mobile-friendly interface

## 🛠 Tech Stack
| Frontend          | Backend         | AI/DB            |
|-------------------|-----------------|------------------|
| React             | Node.js         | OpenAI API       |
| Tailwind CSS      | Express.js      | MongoDB          |
| Socket.IO Client  | Socket.IO Server| Mongoose ODM     |

## 🚀 Quick Setup

## How to Run

1. Clone the repo  
2. Install dependencies:
   ```
   npm install
   ```
3. Start the server:
   ```
   node server.js
   ```
4. Visit: `http://localhost:3000`

## Data Structure

All college data is stored as JSON in the `data/` folder. Example:
```json
{
  "colleges": [
    {
      "college_id": "C001",
      "name_ar": "كلية الهندسة",
      "students_satisfaction": 88,
      ...
    }
  ]
}
```

## API

- `POST /ask`: Ask any question about a specific college
- `GET /colleges`: Get list of available colleges

## License

MIT © 2025
