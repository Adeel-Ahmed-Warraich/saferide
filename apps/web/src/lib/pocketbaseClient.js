import PocketBase from 'pocketbase';

// In development: uses localhost
// In production: uses VITE_PB_URL environment variable set in Hostinger
const POCKETBASE_URL = import.meta.env.VITE_PB_URL || 'http://127.0.0.1:8090';

const pb = new PocketBase(POCKETBASE_URL);

export default pb;

export { pb as pocketbaseClient };