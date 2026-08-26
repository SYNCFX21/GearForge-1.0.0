# GearForge Standing Instructions

Before making changes to this project, follow these rules — they're based on real mistakes this project has already made across multiple review rounds:

1. Never let a visual/animation feature become a single point of failure. Any WebGL or Canvas component (ogl, three.js, etc.) must be wrapped in error handling with a safe fallback (plain CSS background), and the app needs a React Error Boundary at the root so a component crash never takes down the whole screen. This is especially critical for the login screen and for the Android/Capacitor build, where WebGL support is less predictable than desktop browsers.

2. Privileged or gated fields (isVip, role, hasPermanentAdFree, isMuted, etc.) must always default to the least-privileged value (false / 'user') in every place they're constructed client-side, including temporary states before the real value loads. Never default to granted-until-proven-otherwise.

3. In firestore.rules, always use resource.data.get('field', default) instead of resource.data.field directly. Direct access throws an error if the field doesn't exist on the document, and Firestore silently treats that as a denied rule — this has broken the app twice already.

4. Never swallow an error that hides a failed write or failed operation. If a Firestore write, API call, or auth action fails, that failure must reach the user or the caller — don't just console.warn and continue as if it succeeded.

5. Never hardcode a specific person's email or identity into client-side authorization logic. It exposes that email in the public JS bundle and has no ownership verification — whoever registers that exact email first gets the privilege. Set privileged roles manually in the Firebase Console, or via a server-side Cloud Function, never in client code.

6. Keep API keys and secrets server-side only, in server.ts / environment variables — never in client code or VITE_-prefixed env vars (those get bundled into public JS). Any new backend endpoint that calls a paid API needs rate limiting from the start.

7. Any frontend fetch to the backend must use import.meta.env.VITE_API_URL as the base — never a bare relative path. This app is deployed across multiple domains and ships as a native Android app with no local server.

8. Test any change to firestore.rules, AuthGate.tsx, or saveUserProfileToGearForgeDB against both a brand-new account and an existing account. Some past bugs only affected one and not the other.

9. When given specific design values (exact colors, density, toggle states), apply them exactly as given rather than defaulting back to a library's demo/example values — especially for backgrounds sitting behind interactive UI like forms, where busy settings tuned for a marketing hero section are the wrong choice.

10. Before considering any change finished, check: does it touch a Firestore-rule-checked field? Does it touch a privileged field? Does it add a new API call? Does it add a new WebGL/visual component to a critical screen? Does it swallow any error silently? Each "yes" needs the corresponding safeguard above applied in the same change, not as a follow-up fix later.
