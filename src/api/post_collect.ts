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

    const body = await response.json();

    return {
      ok: response.ok,
      status: response.status,
      body: body
    };

  } catch (error) {
    console.error('Failed to post collect data:', error);
  }
}