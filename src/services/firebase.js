import { Capacitor } from '@capacitor/core';
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  initializeAuth,
  indexedDBLocalPersistence,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
} from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc, updateDoc, addDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { firebaseConfig } from '../config.js';

const app = initializeApp(firebaseConfig);

// IMPORTANTE: en Capacitor (Android) getAuth() puede quedarse colgado.
// Se debe usar initializeAuth con indexedDBLocalPersistence.
const auth = Capacitor.isNativePlatform()
  ? initializeAuth(app, { persistence: indexedDBLocalPersistence })
  : getAuth(app);
const db = getFirestore(app);

let listener = null;
let registering = false;

async function loadProfile(u) {
  try {
    const snap = await getDoc(doc(db, 'users', u.uid));
    if (snap.exists()) return { uid: u.uid, email: u.email, ...snap.data() };
  } catch (e) {
    console.warn('No se pudo leer el perfil', e);
  }
  return { uid: u.uid, email: u.email, nombre: u.displayName || (u.email || '').split('@')[0], rol: 'usuario' };
}

export function onAuth(cb) {
  listener = cb;
  return onAuthStateChanged(auth, async (u) => {
    if (registering) return;
    cb(u ? await loadProfile(u) : null);
  });
}

export async function register({ nombre, email, password, telefono, institucion }) {
  registering = true;
  try {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(cred.user, { displayName: nombre });
    const profile = {
      nombre,
      email,
      telefono: telefono || '',
      institucion: institucion || '',
      rol: 'usuario',
      creado: Date.now(),
    };
    await setDoc(doc(db, 'users', cred.user.uid), profile);
    const user = { uid: cred.user.uid, ...profile };
    if (listener) listener(user);
    return user;
  } finally {
    registering = false;
  }
}

export async function login(email, password) {
  const cred = await signInWithEmailAndPassword(auth, email, password);
  return loadProfile(cred.user);
}

export const logout = () => signOut(auth);
export const resetPassword = (email) => sendPasswordResetEmail(auth, email);

export async function updateProfileData(uid, { nombre, telefono, institucion }) {
  await updateDoc(doc(db, 'users', uid), { nombre, telefono, institucion });
  if (auth.currentUser) await updateProfile(auth.currentUser, { displayName: nombre });
}

export async function createTicket(user, d) {
  const now = Date.now();
  const data = {
    uid: user.uid,
    usuarioNombre: user.nombre,
    usuarioEmail: user.email,
    titulo: d.titulo,
    categoria: d.categoria,
    prioridad: d.prioridad,
    descripcion: d.descripcion,
    estado: 'abierto',
    respuesta: '',
    creado: now,
    actualizado: now,
  };
  const ref = await addDoc(collection(db, 'tickets'), data);
  return { id: ref.id, ...data };
}

const byDateDesc = (a, b) => (b.creado || 0) - (a.creado || 0);

export async function listMyTickets(uid) {
  const snap = await getDocs(query(collection(db, 'tickets'), where('uid', '==', uid)));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() })).sort(byDateDesc);
}

export async function listAllTickets() {
  const snap = await getDocs(collection(db, 'tickets'));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() })).sort(byDateDesc);
}

export async function updateTicket(id, { estado, respuesta }) {
  await updateDoc(doc(db, 'tickets', id), { estado, respuesta, actualizado: Date.now() });
}

export async function listUsers() {
  const snap = await getDocs(collection(db, 'users'));
  return snap.docs.map((d) => ({ uid: d.id, ...d.data() })).sort((a, b) => (b.creado || 0) - (a.creado || 0));
}
