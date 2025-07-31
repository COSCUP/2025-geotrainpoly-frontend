import { GameData } from '../data/GameData.ts'

const API_TOKEN = GameData.apiToken;
const API_BASE_URL = GameData.apiBaseUrl

export async function getUserProfile() {
  try {
    const response = await fetch(`${API_BASE_URL}/profiles`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${API_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to fetch user profile:', error);
    throw error;
  }
}