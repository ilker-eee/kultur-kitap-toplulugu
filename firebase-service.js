import { db } from './firebase-config.js';
import { collection, addDoc, getDocs, doc, setDoc, getDoc, updateDoc, query, where, arrayUnion } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// SHA-256 Password Hashing
export async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// ========================
// MEMBER (FRONTEND) LOGIC
// ========================

export async function registerMember(memberData) {
    // memberData = { name, identifier, department, password }
    const hashedPassword = await hashPassword(memberData.password);
    
    // Check if member already exists
    const q = query(collection(db, "members"), where("identifier", "==", memberData.identifier));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
        throw new Error("Bu numara veya e-posta ile zaten kayıtlı bir üye var.");
    }

    const docRef = await addDoc(collection(db, "members"), {
        name: memberData.name,
        identifier: memberData.identifier,
        department: memberData.department,
        passwordHash: hashedPassword,
        role: 'üye',
        registeredAt: new Date().toISOString()
    });
    
    return { id: docRef.id, name: memberData.name, role: 'üye', identifier: memberData.identifier };
}

export async function loginMember(identifier, password) {
    const hashedPassword = await hashPassword(password);
    const q = query(collection(db, "members"), 
                    where("identifier", "==", identifier),
                    where("passwordHash", "==", hashedPassword));
    
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
        throw new Error("Giriş bilgileri hatalı veya kayıt bulunamadı.");
    }
    
    const docData = querySnapshot.docs[0];
    const data = docData.data();
    return { id: docData.id, name: data.name, role: data.role, identifier: data.identifier };
}

// ========================
// EVENTS LOGIC
// ========================

export async function getMembers() {
    const membersSnapshot = await getDocs(collection(db, "members"));
    const members = [];
    membersSnapshot.forEach((doc) => {
        members.push({ id: doc.id, ...doc.data() });
    });
    return members;
}

export async function deleteMember(memberId) {
    const { deleteDoc, doc } = await import("https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js");
    await deleteDoc(doc(db, "members", memberId));
}

export async function getEvents() {
    const eventsSnapshot = await getDocs(collection(db, "events"));
    const events = [];
    eventsSnapshot.forEach((doc) => {
        events.push({ id: doc.id, ...doc.data() });
    });
    return events;
}

export async function joinEvent(eventId, memberId) {
    const eventRef = doc(db, "events", eventId.toString());
    await updateDoc(eventRef, {
        participants: arrayUnion(memberId)
    });
}

// ========================
// APPLICATIONS & SUGGESTIONS
// ========================

export async function submitApplication(appData) {
    await addDoc(collection(db, "applications"), {
        ...appData,
        status: "Beklemede",
        submittedAt: new Date().toISOString()
    });
}

export async function submitSuggestion(suggData) {
    await addDoc(collection(db, "suggestions"), {
        ...suggData,
        status: "Değerlendiriliyor",
        submittedAt: new Date().toISOString()
    });
}

// ========================
// ADMIN LOGIC
// ========================

export async function loginAdmin(username, password) {
    const hashedPassword = await hashPassword(password);
    const q = query(collection(db, "admins"), 
                    where("username", "==", username),
                    where("passwordHash", "==", hashedPassword));
    
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
        throw new Error("Geçersiz yönetici bilgileri.");
    }
    
    const docData = querySnapshot.docs[0];
    const data = docData.data();
    return { id: docData.id, username: data.username, role: data.role };
}
