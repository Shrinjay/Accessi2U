import { config } from 'dotenv';

config();

export type ENVS = 'dev' | 'stg' | 'prd';
const envs: ENVS[] = ['dev', 'stg', 'prd'];

const assertEnv = (env: ENVS) => {
  if (APP_ENV !== env) throw new Error(`This function should only be called in ${env}`);
};

const {
  APP_ENV: rawAppEnv,
  PORT,
  BACKEND_URL,
  SUPABASE_SERVICE_KEY,
  SUPABASE_URL,
  AI_BASE_URL,
  AI_API_KEY,
  TYPESENSE_COLLECTION_NAME,
  TYPESENSE_HOST,
  TYPESENSE_API_KEY,
  MAX_VECTOR_DISTANCE,
  LOCAL_FILE_SYSTEM_BASE_PATH,
  MINIO_ACCESS_KEY_ID,
  MINIO_SECRET_ACCESS_KEY,
  MINIO_HOST,
  MINIO_BUCKET,
} = process.env;

if (rawAppEnv && !envs.includes(rawAppEnv as ENVS)) {
  throw new Error(`${rawAppEnv} is invalid APP_ENV. Please select one of: dev, stg, prd`);
}
const APP_ENV = rawAppEnv as ENVS;

export {
  APP_ENV,
  PORT,
  BACKEND_URL,
  SUPABASE_SERVICE_KEY,
  SUPABASE_URL,
  AI_BASE_URL,
  AI_API_KEY,
  TYPESENSE_COLLECTION_NAME,
  TYPESENSE_API_KEY,
  TYPESENSE_HOST,
  MAX_VECTOR_DISTANCE,
  LOCAL_FILE_SYSTEM_BASE_PATH,
  MINIO_ACCESS_KEY_ID,
  MINIO_SECRET_ACCESS_KEY,
  MINIO_HOST,
  MINIO_BUCKET,
};
