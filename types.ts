
export enum MiningAlgorithm {
  SHA256 = 'SHA-256 (Bitcoin)',
  ETHASH = 'ETHash (Ethereum Classic)',
  RANDOMX = 'RandomX (Monero)',
  SCRYPT = 'Scrypt (Litecoin)',
}

export enum HardwareType {
  GPU = 'GPU (NVIDIA RTX 4090)',
  CPU = 'CPU (AMD Ryzen 9)',
  ASIC = 'ASIC (Antminer S19)',
}

export interface MiningStats {
  hashrate: number;
  hashrateUnit: string;
  temperature: number;
  power: number;
  acceptedShares: number;
  rejectedShares: number;
  fanSpeed: number;
}

export interface CoinData {
  symbol: string;
  name: string;
  price: number;
  difficulty: string;
  profitability: string;
  color: string;
  algorithm: MiningAlgorithm;
}

export interface LogEntry {
  id: string;
  timestamp: string;
  level: 'INFO' | 'WARN' | 'ERROR' | 'SUCCESS';
  message: string;
}

export interface AIChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export type UserRole = 'Super Admin' | 'Admin' | 'Operator' | 'Guest';
export type VerificationStatus = 'unverified' | 'pending' | 'verified';

export interface UserLocation {
    country: string;
    city: string;
    coordinates: { x: number; y: number };
    address?: string;
    zipCode?: string;
}

export interface UserPersonalInfo {
    dateOfBirth?: string;
    gender?: string;
    phoneNumber?: string;
    nationalId?: string;
}

export interface RiskAssessment {
  score: number;
  reason: string;
  isFake: boolean;
  lastChecked: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: 'Active' | 'Offline';
  verificationStatus: VerificationStatus;
  lastLogin: string;
  parentId?: string; // Links sub-users to their creator (Guest/Admin)
  ip?: string;
  location?: UserLocation;
  personalInfo?: UserPersonalInfo;
  riskAssessment?: RiskAssessment;
  avatar?: string;
  password?: string; // For simulation
}

export interface UserActivity {
  id: string;
  userId: string;
  userName: string;
  action: string;
  details: string;
  timestamp: string;
  status: 'Success' | 'Failed' | 'Warning';
}

export interface BinanceTicker {
  symbol: string;
  lastPrice: string;
  priceChange: string;
  priceChangePercent: string;
  volume: string;
}

export type TransactionStatus = 'Pending' | 'Completed' | 'Rejected';
export type TransactionType = 'DEPOSIT' | 'WITHDRAW';

export interface Transaction {
  id: string;
  userId: string;
  userName: string;
  type: TransactionType;
  amount: number;
  currency: string;
  method: string;
  status: TransactionStatus;
  timestamp: string;
}

export interface Feedback {
  id: string;
  userName: string;
  email?: string;
  rating: number;
  comment: string;
  date: string;
  status: 'Pending' | 'Replied';
  replyText?: string;
}

export interface MarketCoin {
  id: string;
  rank: number;
  name: string;
  symbol: string;
  price: number;
  change24h: number;
  volume24h: string;
  marketCap: string;
  chartData: number[];
}

export interface MarketNews {
  id: string;
  title: string;
  source: string;
  time: string;
  sentiment: 'Positive' | 'Negative' | 'Neutral';
}

export type Language = 'en' | 'am' | 'de' | 'ti';

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
}

export type AssetCategory = 'Forex' | 'Crypto' | 'Commo' | 'Index';

export interface TradingPair {
    symbol: string;
    name: string;
    category: AssetCategory;
    price: number;
    changePercent: number;
    leverage: number;
}

export interface TradePosition {
    id: string;
    symbol: string;
    type: 'BUY' | 'SELL';
    entryPrice: number;
    amount: number;
    leverage: number;
    margin: number;
    pnl: number;
    time: string;
}

export interface MiningTask {
  id: string;
  title: string;
  description: string;
  reward: number;
  rewardType: 'USD' | 'BTC' | 'POINTS';
  difficulty: 'EASY' | 'MEDIUM' | 'HARD' | 'ELITE';
  progress: number;
  status: 'AVAILABLE' | 'IN_PROGRESS' | 'COMPLETED' | 'LOCKED';
  category: 'MINING' | 'AI' | 'SECURITY' | 'MARKET';
}
