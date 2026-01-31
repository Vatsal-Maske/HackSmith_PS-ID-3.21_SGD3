# Firebase Authentication Setup Guide

## 🚀 Quick Setup Instructions

### 1. Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"**
3. Enter project name (e.g., "air-quality-dashboard")
4. Enable Google Analytics (optional)
5. Click **"Create project"**

### 2. Enable Google Authentication
1. In Firebase Console, go to **Authentication** → **Sign-in method**
2. Click **"Google"**
3. **Enable** Google Sign-In
4. Add your project email for support
5. Click **"Save"**

### 3. Get Firebase Configuration
1. In Firebase Console, go to **Project Settings** (⚙️ icon)
2. Scroll down to **"Your apps"** section
3. Click **Web app** (</> icon)
4. Copy the **firebaseConfig** object

### 4. Configure Environment Variables
1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Update `.env` with your Firebase configuration:
   ```env
   VITE_FIREBASE_API_KEY=your_actual_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

### 5. Enable Firestore Database
1. In Firebase Console, go to **Firestore Database**
2. Click **"Create database"**
3. Choose **"Start in test mode"** (for development)
4. Select a location (choose nearest to your users)
5. Click **"Create database"**

### 6. Run Your Application
```bash
# Start backend server
cd backend
npm start

# Start frontend development server
cd ..
npm run dev
```

## 🔧 Features Implemented

### ✅ Authentication System
- **Google Sign-In** with popup authentication
- **Sign-Out** functionality
- **User session management** with Firebase Auth
- **Protected routes** - only authenticated users can access the dashboard

### ✅ User Data Storage
- **Firestore integration** for user data persistence
- **User profile storage** (name, email, photo, preferences)
- **Real-time data synchronization**
- **User preferences** management

### ✅ Security Features
- **Environment variables** for sensitive configuration
- **Protected API endpoints** with authentication checks
- **Session management** with Firebase Auth tokens
- **Error handling** for authentication failures

### ✅ UI Components
- **Google Sign-In button** with proper styling
- **User profile display** with avatar support
- **Loading states** and error messages
- **Responsive design** for all screen sizes

## 📁 File Structure

```
src/
├── firebase/
│   ├── firebaseConfig.js      # Firebase configuration
│   └── firebaseService.js     # Authentication service
├── contexts/
│   └── AuthContext.jsx         # Authentication context
├── components/Auth/
│   ├── GoogleSignInButton.jsx  # Sign-in button component
│   ├── SignOutButton.jsx      # Sign-out button component
│   └── ProtectedRoute.jsx     # Route protection component
├── pages/
│   └── LoginPage.jsx           # Login page component
└── App.jsx                    # Main app with auth provider
```

## 🔍 How It Works

### 1. Authentication Flow
1. User clicks **"Sign in with Google"**
2. Firebase Auth opens Google Sign-In popup
3. User authenticates with Google
4. Firebase returns user credentials
5. User data is stored in Firestore
6. User is redirected to dashboard

### 2. Protected Routes
1. `ProtectedRoute` component checks authentication status
2. If not authenticated, shows `LoginPage`
3. If authenticated, renders protected content
4. Authentication state is managed by `AuthContext`

### 3. Data Storage
1. User signs in successfully
2. User data is automatically stored in Firestore
3. Data includes: uid, name, email, photo, preferences
4. Data is loaded on subsequent visits

## 🛠️ Customization

### Add More Authentication Providers
```javascript
// In firebaseService.js
import { FacebookAuthProvider, GithubAuthProvider } from 'firebase/auth';

const facebookProvider = new FacebookAuthProvider();
const githubProvider = new GithubAuthProvider();

// Add methods for Facebook and GitHub sign-in
async signInWithFacebook() { /* implementation */ }
async signInWithGithub() { /* implementation */ }
```

### Add User Roles
```javascript
// In Firestore user document
{
  uid: "user-uid",
  displayName: "John Doe",
  email: "john@example.com",
  role: "admin", // or "user", "moderator"
  permissions: ["read", "write", "delete"]
}
```

### Add Email Verification
```javascript
// In firebaseService.js
import { sendEmailVerification } from 'firebase/auth';

async sendVerificationEmail(user) {
  try {
    await sendEmailVerification(user);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
```

## 🔒 Security Best Practices

1. **Environment Variables**: Never commit `.env` file to version control
2. **Firestore Rules**: Set up proper security rules in production
3. **API Keys**: Use environment variables for all sensitive data
4. **User Validation**: Validate user input on both client and server
5. **Session Management**: Use Firebase Auth built-in session management

## 🐛 Troubleshooting

### Common Issues

1. **"auth/popup-blocked"**: Enable popups for your site
2. **"auth/network-request-failed"**: Check internet connection
3. **"auth/invalid-api-key"**: Verify Firebase configuration
4. **"permission-denied"**: Check Firestore security rules

### Debug Mode
Enable Firebase debug mode:
```javascript
// In firebaseConfig.js
if (import.meta.env.DEV) {
  connectAuthEmulator(auth, "http://localhost:9099");
}
```

## 📚 Additional Resources

- [Firebase Authentication Documentation](https://firebase.google.com/docs/auth)
- [Firestore Documentation](https://firebase.google.com/docs/firestore)
- [React Context API](https://reactjs.org/docs/context.html)
- [Firebase Security Rules](https://firebase.google.com/docs/firestore/security/get-started)

## 🎉 Next Steps

1. **Set up your Firebase project** following the instructions above
2. **Configure environment variables** in `.env` file
3. **Enable Firestore Database** in Firebase Console
4. **Test the authentication flow**
5. **Customize user profile fields** as needed
6. **Deploy to production** when ready

Your Air Quality Dashboard now has complete Firebase Authentication! 🚀
