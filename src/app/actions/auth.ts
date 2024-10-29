'use server'

import axiosInstance from "@/lib/axiosInstance";

export async function getGoogleAuthURL() {
  try {
    const { data } = await axiosInstance.get('/auth/oauth/google')
    return data.url;
  } catch (error) {
    console.error('Error getting Google URL:', error);
    throw error;
  }
}