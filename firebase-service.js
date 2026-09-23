import { db } from './firebase-config.js';
import { collection, addDoc, getDocs, doc, setDoc, getDoc, updateDoc, deleteDoc, query, where, arrayUnion } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// SHA-256 Password Hashing
export async function hashPassword(password) {
    if (window.crypto && window.crypto.subtle) {
        const encoder = new TextEncoder();
        const data = encoder.encode(password);
        const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    } else {
        // Fallback for local file:/// protocol testing
        let hash = 0;
        for (let i = 0; i < password.length; i++) {
            const char = password.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return Math.abs(hash).toString(16) + "fallback";
    }
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
        throw new Error("Bu numara veya e-posta ile zaten kayÄ±tlÄ± bir Ã¼ye var.");
    }

    const docRef = await addDoc(collection(db, "members"), {
        name: memberData.name,
        identifier: memberData.identifier,
        department: memberData.department,
        grade: memberData.grade || '',
        phone: memberData.phone || '',
        passwordHash: hashedPassword,
        role: 'Ã¼ye',
        registeredAt: new Date().toISOString()
    });
    
    return { id: docRef.id, name: memberData.name, role: 'Ã¼ye', identifier: memberData.identifier };
}

export async function loginMember(identifier, password) {
    const hashedPassword = await hashPassword(password);
    const q = query(collection(db, "members"), 
                    where("identifier", "==", identifier),
                    where("passwordHash", "==", hashedPassword));
    
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
        throw new Error("GiriÅŸ bilgileri hatalÄ± veya kayÄ±t bulunamadÄ±.");
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
        status: "DeÄŸerlendiriliyor",
        submittedAt: new Date().toISOString()
    });
}

// ========================
// ADMIN (BACKEND) LOGIC
// ========================

export async function registerAdmin(adminData) {
    const hashedPassword = await hashPassword(adminData.password);
    
    const q = query(collection(db, "admins"), where("email", "==", adminData.email));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
        throw new Error("Bu e-posta adresi ile kayıtlı bir hesap zaten mevcut.");
    }

    const docRef = await addDoc(collection(db, "admins"), {
        name: adminData.name,
        email: adminData.email,
        passwordHash: hashedPassword,
        role: "pending",
        requestedRole: adminData.requestedRole,
        status: "pending_approval",
        title: adminData.title,
        registeredAt: new Date().toISOString(),
        isMaster: false
    });
    
    return { id: docRef.id, name: adminData.name, email: adminData.email, status: "pending_approval" };
}

export async function loginAdmin(email, password) {
    if (email === "ilkerm946@gmail.com" && password === "ilker123") {
        return {
            id: "master_admin",
            name: "İlker",
            email: "ilkerm946@gmail.com",
            role: "superadmin",
            status: "active",
            title: "Topluluk Yöneticisi"
        };
    }

    const hashedPassword = await hashPassword(password);
    const q = query(collection(db, "admins"), 
                    where("email", "==", email),
                    where("passwordHash", "==", hashedPassword));
    
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
        throw new Error("E-posta veya şifre hatalı.");
    }
    
    const userDoc = querySnapshot.docs[0];
    const user = userDoc.data();
    
    if (user.status === "pending_approval") {
        throw new Error("NOT_APPROVED");
    }
    
    return { id: userDoc.id, ...user };
}

export async function getAdmins() {
    const querySnapshot = await getDocs(collection(db, "admins"));
    const admins = [];
    querySnapshot.forEach((doc) => {
        admins.push({ id: doc.id, ...doc.data() });
    });
    // Add Master Admin artificially so they appear in the Users tab
    admins.unshift({
        id: "master_admin",
        name: "İlker",
        email: "ilkerm946@gmail.com",
        role: "superadmin",
        status: "active",
        title: "Topluluk Yöneticisi",
        isMaster: true
    });
    return admins;
}

export async function approveAdmin(adminId, newRole, newTitle) {
    const adminRef = doc(db, "admins", adminId);
    await updateDoc(adminRef, {
        role: newRole,
        title: newTitle,
        status: "active"
    });
}

export async function deleteAdmin(adminId) {
    await deleteDoc(doc(db, "admins", adminId));
}

export async function getApplications() {
    const q = query(collection(db, "applications"));
    const snapshot = await getDocs(q);
    const apps = [];
    snapshot.forEach(doc => apps.push({ id: doc.id, ...doc.data() }));
    return apps.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));
}

export async function updateApplicationStatus(id, newStatus) {
    await updateDoc(doc(db, "applications", id), { status: newStatus });
}

export async function deleteApplication(id) {
    await deleteDoc(doc(db, "applications", id));
}

export async function getSuggestions() {
    const q = query(collection(db, "suggestions"));
    const snapshot = await getDocs(q);
    const suggs = [];
    snapshot.forEach(doc => suggs.push({ id: doc.id, ...doc.data() }));
    return suggs.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));
}

export async function updateSuggestionStatus(id, newStatus) {
    await updateDoc(doc(db, "suggestions", id), { status: newStatus });
}

export async function deleteSuggestion(id) {
    await deleteDoc(doc(db, "suggestions", id));
}
