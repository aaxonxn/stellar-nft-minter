import { describe, it, expect } from 'vitest';
import { validateNFTData, validateAmount, formatPublicKey } from '../utils/validation';

describe('validateNFTData', () => {
  it('should validate a correct form (valid input)', () => {
    const result = validateNFTData(
      'Test NFT', 
      'A test description', 
      'https://example.com/image.png'
    );
    expect(result.isValid).toBe(true);
    expect(Object.keys(result.errors).length).toBe(0);
  });

  it('should invalidate an empty name', () => {
    const result = validateNFTData('', 'Desc', 'https://example.com/img.png');
    expect(result.isValid).toBe(false);
    expect(result.errors.name).toBeDefined();
  });

  it('should invalidate an invalid URL', () => {
    const result = validateNFTData('Name', 'Desc', 'not-a-url');
    expect(result.isValid).toBe(false);
    expect(result.errors.imageUrl).toBeDefined();
  });
});

describe('formatPublicKey', () => {
  it('correctly shortens key', () => {
    const fullKey = 'GBH7BHYVOPVTY2YZCWRU2T3YVXZ32J4M2MUVK34KVZ6HWWL5N5G4E6V5';
    const shortened = formatPublicKey(fullKey);
    expect(shortened).toBe('GBH7BH...E6V5');
  });
});

describe('validateAmount', () => {
  it('returns true for enough balance', () => {
    expect(validateAmount('5.000', '0.001')).toBe(true);
    expect(validateAmount('0.001', '0.001')).toBe(true);
  });

  it('returns false for insufficient balance', () => {
    expect(validateAmount('0.0005', '0.001')).toBe(false);
    expect(validateAmount('0', '0.001')).toBe(false);
  });
});
