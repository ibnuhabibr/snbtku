// src/lib/supabaseClient.ts

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://aitpdxyryctwdsdnoezd.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFpdHBkeHlyeWN0d2RzZG5vZXpkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQyMzUxMDIsImV4cCI6MjA2OTgxMTEwMn0.h2HluwIKTpVfKmhXGq5jhAKLfb3nEbnHi4IRy7iQPU8'

// Validate Supabase configuration in production
if (import.meta.env.PROD) {
  if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
    throw new Error('Missing required Supabase environment variables: VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY');
  }
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Helper functions untuk storage
export const uploadFile = async (bucket: string, path: string, file: File) => {
  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file)
    
    if (error) throw error
    return data
  } catch (error) {
    console.error('Error uploading file:', error)
    throw error
  }
}

export const downloadFile = async (bucket: string, path: string) => {
  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .download(path)
    
    if (error) throw error
    return data
  } catch (error) {
    console.error('Error downloading file:', error)
    throw error
  }
}

export const deleteFile = async (bucket: string, path: string) => {
  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .remove([path])
    
    if (error) throw error
    return data
  } catch (error) {
    console.error('Error deleting file:', error)
    throw error
  }
}

export const getPublicUrl = (bucket: string, path: string) => {
  const { data } = supabase.storage
    .from(bucket)
    .getPublicUrl(path)
  
  return data.publicUrl
}