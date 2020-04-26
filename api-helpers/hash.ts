import bcrypt from 'bcrypt';
import { HASH_ROUNDS } from './constants';

export function compare(test: string, actual: string) {
  return bcrypt.compare(test, actual);
}

export function hash(password: string) {
  return bcrypt.hash(password, HASH_ROUNDS);
}
