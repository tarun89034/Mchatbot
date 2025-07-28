# MindfulChat - AI-Powered Mental Health Support

![Mental Health Chatbot](https://img.shields.io/badge/Purpose-Mental%20Health%20Support-blue)
![React](https://img.shields.io/badge/React-18.3.1-blue?logo=react)
![FastAPI](https://img.shields.io/badge/FastAPI-0.104.1-green?logo=fastapi)
![Python](https://img.shields.io/badge/Python-3.8+-blue?logo=python)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5.3-blue?logo=typescript)

MindfulChat is an innovative AI-powered mental health support application that provides compassionate, intelligent conversation and emotional support through advanced machine learning technologies. Built with a focus on privacy, security, and therapeutic effectiveness, this platform offers 24/7 accessible mental health assistance.

## ✨ Features

### 🤖 AI-Powered Conversational Support
- **SerenAI Chatbot Companion**: Intelligent conversational AI trained on mental health support patterns
- **Emotion Analysis**: Real-time emotion detection using DistilRoBERTa and advanced NLP models
- **Sentiment Monitoring**: Continuous sentiment analysis to gauge user emotional state
- **Context-Aware Responses**: Maintains conversation context for meaningful, personalized interactions

### 🔐 Security & Authentication
- **Secure JWT Authentication**: Industry-standard token-based authentication
- **Encrypted Data Storage**: All sensitive data encrypted using bcrypt
- **CORS Protection**: Comprehensive cross-origin resource sharing security
- **Rate Limiting**: Protection against API abuse and spam

### 💬 Real-Time Communication
- **WebSocket Support**: Instant messaging with real-time response capabilities
- **Live Chat Interface**: Seamless, responsive chat experience
- **Message History**: Persistent conversation storage and retrieval
- **Typing Indicators**: Real-time feedback for enhanced user experience

### 📊 Mood Tracking & Analytics
- **Daily Mood Logging**: Track emotional patterns and mental health trends
- **Emotional Analytics**: Visual charts and insights into mood patterns
- **Progress Monitoring**: Long-term mental health journey tracking
- **Personalized Reports**: Generated insights based on user interaction patterns

### 🚨 Crisis Detection & Intervention
- **Crisis Keyword Detection**: Automated identification of crisis indicators
- **Escalation Protocols**: Immediate intervention and resource provision
- **Emergency Resource Access**: Quick access to crisis hotlines and professional help
- **Safety Planning**: Collaborative safety plan development and management

### 🎯 Personalized Coping Strategies
- **Adaptive Recommendations**: AI-driven coping strategy suggestions
- **Mindfulness Exercises**: Guided meditation and breathing exercises
- **Resource Library**: Curated mental health resources and tools
- **Goal Setting**: Personal mental health goal tracking and achievement

## 🛠️ Technology Stack

### Frontend
- **React 18.3.1**: Modern UI library with hooks and functional components
- **TypeScript 5.5.3**: Type-safe development with enhanced IDE support
- **Vite**: Fast build tool and development server
- **Tailwind CSS**: Utility-first CSS framework for rapid styling
- **React Router**: Client-side routing for single-page application
- **Axios**: HTTP client for API communication
- **Recharts**: Data visualization for mood analytics

### Backend
- **FastAPI 0.104.1**: High-performance Python web framework
- **Python 3.8+**: Modern Python with async/await support
- **SQLAlchemy 2.0.23**: Advanced ORM for database operations
- **SQLite**: Lightweight, file-based database for development
- **Uvicorn**: ASGI server for production deployment

### AI/ML & NLP
- **Transformers 4.35.2**: Hugging Face transformer models
- **PyTorch 2.2.0+**: Deep learning framework for AI models
- **NLTK 3.8.1**: Natural language processing toolkit
- **DistilRoBERTa**: Emotion classification model
- **TextBlob**: Sentiment analysis and text processing
- **scikit-learn**: Machine learning utilities and algorithms

### Real-time & Security
- **WebSockets 12.0**: Real-time bidirectional communication
- **JWT (python-jose)**: JSON Web Token authentication
- **bcrypt (passlib)**: Password hashing and security
- **CORS Middleware**: Cross-origin resource sharing protection
- **Rate Limiting (slowapi)**: API abuse prevention

## 🏗️ Architecture Overview

MindfulChat follows a modern full-stack architecture with clear separation of concerns:

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   AI/ML         │
│   (React/TS)    │◄──►│   (FastAPI)     │◄──►│   Services      │
│                 │    │                 │    │                 │
│ • User Interface│    │ • REST API      │    │ • Emotion       │
│ • State Mgmt    │    │ • WebSockets    │    │   Analysis      │
│ • Routing       │    │ • Authentication│    │ • Sentiment     │
│ • Components    │    │ • Database      │    │   Detection     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🚀 Installation and Setup

### Prerequisites
- **Python 3.8+** (recommended: Python 3.9 or higher)
- **Node.js 16+** and **npm**
- **Git** for version control

### Backend Setup

1. **Navigate to the backend directory:**
   ```bash
   cd Mental_health_chatbot-main/backend/backend
   ```

2. **Create and activate a virtual environment:**
   ```bash
   python -m venv venv
   
   # On Windows:
   venv\Scripts\activate
   
   # On macOS/Linux:
   source venv/bin/activate
   ```

3. **Install Python dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Download required NLTK data:**
   ```bash
   python -c "import nltk; nltk.download('punkt'); nltk.download('vader_lexicon')"
   ```

5. **Set up environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

6. **Initialize the database:**
   ```bash
   python run.py --init-db
   ```

7. **Start the backend server:**
   ```bash
   python run.py
   # Or for development:
   uvicorn app:app --reload --host 0.0.0.0 --port 8000
   ```

### Frontend Setup

1. **Navigate to the project root:**
   ```bash
   cd Mental_health_chatbot-main
   ```

2. **Install Node.js dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Build for production:**
   ```bash
   npm run build
   ```

The application will be available at:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs

## 📚 API Documentation

### Key Endpoints

#### Authentication
- `POST /auth/register` - User registration
- `POST /auth/login` - User authentication
- `POST /auth/refresh` - Token refresh

#### Chat System
- `POST /chat/send` - Send chat message
- `GET /chat/history` - Retrieve chat history
- `WebSocket /chat/ws/{user_id}` - Real-time chat connection

#### Mood Tracking
- `POST /mood/entry` - Log mood entry
- `GET /mood/analytics` - Get mood analytics
- `GET /mood/trends` - Retrieve mood trends

#### User Management
- `GET /user/profile` - User profile information
- `PUT /user/profile` - Update user profile
- `GET /user/settings` - User preferences

### WebSocket Connection

Connect to real-time chat using WebSocket:
```javascript
const ws = new WebSocket(`ws://localhost:8000/chat/ws/${userId}`);
ws.onmessage = (event) => {
    const message = JSON.parse(event.data);
    // Handle incoming message
};
```

### Swagger UI
Comprehensive API documentation is available at `/docs` when the backend server is running.

## 🎯 Features in Detail

### SerenAI Chatbot Companion
SerenAI is the core conversational AI that provides:
- Empathetic responses based on user emotional state
- Therapeutic conversation patterns
- Crisis intervention capabilities
- Personalized coping strategy recommendations
- Contextual memory for ongoing conversations

### Emotion Detection and Sentiment Analysis
The ML service provides real-time analysis including:
- **Emotion Classification**: Joy, sadness, anger, fear, anxiety, optimism
- **Sentiment Scoring**: Positive, negative, neutral with confidence levels
- **Crisis Detection**: Automatic identification of concerning language patterns
- **Mood Pattern Recognition**: Long-term emotional trend analysis

### Crisis Intervention System
Automated safety protocols include:
- Real-time crisis keyword detection
- Immediate escalation to crisis resources
- Emergency contact integration
- Safety plan activation
- Professional referral pathways

### Mood Tracking Capabilities
Comprehensive mood monitoring features:
- Daily mood logging with multiple dimensions
- Visual analytics and trend charts
- Correlation analysis with chat sentiment
- Progress tracking over time
- Personalized insights and recommendations

## 🔒 Security and Privacy

### Data Protection Measures
- **End-to-End Encryption**: All sensitive data encrypted in transit and at rest
- **Minimal Data Collection**: Only essential information collected
- **Secure Authentication**: JWT tokens with secure expiration policies
- **Input Validation**: Comprehensive data sanitization and validation
- **CORS Protection**: Restricted cross-origin access

### Privacy-First Design
- **Local Data Storage**: Option for local-only data processing
- **Anonymization**: Personal identifiers removed from analytics
- **Consent Management**: Clear consent mechanisms for data usage
- **Right to Delete**: Complete data removal capabilities

### Crisis Escalation Protocols
- **Professional Oversight**: Integration with licensed mental health professionals
- **Emergency Services**: Direct connection to crisis hotlines
- **Family/Friend Notification**: Emergency contact systems
- **Documentation**: Secure incident logging and reporting

## 📖 Usage Guide

### Getting Started
1. **Create Account**: Register with email and secure password
2. **Complete Onboarding**: Set preferences and initial mood assessment
3. **Start Chatting**: Begin conversation with SerenAI
4. **Track Mood**: Log daily mood entries for pattern analysis
5. **Explore Resources**: Access coping strategies and mental health tools

### Chat Interface Features
- **Real-time Messaging**: Instant responses from AI companion
- **Emotion Indicators**: Visual feedback on detected emotions
- **Conversation History**: Access to past conversations
- **Crisis Mode**: Immediate help options when needed
- **Export Conversations**: Download chat history for personal records

### Mood Tracking Workflow
1. **Daily Check-ins**: Regular mood logging prompts
2. **Emotional Dimensions**: Rate multiple aspects of mental state
3. **Pattern Recognition**: AI identifies trends and triggers
4. **Insights Generation**: Personalized mental health insights
5. **Goal Setting**: Collaborative goal setting and tracking

## 👩‍💻 Development

### Project Structure
```
Mental_health_chatbot-main/
├── src/                    # Frontend React application
│   ├── components/         # Reusable UI components
│   ├── pages/             # Main application pages
│   ├── contexts/          # React context providers
│   ├── hooks/             # Custom React hooks
│   └── types/             # TypeScript type definitions
├── backend/backend/       # FastAPI backend application
│   ├── models/            # Database models and schemas
│   ├── services/          # Business logic services
│   ├── utils/             # Utility functions
│   └── app.py             # Main FastAPI application
├── package.json           # Frontend dependencies
└── README.md              # Project documentation
```

### Contributing Guidelines
1. **Fork the Repository**: Create your own fork for development
2. **Feature Branches**: Create branches for new features (`feature/feature-name`)
3. **Code Standards**: Follow existing code style and formatting
4. **Testing**: Write tests for new functionality
5. **Documentation**: Update documentation for code changes
6. **Pull Requests**: Submit PRs with clear descriptions and screenshots

### Code Style and Standards
- **Frontend**: ESLint + Prettier for consistent formatting
- **Backend**: PEP 8 Python style guide
- **TypeScript**: Strict type checking enabled
- **Comments**: Clear, concise documentation for complex logic
- **Git Commits**: Conventional commit message format

### Development Scripts
```bash
# Frontend development
npm run dev          # Start development server
npm run build        # Build for production
npm run lint         # Run ESLint
npm run preview      # Preview production build

# Backend development
python run.py        # Start backend server
pytest               # Run tests
black .              # Format code
mypy .              # Type checking
```

## ⚖️ Ethical Considerations

### Mental Health Support Limitations
- **Not a Replacement**: Does not replace professional therapy or medical treatment
- **Crisis Situations**: Encourages immediate professional help for crisis situations
- **Educational Purpose**: Provides supportive information and coping strategies
- **Therapeutic Supplement**: Designed to complement, not replace, professional care

### Professional Referral Pathways
- **Licensed Therapist Directory**: Integration with professional mental health providers
- **Crisis Hotline Access**: Direct links to suicide prevention and crisis resources
- **Emergency Services**: Clear pathways to emergency mental health services
- **Collaborative Care**: Designed to work alongside professional treatment plans

### Data Privacy and Consent
- **Informed Consent**: Clear explanation of data usage and AI processing
- **Granular Permissions**: User control over data sharing and analysis
- **Withdrawal Rights**: Easy opt-out and data deletion mechanisms
- **Transparency**: Open about AI capabilities and limitations

### Regulatory Compliance Notes
- **HIPAA Considerations**: Designed with healthcare privacy standards in mind
- **FDA Guidelines**: Follows software as medical device considerations
- **Accessibility**: WCAG 2.1 AA compliance for inclusive design
- **Age Restrictions**: Appropriate safeguards for minor users

## 📄 License and Disclaimer

### Educational and Therapeutic Support Purpose
This software is developed for educational and supportive purposes in mental health care. It is designed to provide:
- Emotional support and companionship
- Mood tracking and self-awareness tools
- Coping strategy recommendations
- Crisis resource access and intervention

### Healthcare Regulation Compliance
**Important Disclaimers:**
- This application is not intended to diagnose, treat, cure, or prevent any mental health condition
- Always consult with qualified healthcare professionals for clinical decisions
- In case of emergency or crisis, contact emergency services immediately
- This tool supplements but does not replace professional mental health care

### Development and Contribution
This project is open for educational and research purposes. Contributors are expected to:
- Maintain ethical standards in mental health technology
- Respect user privacy and data protection requirements
- Follow evidence-based approaches to mental health support
- Collaborate responsibly with mental health professionals

---

## 🆘 Emergency Resources

If you or someone you know is in crisis, please reach out immediately:

**United States:**
- National Suicide Prevention Lifeline: 988
- Crisis Text Line: Text HOME to 741741

**International:**
- International Association for Suicide Prevention: https://www.iasp.info/resources/Crisis_Centres/
- Befrienders Worldwide: https://www.befrienders.org/

**Remember: You are not alone, and help is always available.**

---

## 🤝 Support and Contact

For technical support, feature requests, or collaboration opportunities:
- **Issues**: [GitHub Issues](https://github.com/tarun89034/Mchatbot/issues)
- **Discussions**: [GitHub Discussions](https://github.com/tarun89034/Mchatbot/discussions)
- **Email**: [Contact the development team]

---

*Built with ❤️ for mental health awareness and support*