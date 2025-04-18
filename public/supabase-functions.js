import { supabase } from './supabase.js';

// 🧵 Neuen Thread (Chat) erstellen
export async function createThread(userId, title = "Neuer Chat") {
  const { data, error } = await supabase
    .from('threads')
    .insert([{ user_id: userId, title }])
    .select()
    .single();

  if (error) {
    console.error("❌ createThread Error:", error);
    throw error;
  }
  return data;
}

// 💬 Nachricht speichern
export async function saveMessage(threadId, role, content) {
  const { error } = await supabase
    .from('messages')
    .insert([{ thread_id: threadId, role, content }]);

  if (error) {
    console.error("❌ saveMessage Error:", error);
    throw error;
  }
}

// 📜 Nachrichten zu einem Thread laden
export async function loadMessages(threadId) {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('thread_id', threadId)
    .order('created_at', { ascending: true });

  if (error) {
    console.error("❌ loadMessages Error:", error);
    throw error;
  }
  return data;
}

// 📚 Alle Threads eines Nutzers laden
export async function loadThreads(userId) {
  const { data, error } = await supabase
    .from('threads')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error("❌ loadThreads Error:", error);
    throw error;
  }
  return data;
}
