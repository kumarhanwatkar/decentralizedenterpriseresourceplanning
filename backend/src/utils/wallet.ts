import { ethers } from 'ethers';
import { AuthenticationError } from './errors';
import { logger } from './logger';

/**
 * Wallet verification utilities for MetaMask and blockchain wallets
 */
export const walletUtils = {
  /**
   * Verify a signed message and recover the wallet address
   * @param message - The original message that was signed
   * @param signature - The signed message (EIP-191 signature)
   * @returns The recovered wallet address
   * @throws AuthenticationError if signature is invalid
   */
  verifySignature: (message: string, signature: string): string => {
    try {
      // Recover the address from the signature
      const recoveredAddress = ethers.verifyMessage(message, signature);

      if (!recoveredAddress) {
        throw new AuthenticationError('Failed to recover wallet address from signature');
      }

      return recoveredAddress.toLowerCase();
    } catch (error) {
      logger.error('Signature verification failed:', error);
      throw new AuthenticationError('Invalid signature or message');
    }
  },

  /**
   * Validate wallet address format (ERC-55 checksum and basic format)
   * @param address - The wallet address to validate
   * @returns true if valid, false otherwise
   */
  isValidAddress: (address: string): boolean => {
    return ethers.isAddress(address);
  },

  /**
   * Normalize wallet address to lowercase
   * @param address - The wallet address to normalize
   * @returns Lowercase wallet address
   */
  normalizeAddress: (address: string): string => {
    return address.toLowerCase();
  },

  /**
   * Generate a login message for user to sign
   * @param walletAddress - The user's wallet address
   * @param timestamp - Message timestamp (for replay attack prevention)
   * @returns The login message to be signed
   */
  generateLoginMessage: (walletAddress: string, timestamp: number): string => {
    return `Sign this message to login to Decentralized ERP\nWallet: ${walletAddress}\nTimestamp: ${timestamp}\nNonce: ${Math.random().toString(36).substring(7)}`;
  },

  /**
   * Verify wallet ownership by checking signature matches wallet
   * @param walletAddress - The claimed wallet address
   * @param message - The message that was signed
   * @param signature - The signature to verify
   * @returns true if signature is valid for the wallet
   * @throws AuthenticationError if verification fails
   */
  verifyWalletOwnership: (walletAddress: string, message: string, signature: string): boolean => {
    const recoveredAddress = walletUtils.verifySignature(message, signature);
    const normalizedClaimed = walletUtils.normalizeAddress(walletAddress);

    if (recoveredAddress !== normalizedClaimed) {
      throw new AuthenticationError(
        'Wallet address does not match signature. Please use the correct wallet.'
      );
    }

    return true;
  },

  /**
   * Check if address is a smart contract (has code)
   * @param address - The address to check
   * @param provider - Optional ethers Provider
   * @returns true if address is a smart contract
   */
  isSmartContract: async (
    address: string,
    provider?: ethers.Provider
  ): Promise<boolean> => {
    try {
      if (!provider) {
        // Use public RPC if no provider given
        provider = new ethers.JsonRpcProvider(
          'https://data-seed-prebsc-1-b.binance.org:8545'
        );
      }

      const code = await provider.getCode(address);
      return code !== '0x'; // 0x means no code (EOA), else it's a contract
    } catch (error) {
      logger.error('Failed to check if address is contract:', error);
      return false;
    }
  },

  /**
   * Format wallet address for display (show first 6 and last 4 characters)
   * @param address - The wallet address
   * @returns Formatted address (e.g., 0x1234...5678)
   */
  formatAddress: (address: string): string => {
    if (!address || address.length < 10) {
      return address;
    }
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  },
};

/**
 * Generate a random nonce for additional security
 * @returns Random nonce string
 */
export const generateNonce = (): string => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

/**
 * Verify timestamp is within acceptable range (prevent old signatures)
 * @param timestamp - The timestamp to verify
   * @param maxAgeSeconds - Maximum age in seconds (default 5 minutes)
 * @returns true if timestamp is valid
 */
export const isTimestampValid = (timestamp: number, maxAgeSeconds: number = 300): boolean => {
  const now = Date.now();
  const age = (now - timestamp) / 1000; // Convert to seconds

  return age >= 0 && age <= maxAgeSeconds;
};
