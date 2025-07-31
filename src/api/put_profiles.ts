import { GameData } from '../data/GameData.ts'

const API_TOKEN = GameData.apiToken
const API_BASE_URL = GameData.apiBaseUrl

export async function putProfile(profileData: { title: string }) {
  try {
    const response = await fetch(`${API_BASE_URL}/profiles`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(profileData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to update user profile:', error);
    throw error;
  }
}