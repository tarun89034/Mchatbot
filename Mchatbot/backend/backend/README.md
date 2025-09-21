# Mchatbot Backend

A comprehensive AI-driven chatbot backend with emotion analysis, mood tracking, and crisis intervention.

## Features

- **User Authentication**: Secure JWT-based authentication
- **AI Chat**: LLM-powered conversational support with emotion analysis
- **Mood Tracking**: Comprehensive mood logging and analytics
- **Crisis Detection**: Automatic detection and escalation protocols
- **Coping Strategies**: Personalized therapeutic interventions
- **Real-time Support**: WebSocket support for live conversations

## Tech Stack

- **FastAPI**: Modern, fast web framework
- **SQLAlchemy**: Database ORM with SQLite
- **Transformers**: Hugging Face models for emotion analysis
- **NLTK**: Natural language processing toolkit
- **JWT**: Secure authentication tokens
- **WebSockets**: Real-time communication

## Installation

1. Install Python dependencies:
```bash
pip install -r requirements.txt
```

2. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. Initialize the database:
```bash
python -c "from models.database import init_db; init_db()"
```

4. Run the development server:
```bash
python app.py
```

The API will be available at `http://localhost:8000`

## API Documentation

- **Swagger UI**: `http://localhost:8000/docs`
- **ReDoc**: `http://localhost:8000/redoc`

## Key Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Chat
- `POST /api/chat/message` - Send message to chatbot
- `GET /api/chat/history` - Get chat history
- `WebSocket /ws/chat` - Real-time chat

### Mood Tracking
- `POST /api/mood/entry` - Create mood entry
- `GET /api/mood/history` - Get mood history
- `GET /api/mood/analytics` - Get mood analytics

## ML Models

The system uses several AI models:

1. **Emotion Detection**: DistilRoBERTa for emotion classification
2. **Sentiment Analysis**: VADER sentiment analyzer
3. **Crisis Detection**: Keyword-based with ML enhancement
4. **Response Generation**: Template-based with context awareness

## Security Features

- JWT token authentication
- Password hashing with bcrypt
- CORS protection
- Input validation and sanitization
- Crisis escalation protocols

## Database Schema

- **Users**: User accounts and preferences
- **Chat Messages**: Conversation history with emotion analysis
- **Mood Entries**: Daily mood tracking data
- **Coping Strategies**: Therapeutic interventions
- **User Progress**: Analytics and trends

## Production Deployment

1. Set environment to production in `.env`
2. Use a production database (PostgreSQL recommended)
3. Configure proper secret keys
4. Set up SSL/TLS certificates
5. Use a reverse proxy (nginx)
6. Configure logging and monitoring

## Ethical Considerations

- Data privacy and HIPAA compliance ready
- Crisis intervention protocols
- Clear limitations and disclaimers
- Professional referral pathways
- User consent and data protection

## Contributing

1. Follow the established code structure
2. Maintain separation of concerns
3. Add comprehensive error handling
4. Include logging for debugging
5. Test all endpoints thoroughly

## License

This project is designed for educational and therapeutic support purposes. Ensure compliance with relevant healthcare regulations in your jurisdiction.

## Running with Docker

1. Build the Docker image:
   ```sh
   docker build -t mchatbot-backend .
   ```
2. Run the container:
   ```sh
   docker run -p 8000:8000 mchatbot-backend
   ```

The backend will be available at http://localhost:8000