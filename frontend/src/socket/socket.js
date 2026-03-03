import { io } from 'socket.io-client';

const socket = io(import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || 'http://localhost:5001');

export default socket;
