import { MedusaClient } from './client';

export const sdk = new MedusaClient();

export const medusa = sdk;

export * from '../../types/medusa';
export * from './transformers';
export { MedusaClient } from './client';