import { GameData } from '../data/GameData.ts';

const API_TOKEN = GameData.apiToken;
const API_BASE_URL = GameData.apiBaseUrl;

interface PostCollectRequestBody {
  booth_id: string;
  x: number;
}

export async function postCollect(boothId: string, xCoordinate: number) {
  try {
    const requestBody: PostCollectRequestBody = {
      booth_id: boothId,
      x: xCoordinate,
    };

    const response = await fetch(`${API_BASE_URL}/collect`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      let errorBody = {};
      try {
        errorBody = await response.json();
      } catch (e) {
        errorBody = { message: await response.text() };
      }
      const error = new Error(`HTTP error! Status: ${response.status}`);
      (error as any).body = errorBody;
      throw error;
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to post collect data:', error);
    if ((error as any).body) {
      console.error('Error body:', (error as any).body);
    }
    throw error;
  }
}