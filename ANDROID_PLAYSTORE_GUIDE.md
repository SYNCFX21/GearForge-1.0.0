# GamerBudget PH: Mobile APK & Google Play Store Guide

We have fully integrated **Capacitor** into your project! This is the modern, official industry-standard library developed by Ionic that wraps your React/Vite/TypeScript web application into a high-performance native Android application.

This guide provides step-by-step directions on how to open the code on your local computer, test it on your personal Android device, compile it into an **APK** (or a Google Play **AAB**), and configure secure Google Sign-In.

---

## 🚀 Step 1: Export the Project to Your Local PC
Since compiling a native Android APK requires the Android SDK, Gradle, and Java, you will perform the final build on your own PC or notebook:
1. Click the **Settings Menu** in Google AI Studio (cog icon in the top right).
2. Choose **Export as ZIP** (or export to your GitHub account).
3. Extract the ZIP file into a dedicated folder on your local computer.

---

## 🛠️ Step 2: Install Local Prerequisites
Ensure you have the following installed on your computer:
1. **Node.js** (LTS version recommended)
2. **Android Studio** (which automatically installs the Android SDK, command-line tools, and emulator)

---

## 💻 Step 3: Run the Local Build Commands
Open your terminal (PowerShell or Terminal) inside the extracted project folder, and run:

```bash
# 1. Install dependencies
npm install

# 2. Build the high-performance production assets
npm run build

# 3. Synchronize the built React code into the Android container
npm run cap:sync
```

---

## 📱 Step 4: Run & Test on Your Android Phone
To test the app directly on your physical Android phone:
1. Enable **USB Debugging** on your phone (Go to Settings > About Phone > Tap "Build Number" 7 times, then go to Developer Options and toggle "USB Debugging" ON).
2. Plug your phone into your computer via a USB cable.
3. Run the following command in your terminal:
   ```bash
   npx cap run android
   ```
4. Select your device from the list. The app will launch directly on your phone in standalone mobile mode!

---

## 🔑 Step 5: Configure Google Sign-In for Your APK
Because Google Sign-In validates requests based on your app's unique cryptographic signature (SHA-1 fingerprint), you must register your custom keys:
1. Open the `/android` folder inside **Android Studio**.
2. Click on the **Gradle tab** (usually on the far right edge of Android Studio).
3. Navigate to: `react-example > Tasks > android > signingReport` and double-click it.
4. Copy the **SHA-1** fingerprint displayed in the Gradle Console.
5. Go to your **Firebase Developer Console** or **Google Cloud Console**, open your project settings, and paste the SHA-1 fingerprint under your Android client ID configurations.
6. Download the updated `google-services.json` and place it in your local folder: `/android/app/google-services.json`.

---

## 📦 Step 6: Generate the APK or AAB for Google Play Store
When you are ready to upload the app to the Google Play Console:
1. In Android Studio, select **Build** from the top menu bar.
2. Click **Generate Signed Bundle / APK...**
3. Select **Android App Bundle (AAB)** (required by Google Play for all new submissions) or **APK** (for quick manual transfers).
4. Create a new **Keystore** (keep this file safe; you will need it for future app updates!).
5. Select the **Release** build variant and click **Finish**.
6. Once completed, your final signed `.aab` or `.apk` will be located under:
   `android/app/release/`

Now, you can log in to your **Google Play Console** developer account, create a new application, and upload your signed `.aab` bundle directly!
