# Google Cloud Secret Manager Setup

## Simple Secret Management Setup Guide

This guide sets up Google Cloud Secret Manager integration with your Termix application. Your app will fetch the JWT secret from Google Cloud instead of using hardcoded values.

## 🎯 What This Achieves

- ✅ **JWT secrets stored securely** in Google Cloud Secret Manager
- ✅ **No hardcoded secrets** in your codebase
- ✅ **Automatic secret retrieval** from Google Cloud
- ✅ **Simple authentication** using gcloud

## 📋 Setup Steps

### 1. Google Cloud Authentication

First, authenticate with Google Cloud:

```bash
# Authenticate with Google Cloud
gcloud auth application-default login

# Set your project
gcloud config set project termix-hardened
```

### 2. Create the JWT Secret

Create your JWT secret in Google Cloud Secret Manager:

```bash
# Create the JWT secret in Secret Manager
echo -n "your-super-secure-jwt-secret-here" | gcloud secrets create JWT_SECRET --data-file=-

# Or update if it already exists
echo -n "your-new-jwt-secret" | gcloud secrets versions add JWT_SECRET --data-file=-
```

### 3. Grant Secret Access (if needed)

Make sure your service account has access to secrets:

```bash
# Grant Secret Manager access to your service account
gcloud projects add-iam-policy-binding termix-hardened \
    --member="serviceAccount:termix-hardened@termix-hardened.iam.gserviceaccount.com" \
    --role="roles/secretmanager.secretAccessor"
```

### 4. Environment Configuration

Set your project ID:

```bash
export GOOGLE_CLOUD_PROJECT_ID=termix-hardened
```

Or add it to your `.env` file:
```
GOOGLE_CLOUD_PROJECT_ID=termix-hardened
```

### 5. Test the Setup

Test that everything works:

```bash
# Test secret access
gcloud secrets versions access latest --secret="JWT_SECRET"

# Build and run your app
npm run build:backend
npm run dev:backend
```

## 🔧 Troubleshooting

### Common Issues:

#### "Failed to retrieve secret: JWT_SECRET"
- Verify the secret exists: `gcloud secrets versions list JWT_SECRET`
- Check authentication: `gcloud auth list`
- Confirm the project ID is correct: `gcloud config get-value project`

#### "Permission denied"
- Run `gcloud auth application-default login` to authenticate
- Ensure you have the correct project selected
- Check that your user has Secret Manager access

#### "GOOGLE_CLOUD_PROJECT_ID environment variable is required"
- Set the environment variable: `export GOOGLE_CLOUD_PROJECT_ID=termix-hardened`
- Or add it to your `.env` file

### Debug Commands:

```bash
# Check current authentication
gcloud auth list

# Check current project
gcloud config get-value project

# Test secret access manually
gcloud secrets versions access latest --secret="JWT_SECRET"

# Check if secret exists
gcloud secrets list
```

## 🔒 Security Benefits

This setup provides:

- **No hardcoded secrets** - JWT secret stored securely in Google Cloud
- **Centralized secret management** - All secrets in one place
- **Access control** - IAM controls who can access secrets
- **Audit trail** - All secret access is logged
- **Automatic rotation** - Secrets can be rotated without code changes

## 📚 Additional Resources

- [Google Cloud Secret Manager](https://cloud.google.com/secret-manager/docs)
- [Google Cloud Authentication](https://cloud.google.com/docs/authentication)

## ⚡ Quick Reference

### Environment Variables
```bash
GOOGLE_CLOUD_PROJECT_ID=termix-hardened
```

### Startup Commands
```bash
# Authenticate once
gcloud auth application-default login

# Run your app
npm run dev:backend
```

### Key Files
- `src/backend/utils/secrets.ts` - Secret Manager integration
- `.env.example` - Environment configuration example