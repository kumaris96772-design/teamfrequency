import { db } from './config.js';
import { doc, onSnapshot, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Init Scroll Animations
AOS.init({ duration: 1200, once: true });

// --- DATA SYNCING ---
// Headline & Subtext sync
onSnapshot(doc(db, "settings", "index"), (s) => {
    if(s.exists()){
        const d = s.data();
        if(document.getElementById('live-h1')) document.getElementById('live-h1').innerHTML = d.h1;
        if(document.getElementById('live-p')) document.getElementById('live-p').innerText = d.p;
        if(document.getElementById('live-s1')) document.getElementById('live-s1').innerText = d.s1;
        if(document.getElementById('live-s2')) document.getElementById('live-s2').innerText = d.s2;
    }
});

// Style API sync
onSnapshot(doc(db, "settings", "global_styles"), (s) => {
    if(s.exists()){
        const d = s.data();
        document.documentElement.style.setProperty('--purple', d.color);
        document.body.style.fontFamily = d.font;
    }
});

// --- STUDIO CLICKER MINI GAME ---
let xp = 0;
window.addXP = () => {
    xp += 10;
    const counter = document.getElementById('xp-count');
    const msg = document.getElementById('game-msg');
    
    if(counter) counter.innerText = xp;
    
    if(xp === 100) msg.innerText = "Rookie Signal established!";
    if(xp === 500) msg.innerText = "Frequency Master unlocked!";
    if(xp === 1000) {
        msg.innerText = "ELITE LEGEND STATUS!";
        msg.style.color = "var(--yellow)";
    }
}

// --- ORDER PROPOSAL FORM ---
const form = document.getElementById('orderForm');
if(form) {
    form.onsubmit = async (e) => {
        e.preventDefault();
        const btn = e.target.querySelector('button');
        const status = document.getElementById('status');
        
        btn.innerText = "TRANSMITTING DATA...";
        btn.disabled = true;

        try {
            await addDoc(collection(db, "orders"), {
                name: document.getElementById('o-name').value,
                contact: document.getElementById('o-contact').value,
                service: document.getElementById('o-service').value,
                message: document.getElementById('o-msg').value,
                timestamp: serverTimestamp(),
                status: "New"
            });
            
            status.innerText = "✅ DATA RECEIVED. CORE TEAM WILL RESPOND SHORTLY.";
            form.reset();
        } catch (err) {
            status.innerText = "❌ ERROR: " + err.message;
        } finally {
            btn.innerText = "Transmit Data Packet";
            btn.disabled = false;
        }
    };
}