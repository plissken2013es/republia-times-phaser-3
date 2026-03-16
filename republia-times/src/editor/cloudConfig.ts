const KEY_API = 'republiatimes-editor-apiKey';
const KEY_BIN = 'republiatimes-editor-binId';

export function getApiKey(): string {
  return localStorage.getItem(KEY_API) ?? '';
}

export function setApiKey(key: string): void {
  localStorage.setItem(KEY_API, key.trim());
}

export function getBinId(): string {
  return localStorage.getItem(KEY_BIN) ?? '';
}

export function setBinId(id: string): void {
  localStorage.setItem(KEY_BIN, id.trim());
}

export function isConfigured(): boolean {
  return getApiKey().length > 0 && getBinId().length > 0;
}

export function hasApiKey(): boolean {
  return getApiKey().length > 0;
}
