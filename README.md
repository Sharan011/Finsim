# 🎮 FinSim - Personal Financial Simulation Game

[![React](https://img.shields.io/badge/React-18.0-blue.svg)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-16.0-green.svg)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.18-lightgrey.svg)](https://expressjs.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

**FinSim** is an interactive personal finance simulation game that teaches players financial literacy through real-world scenarios. Players must balance work, happiness, fitness, and expenses to achieve financial goals within a 21-day time limit.

![FinSim Demo](https://via.placeholder.com/800x400?text=FinSim+Game+Screenshot)

## 🌟 Features

### 🎯 **Core Gameplay**

- **Strategic Resource Management**: Balance money, happiness, and fitness
- **Time-based Challenges**: 21-day time limit creates urgency
- **Multiple Victory Paths**: Various strategies to achieve success
- **Real-world Scenarios**: Realistic financial decisions and consequences

### 🏢 **Interactive Locations**

- **🏠 Home**: Rest, pay rent, and advance time
- **💼 Work (MNC)**: Earn money based on performance
- **🏋️ Planet Fitness**: Improve fitness and happiness
- **🍻 Downtown Pub**: Socialize and boost happiness
- **🗼 CN Tower**: Sightseeing and entertainment
- **🛍️ Westfield Mall**: Shopping with strategic item categories

### 💡 **Advanced Mechanics**

- **Performance-based Pay**: Happiness and fitness affect work earnings
- **Skill Development**: Investment purchases provide permanent bonuses
- **Random Events**: Unexpected expenses and bonuses
- **Strategic Hints**: In-game guidance for optimal play
- **Multiple Endings**: Win/lose scenarios with specific feedback

### 🎨 **Modern UI/UX**

- **Glassmorphism Design**: Modern aesthetic with blur effects
- **Smooth Animations**: CSS keyframes and transitions
- **Responsive Design**: Mobile and desktop compatible
- **Professional Audio**: Sound effects for all interactions
- **Avatar System**: Gender-based character selection

## 🚀 Quick Start

### Prerequisites

- Node.js 16.0 or higher
- npm or yarn package manager

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/Sharan011/Finsim.git
   cd Finsim
   ```

2. **Install dependencies**

   ```bash
   # Install root dependencies
   npm install

   # Install backend dependencies
   cd backend
   npm install

   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

3. **Start the development servers**

   **Backend Server (Terminal 1)**

   ```bash
   cd backend
   npm start
   # Server runs on http://localhost:5000
   ```

   **Frontend Server (Terminal 2)**

   ```bash
   cd frontend
   npm start
   # Application runs on http://localhost:3000
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000` to start playing!

## 🎮 How to Play

### 📋 **Game Objectives**

- **Financial Goal**: Accumulate $3,000
- **Happiness Goal**: Achieve 80% happiness
- **Time Limit**: Complete within 21 days
- **Daily Expense**: Pay $30 rent each night

### 🏆 **Winning Strategies**

#### **The Optimizer Strategy** (Recommended)

1. **Build Stats**: Visit gym and pub to boost fitness and happiness above 70%
2. **Maximize Earnings**: Work when both stats are high to earn $410/day
3. **Manage Expenses**: Keep daily costs under $50
4. **Track Progress**: Monitor goal completion daily

#### **The Investor Strategy**

1. **Early Investment**: Buy skill development items at the mall
2. **Compound Returns**: Skill bonuses provide permanent work pay increases
3. **Long-term Focus**: Higher ceiling earnings over time

### 💰 **Income Breakdown**

```
Base Work Pay: $300
+ Happiness Bonus (70%+): $80
+ Fitness Bonus (70%+): $30
+ Skill Bonus (investments): $50
= Maximum Daily Earnings: $460
```

### 🏪 **Shopping Categories**

- **Essential Items**: Basic needs (low cost, moderate happiness)
- **Lifestyle & Fashion**: Confidence boosters (medium cost, high happiness)
- **Tech & Entertainment**: Modern conveniences (high cost, very high happiness)
- **Investment Items**: Skill development (medium cost, permanent bonuses)

## 🏗️ Technical Architecture

### **Frontend (React.js)**

```
frontend/
├── public/
│   ├── assets/          # Character images and audio files
│   └── buildings/       # Location background images
├── src/
│   ├── components/
│   │   └── Game.js      # Main game component
│   ├── App.css          # Modern styling with glassmorphism
│   ├── App.js           # Application root
│   └── index.js         # React entry point
└── package.json
```

### **Backend (Node.js/Express)**

```
backend/
├── src/
│   ├── events.js        # Random event system
│   ├── game.js          # Game logic and state management
│   ├── player.js        # Player data handling
│   └── index.js         # Express server setup
└── package.json
```

### **Key Technologies**

- **Frontend**: React 18, Modern CSS, HTML5 Audio API
- **Backend**: Node.js, Express.js, CORS
- **Styling**: CSS3 with backdrop-filter, keyframe animations
- **State Management**: React hooks (useState)
- **Audio**: Web Audio API for sound effects

## 🎨 Design System

### **Color Palette**

- **Primary**: Glassmorphism with rgba backgrounds
- **Success**: #10b981 (Green for money)
- **Warning**: #f59e0b (Orange for time/alerts)
- **Info**: #3b82f6 (Blue for tips)
- **Accent**: #8b5cf6 (Purple for strategy hints)

### **Typography**

- **Primary Font**: 'Montserrat', 'Inter', Arial, sans-serif
- **Headers**: Bold, large sizes for impact
- **Body**: Medium weight, optimized for readability

### **Animations**

- **Scene Transitions**: 1.5s fade effects
- **Button Interactions**: Hover and click animations
- **Status Updates**: Pulse effects for money changes
- **Background Elements**: Floating animations

## 🧪 Game Balance & Testing

### **Economic Balance**

- **Starting Money**: $400 (challenging but not impossible)
- **Daily Rent**: $30 (significant but manageable)
- **Work Efficiency**: Peak earnings require stat management
- **Random Events**: 8 different events with balanced probabilities

### **Difficulty Curve**

- **Days 1-7**: Learning phase, building understanding
- **Days 8-14**: Strategy execution, stat optimization
- **Days 15-21**: Final push, goal achievement

### **Testing Scenarios**

- **Optimal Play**: Achievable in 15-18 days
- **Casual Play**: Achievable in 19-21 days
- **Poor Strategy**: Results in failure, educational value

## 🚀 Deployment

### **Production Build**

```bash
# Build frontend
cd frontend
npm run build

# Start production backend
cd ../backend
npm start
```

### **Environment Variables**

```env
NODE_ENV=production
PORT=5000
FRONTEND_URL=http://localhost:3000
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Sound Effects**: Various royalty-free audio sources
- **Character Assets**: Custom designed avatars
- **Building Images**: Toronto-themed location graphics
- **Design Inspiration**: Modern financial apps and games

## 📞 Contact

**Developer**: Sharan011  
**GitHub**: [@Sharan011](https://github.com/Sharan011)  
**Project Link**: [https://github.com/Sharan011/Finsim](https://github.com/Sharan011/Finsim)

---

⭐ **Star this repository if you found it helpful!**
