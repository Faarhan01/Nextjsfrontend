import { MedusaClient } from './client';

export const medusa = new MedusaClient();
export const sdk = medusa;

export * from './types';
export * from './transformers';
export { MedusaClient } from './client';
