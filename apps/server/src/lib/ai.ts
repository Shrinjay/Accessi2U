import axios, { AxiosInstance } from 'axios';
import { AI_API_KEY, AI_BASE_URL, BACKEND_URL } from '../config/env.js';
import { AiSearchItem } from '../services/ai-search-item/to-isearchitem.js';

interface AIConfig {
  baseURL: string;
  apiKey: string;
  callback_url: string;
}

class AIClient {
  config: AIConfig;
  client: AxiosInstance;

  callback_url: string;
  max_entries_to_scrape: number = 5;

  constructor(config: AIConfig) {
    this.config = config;

    const { baseURL, apiKey, callback_url } = config;
    this.callback_url = callback_url;

    this.client = axios.create({
      baseURL,
      headers: {
        'content-type': 'application/json',
        'X-API-KEY': apiKey,
      },
    });
  }

  async scrape(query: string): Promise<{ jobId: string }> {
    const { data } = await this.client.post(`/scrape`, {
      query,
      callback_url: this.callback_url,
      max_entries_to_scrape: this.max_entries_to_scrape,
    });
    return data || {};
  }

  async getProduct(productId: string): Promise<AiSearchItem> {
    const { data } = await this.client.get(`/product/${productId}`);
    return data || {};
  }

  async listProducts(): Promise<AiSearchItem[]> {
    const { data } = await this.client.get(`/product`);
    return data || [];
  }
}

export const ai = new AIClient({
  baseURL: AI_BASE_URL as string,
  apiKey: AI_API_KEY as string,
  callback_url: `${BACKEND_URL}/ai/ingest`,
});
