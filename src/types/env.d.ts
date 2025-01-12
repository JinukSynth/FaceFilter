// src/types/env.d.ts
declare namespace NodeJS {
    interface ProcessEnv {
      PRODUCT_FIREBASE_API_KEY: string;
      PRODUCT_FIREBASE_AUTH_DOMAIN: string;
      PRODUCT_FIREBASE_DATABASE_URL: string;
      PRODUCT_FIREBASE_STORAGE_BUCKET: string;
    }
  }