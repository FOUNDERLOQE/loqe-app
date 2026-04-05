import { createClient } from '@sanity/client';
import { APP_CONFIG } from './config';

export const sanityClient = createClient({
  projectId: APP_CONFIG.sanity.projectId,
  dataset: APP_CONFIG.sanity.dataset,
  apiVersion: APP_CONFIG.sanity.apiVersion,
  useCdn: true,
});

export default sanityClient;