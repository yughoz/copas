import AsyncStorage from "@react-native-async-storage/async-storage";
// import 'react-native-url-polyfill/auto'
import { createClient } from "@supabase/supabase-js";

// Better put your these secret keys in .env file
console.log('process.env.EXPO_PUBLIC_SUPABASE_URL', process.env.EXPO_PUBLIC_SUPABASE_URL);
export const supabase = createClient(process.env.EXPO_PUBLIC_SUPABASE_URL, process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY, {
  localStorage: AsyncStorage as any,
  detectSessionInUrl: false // Prevents Supabase from evaluating window.location.href, breaking mobile
});