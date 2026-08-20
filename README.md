# GearForge - AI-Powered PC Building & Peripheral Advisor

GearForge is a comprehensive, full-stack application designed to help Filipino PC builders and gamers optimize their hardware loadouts. Using advanced AI capabilities, real-time market data approximation, and a rich, interactive UI, it simplifies the process of configuring a PC build or gaming peripheral set.

## 🚀 Features
- **AI PC Builder & Loadout Planner:** Custom hardware recommendations utilizing Google's Gemini AI, specifically tuned for local (Philippines) e-commerce pricing and availability.
- **Smart Analytics & Predictions:** AI-driven FPS approximations across esports titles.
- **Durable User Accounts & State:** Uses Firebase Authentication for durable sessions, and Firestore to securely store user loadouts and reviews.
- **Tiered VIP Ecosystem:** Dynamic UI that adapts to a user's subscription tier (e.g. Free, Ad-Free, VIP) unlocking premium features such as price-drop graphs.
- **Real-Time Data Visualization:** Uses advanced UI components to visualize metrics (budget allocations, FPS scaling, etc.).
- **Dynamic Theming:** Seamlessly toggle between a premium "Gamer Dark" UI and a clean, responsive "Apple-inspired Light Mode".

## 🛠️ Architecture & Tech Stack
This project follows a modern monolithic full-stack architecture:

- **Frontend:** React 18, Vite, Tailwind CSS, Lucide Icons.
- **Backend:** Node.js, Express.js.
- **AI Integration:** Google GenAI SDK (Gemini models) running strictly on the backend to secure API credentials.
- **Database:** Firebase Firestore (NoSQL).
- **Authentication:** Firebase Auth with persistent, secure session management.

## 🔒 Security & Best Practices
- **API Key Security:** The `GEMINI_API_KEY` is completely hidden from the client-side, loaded strictly via server-side environment variables.
- **Database Protection:** Granular Firestore Security Rules ensure users can only modify their own profiles and loadouts. Admin-only endpoints protect global reporting mechanisms.
- **Clean Git History:** Environment variables and secrets are heavily excluded via `.gitignore` to prevent leakage.

## 💻 Local Setup Instructions

1. **Clone the repository:**
   \`\`\`bash
   git clone <your-repo-url>
   cd gearforge
   \`\`\`
2. **Install dependencies:**
   \`\`\`bash
   npm install
   \`\`\`
3. **Configure Environment Variables:**
   Create a \`.env\` file in the root directory and add the required keys (see \`.env.example\` for the schema).
   \`\`\`env
   GEMINI_API_KEY=your_gemini_api_key_here
   \`\`\`
4. **Run the development server:**
   \`\`\`bash
   npm run dev
   \`\`\`
   The server will start on port \`3000\`, bundling both the Express backend and the Vite frontend middleware.

## 🧠 Engineering Decisions
- **Express + Vite Middleware:** Used to create a unified development experience, eliminating cross-origin (CORS) complexities during local development while allowing for a seamless production build step.
- **NoSQL Schema Design:** Designed to optimize read times by denormalizing user references directly onto `loadout` and `review` documents.
- **Client-Side Firebase Initialization:** Configured securely with public keys and restricted via `firestore.rules` instead of using Firebase Admin.
