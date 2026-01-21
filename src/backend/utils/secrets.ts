import { SecretManagerServiceClient } from '@google-cloud/secret-manager';

export class SecretManager {
  private client: SecretManagerServiceClient;
  private secretCache = new Map<string, { value: string; expiry: number }>();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  constructor() {
    // Use Google Cloud's standard authentication chain:
    // 1. GOOGLE_APPLICATION_CREDENTIALS environment variable (service account key)
    // 2. gcloud auth application-default login credentials
    // 3. Google Cloud metadata service (when running on Google Cloud)
    this.client = new SecretManagerServiceClient();
  }

  async getSecret(secretName: string, projectId?: string): Promise<string> {
    const cacheKey = `${projectId || 'default'}:${secretName}`;
    const cached = this.secretCache.get(cacheKey);

    if (cached && Date.now() < cached.expiry) {
      return cached.value;
    }

    try {
      // Auto-detect project ID using Google Cloud client library
      const actualProjectId = projectId || process.env.GOOGLE_CLOUD_PROJECT_ID || await this.client.getProjectId();
      if (!actualProjectId) {
        throw new Error('Could not determine Google Cloud project ID');
      }

      const name = `projects/${actualProjectId}/secrets/${secretName}/versions/latest`;
      const [version] = await this.client.accessSecretVersion({ name });

      if (!version.payload?.data) {
        throw new Error(`Secret ${secretName} has no data`);
      }

      const secretValue = version.payload.data.toString();

      // Cache the secret
      this.secretCache.set(cacheKey, {
        value: secretValue,
        expiry: Date.now() + this.CACHE_DURATION
      });

      return secretValue;
    } catch (error) {
      console.error(`Failed to retrieve secret ${secretName}:`, error);
      throw new Error(`Failed to retrieve secret: ${secretName}`);
    }
  }

  clearCache(): void {
    this.secretCache.clear();
  }
}

// Singleton instance
export const secretManager = new SecretManager();

// Helper function to get JWT secret specifically
export async function getJWTSecret(): Promise<string> {
  try {
    return await secretManager.getSecret('JWT_SECRET');
  } catch (error) {
    console.error('Failed to retrieve JWT_SECRET from Google Cloud Secret Manager:', error);
    console.warn('Falling back to environment variable JWT_SECRET');

    const envSecret = process.env.JWT_SECRET;
    if (!envSecret || envSecret === 'secret') {
      throw new Error('JWT_SECRET not found in Google Cloud Secret Manager and no secure fallback available in environment');
    }

    return envSecret;
  }
}