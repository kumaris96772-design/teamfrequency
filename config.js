import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, addDoc, collection, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyCJqo6vYXJkfTR97neanm6738V1dRxR-2c",
  authDomain: "elite-studeo.firebaseapp.com",
  databaseURL: "https://elite-studeo-default-rtdb.firebaseio.com",
  projectId: "elite-studeo",
  storageBucket: "elite-studeo.firebasestorage.app",
  messagingSenderId: "880354454806",
  appId: "1:880354454806:web:b4b0e035a241a87fffb437"
};
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const WM_PATH = 'watermark.png';

// --- NEW: GLOBAL ACTIVITY LOGGER ---
export async function logActivity(user, action, target) {
    await addDoc(collection(db, "activity_logs"), {
        user: user,
        action: action, // "ADDED", "REMOVED", "EDITED"
        target: target,
        timestamp: serverTimestamp()
    });
}

// --- UNIVERSAL WATERMARK (Used in Admin & Public) ---
export async function applyEliteWatermark(canvasId, imageURL) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const img = new Image(); const logo = new Image();
    img.crossOrigin = "anonymous"; img.src = imageURL; logo.src = WM_PATH;
    return new Promise((resolve) => {
        img.onload = () => {
            canvas.width = img.width; canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
            logo.onload = () => {
                const w = img.width * 0.15; const h = (logo.height / logo.width) * w;
                ctx.globalAlpha = 0.7;
                ctx.drawImage(logo, canvas.width - w - 40, canvas.height - h - 40, w, h);
                resolve();
            };
        };
    });
}