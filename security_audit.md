# Security Audit Report: Termix

**Project:** Termix v1.6.0
**Audit Date:** January 20, 2026
**Audit Type:** Comprehensive CVE & Code Security Assessment

---

## Table of Contents

- [Executive Summary](#executive-summary)
- [A - Critical CVE Vulnerabilities](#a---critical-cve-vulnerabilities)
- [B - High Severity CVEs](#b---high-severity-cves)
- [C - Medium Severity CVEs](#c---medium-severity-cves)
- [D - Low / No CVEs Found](#d---low--no-cves-found)
- [E - Abandoned / Maintenance Concerns](#e---abandoned--maintenance-concerns)
- [F - Code-Level Security Analysis](#f---code-level-security-analysis)
- [G - Recommendations](#g---recommendations)
- [H - Sources](#h---sources)

---

## Executive Summary

This security audit examines **Termix v1.6.0**, a server management platform. The audit covers:
- 70+ npm dependencies for CVE vulnerabilities (2025-2026)
- Code-level security analysis of SSH command execution patterns
- Authentication and input validation practices

### Overall Risk Assessment: **MEDIUM-HIGH**

| Severity | Count | Status |
|----------|-------|--------|
| **Critical** | 1 | ![vulnerable](https://img.shields.io/badge/Status-Action_Required-red) |
| **High** | 3 | ![vulnerable](https://img.shields.io/badge/Status-Action_Required-red) |
| **Medium** | 3 | ![action recommended](https://img.shields.io/badge/Status-Update_Recommended-yellow) |
| **Abandoned Packages** | 1 | ![concern](https://img.shields.io/badge/Status-Monitor-orange) |

---

## A - Critical CVE Vulnerabilities

### A1. CVE-2025-55182 - React Server Components RCE (CVSS 10.0)

| Attribute | Value |
|-----------|-------|
| **Package** | `react` |
| **Installed Version** | 19.1.0 |
| **CVE ID** | CVE-2025-55182 |
| **Severity** | ![CRITICAL](https://img.shields.io/badge/Severity-Critical-red) (CVSS 10.0) |
| **Type** | Remote Code Execution (RCE) |
| **Discovered** | December 3, 2025 |
| **Patched In** | React 19.1.2+ |
| **Status** | ![VULNERABLE](https://img.shields.io/badge/Status-VULNERABLE-red) |

**Description:**
- Unauthenticated remote code execution in React Server Components (RSC)
- Dubbed "React2Shell" by Microsoft
- Allows attackers to execute arbitrary code remotely without authentication
- **Currently being exploited in the wild**

**Impact:**
- Complete server compromise
- Data exposure
- Lateral movement to connected systems

**Mitigation:**
```bash
npm update react@^19.1.2
npm update react-dom@^19.1.2
```

**References:**
- [React Official Security Advisory](https://react.dev/blog/2025/12/03/critical-security-vulnerability-in-react-server-components)
- [GitHub Security Advisory GHSA-fv66-9v8q-g76r](https://github.com/facebook/react/security/advisories/GHSA-fv66-9v8q-g76r)
- [Microsoft Security Blog](https://www.microsoft.com/en-us/security/blog/2025/12/15/defending-against-the-cve-2025-55182-react2shell-vulnerability-in-react-server-components/)

---

## B - High Severity CVEs

### B1. CVE-2025-12758 - Validator.js Stored XSS (CVSS 8.7)

| Attribute | Value |
|-----------|-------|
| **Package** | `validator` |
| **Installed Version** | 13.15.15 |
| **CVE ID** | CVE-2025-12758 |
| **Severity** | ![HIGH](https://img.shields.io/badge/Severity-High-orange) (CVSS 8.7) |
| **Type** | Stored Cross-Site Scripting |
| **Discovered** | November 26, 2025 |
| **Patched In** | 13.15.22+ |
| **Status** | ![VULNERABLE](https://img.shields.io/badge/Status-VULNERABLE-red) |

**Description:**
- Incomplete filtering of special elements in `isLength()` function
- Allows stored XSS attacks via improper input validation

**Mitigation:**
```bash
npm install validator@^13.15.22
```

**References:**
- [GitHub Advisory GHSA-vghf-hv5q-vc2g](https://github.com/advisories/GHSA-vghf-hv5q-vc2g)
- [Snyk Advisory SNYK-JS-VALIDATOR-13653476](https://security.snyk.io/vuln/SNYK-JS-VALIDATOR-13653476)
- [NVD Entry](https://nvd.nist.gov/vuln/detail/CVE-2025-12758)

---

### B2. CVE-2025-58754 - Axios SSRF Vulnerability

| Attribute | Value |
|-----------|-------|
| **Package** | `axios` |
| **Installed Version** | 1.10.0 |
| **CVE ID** | CVE-2025-58754 |
| **Severity** | ![HIGH](https://img.shields.io/badge/Severity-High-orange) |
| **Type** | Server-Side Request Forgery (SSRF) |
| **Discovered** | 2025 |
| **Patched In** | Latest axios (check specific version) |
| **Status** | ![VULNERABLE](https://img.shields.io/badge/Status-VULNERABLE-red) |

**Description:**
- SSRF vulnerability affecting axios 0.28.0 through versions prior to fixes
- May allow attackers to force the application to make requests to internal resources

**Mitigation:**
```bash
npm update axios@latest
```

**References:**
- [NVD - CVE-2025-58754](https://nvd.nist.gov/vuln/detail/CVE-2025-58754)
- [IBM Security Bulletin](https://www.ibm.com/support/pages/security-bulletin-ibm-maximo-application-suite-monitor-component-uses-axios-1100tgz-axios-1110tgz-which-are-vulnerable-cve-2025-58754)

---

### B3. CVE-2025-54371 - Axios Multipart Boundary Flaw

| Attribute | Value |
|-----------|-------|
| **Package** | `axios` (transitive: `form-data`) |
| **Installed Version** | 1.10.0 |
| **CVE ID** | CVE-2025-54371 |
| **Severity** | ![CRITICAL](https://img.shields.io/badge/Severity-Critical-red) |
| **Type** | Parameter Injection / Request Parsing Corruption |
| **Discovered** | 2025 |
| **Patched In** | `form-data` 4.0.1+ |
| **Status** | ![VULNERABLE](https://img.shields.io/badge/Status-VULNERABLE-red) |

**Description:**
- Vulnerability in `form-data` v4.0.0 (transitive dependency)
- Predictable multipart boundaries generated using `Math.random()`
- Enables parameter injection and request parsing corruption

**Mitigation:**
```bash
npm update axios@latest
# Ensure form-data is updated to 4.0.1+
npm audit fix
```

**References:**
- [CVE Details](https://strobes.co/vi/cve/CVE-2025-54371)
- [Miggo Vulnerability Database](https://www.miggo.io/vulnerability-database/cve/CVE-2025-54371)
- [GitHub Issue #6969](https://github.com/axios/axios/issues/6969)

---

## C - Medium Severity CVEs

### C1. CVE-2025-56200 - Validator.js URL Validation Bypass

| Attribute | Value |
|-----------|-------|
| **Package** | `validator` |
| **Installed Version** | 13.15.15 |
| **CVE ID** | CVE-2025-56200 |
| **Severity** | ![MEDIUM](https://img.shields.io/badge/Severity-Medium-yellow) |
| **Type** | URL Validation Bypass |
| **Discovered** | September 30, 2025 |
| **Patched In** | 13.15.20+ |
| **Status** | ![VULNERABLE](https://img.shields.io/badge/Status-VULNERABLE-red) |

**Description:**
- The `isURL()` function uses `'://'` as delimiter
- Allows bypassing protocol and domain validation
- Leads to potential XSS and Open Redirect attacks

**Mitigation:**
```bash
npm install validator@^13.15.22
# (This version also fixes CVE-2025-12758)
```

**References:**
- [GitHub Advisory GHSA-9965-vmph-33xx](https://github.com/advisories/GHSA-9965-vmph-33xx)
- [NVD Entry](https://nvd.nist.gov/vuln/detail/CVE-2025-56200)

---

### C2. CVE-2025-55305 - Electron ASAR Integrity Bypass

| Attribute | Value |
|-----------|-------|
| **Package** | `electron` |
| **Installed Version** | 38.0.0 |
| **CVE ID** | CVE-2025-55305 |
| **Severity** | ![MEDIUM](https://img.shields.io/badge/Severity-Medium-yellow) (CVSS 6.1) |
| **Type** | Arbitrary Code Injection |
| **Discovered** | September 3, 2025 |
| **Patched In** | 38.0.0-beta.6+ |
| **Status** | ![SECURE](https://img.shields.io/badge/Status-NOT_AFFECTED-brightgreen) |

**Description:**
- ASAR integrity bypass through resource folder modification
- Circumvents security fuses
- Only affects apps with both `embeddedAsarIntegrityValidation` AND `cookieEncryption` fuses enabled

**Status:** Electron 38.0.0 stable release is **NOT affected** (fix was in 38.0.0-beta.6)

**References:**
- [NVD Entry](https://nvd.nist.gov/vuln/detail/CVE-2025-55305)
- [GitHub Advisory GHSA-vmqv-hx8q-j7mg](https://github.com/advisories/GHSA-vmqv-hx8q-j7mg)

---

### C3. CVE-2025-7338 - Multer DoS (Fixed in Installed Version)

| Attribute | Value |
|-----------|-------|
| **Package** | `multer` |
| **Installed Version** | 2.0.2 |
| **CVE ID** | CVE-2025-7338 |
| **Severity** | ![MEDIUM](https://img.shields.io/badge/Severity-Medium-yellow) |
| **Type** | Denial of Service |
| **Discovered** | July 2025 |
| **Fixed In** | 2.0.2 |
| **Status** | ![SECURE](https://img.shields.io/badge/Status-NOT_AFFECTED-brightgreen) |

**Description:**
- Attackers can crash Node.js servers with malformed multipart requests
- Versions >=1.4.4-lts.1 and <2.0.2 are affected

**Status:** Multer 2.0.2 is **NOT affected** by this CVE

**References:**
- [GitHub Security Advisory GHSA-fjgf-rc76-4x9p](https://github.com/expressjs/multer/security/advisories/GHSA-fjgf-rc76-4x9p)
- [Snyk Security Report](https://security.snyk.io/package/npm/multer)

---

## D - Low / No CVEs Found

### D1. Axios (Dependencies)

| Package | Version | Status |
|---------|---------|--------|
| `bcryptjs` | 3.0.2 | ![No CVEs](https://img.shields.io/badge/Status-No_CVEs-brightgreen) |
| `better-sqlite3` | 12.2.0 | ![No CVEs](https://img.shields.io/badge/Status-No_CVEs-brightgreen) |
| `cookie-parser` | 1.4.7 | ![No CVEs](https://img.shields.io/badge/Status-No_CVEs-brightgreen) |
| `cors` | 2.8.5 | ![No CVEs](https://img.shields.io/badge/Status-No_CVEs-brightgreen) |
| `drizzle-orm` | 0.44.3 | ![No CVEs](https://img.shields.io/badge/Status-No_CVEs-brightgreen) |
| `electron` | 38.0.0 | ![No CVEs](https://img.shields.io/badge/Status-No_CVEs-brightgreen) |
| `express` | 5.1.0 | ![No CVEs](https://img.shields.io/badge/Status-No_CVEs-brightgreen) |
| `jose` | 5.2.3 | ![No CVEs](https://img.shields.io/badge/Status-No_CVEs-brightgreen) |
| `jsonwebtoken` | 9.0.2 | ![No CVEs](https://img.shields.io/badge/Status-No_CVEs-brightgreen) (historical CVEs patched) |
| `multer` | 2.0.2 | ![No CVEs](https://img.shields.io/badge/Status-No_CVEs-brightgreen) |
| `qrcode` | 1.5.4 | ![No CVEs](https://img.shields.io/badge/Status-No_CVEs-brightgreen) |
| `ssh2` | 1.16.0 | ![No CVEs](https://img.shields.io/badge/Status-No_CVEs-brightgreen) (CVE-2020-26301 patched in 1.4.0+) |
| `speakeasy` | 2.0.0 | ![Abandoned](https://img.shields.io/badge/Status-Abandoned-orange) |
| `validator` | 13.15.15 | ![2 CVEs](https://img.shields.io/badge/Status-2_CVEs-red) |
| `ws` | 8.18.3 | ![No CVEs](https://img.shields.io/badge/Status-No_CVEs-brightgreen) |
| `zod` | 4.0.5 | ![No CVEs](https://img.shields.io/badge/Status-No_CVEs-brightgreen) |

**Notes:**
- **cors 2.8.5**: A malicious look-alike package `express-cookie-parser` was discovered (MAL-2025-3541), but the official `cors` package is secure
- **ssh2 1.16.0**: Historical CVE-2020-26301 (command injection) was fixed in 1.4.0; current version is safe

---

## E - Abandoned / Maintenance Concerns

### E1. Speakeasy (2FA Library) - NOT MAINTAINED

| Attribute | Value |
|-----------|-------|
| **Package** | `speakeasy` |
| **Installed Version** | 2.0.0 |
| **Status** | ![ABANDONED](https://img.shields.io/badge/Status-ABANDONED-red) |
| **Last Activity** | ~2018 |
| **CVE Count** | 0 (but unmaintained) |

**Concerns:**
- Project officially marked as "NOT MAINTAINED"
- No security updates since 2018
- Any newly discovered vulnerabilities will not be patched
- Used for TOTP/HOTP 2FA authentication

**Recommendations:**
- Consider migrating to actively maintained alternatives like `otplib` or `node-2fa`
- If continued use is necessary, audit the code manually and monitor for vulnerabilities

**References:**
- [GitHub Repository](https://github.com/speakeasyjs/speakeasy)
- [Snyk Vulnerability Database](https://security.snyk.io/package/npm/speakeasy)

---

## F - Code-Level Security Analysis

### F1. SSH Command Injection Risks

**Location:** `src/backend/ssh/tunnel.ts` (lines 620-628)

**Finding:** Dynamic SSH command construction with user-controlled inputs

```typescript
const keyFilePath = `/tmp/tunnel_key_${tunnelName.replace(/[^a-zA-Z0-9]/g, "_")}`;
tunnelCmd = `echo '${resolvedEndpointCredentials.sshKey}' > ${keyFilePath} && ...`;
```

**Concerns:**
- SSH keys are written to `/tmp` with predictable filenames
- Keys are passed via shell command interpolation (potential for injection if `tunnelName` sanitization fails)
- Keys are deleted after use but may persist on crash

**Severity:** ![MEDIUM](https://img.shields.io/badge/Severity-Medium-yellow)

**Recommendations:**
- Use SSH2's native key handling instead of writing temp files
- Implement proper cleanup on crash
- Consider using process-specific temp directories

---

### F2. SSH Command Execution in File Manager

**Location:** `src/backend/ssh/file-manager.ts`

**Findings:**
Multiple shell commands executed via SSH connection:
- `ls -la '<path>'` (line 281)
- `cat '<filepath>'` (line 352)
- `rm -rf '<path>'` (line 1085)
- `mv '<old>' '<new>'` (line 1191)

**Concerns:**
- Path traversal possible if input validation is insufficient
- Single quotes may not prevent all injection techniques
- Commands are executed on remote hosts via authenticated SSH (legitimate use case)

**Severity:** ![MEDIUM](https://img.shields.io/badge/Severity-Medium-yellow)

**Mitigation:**
- Ensure robust path sanitization
- Use SFTP API methods where possible (primary method per code review)
- Limit commands to allowlisted directories

---

### F3. CORS Configuration

**Location:** `src/backend/ssh/file-manager.ts` (line 12)

```typescript
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "User-Agent", "X-Electron-App"],
}));
```

**Concerns:**
- `origin: "*"` allows requests from any origin
- May expose the API to CSRF attacks from malicious websites

**Severity:** ![LOW-MEDIUM](https://img.shields.io/badge/Severity-Low--Medium-yellow)

**Recommendation:**
- Restrict CORS to specific trusted origins in production
- Implement CSRF token validation for state-changing operations

---

### F4. File Size Limits

**Location:** `src/backend/ssh/file-manager.ts` (lines 23-25)

```typescript
app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ limit: "100mb", extended: true }));
app.use(express.raw({ limit: "200mb", type: "application/octet-stream" }));
```

**Concerns:**
- Very large payload limits (200MB) could enable DoS attacks
- No rate limiting visible

**Severity:** ![LOW](https://img.shields.io/badge/Severity-Low-brightgreen)

**Recommendations:**
- Consider lowering limits for production
- Implement rate limiting middleware
- Add request timeout configuration

---

### F5. JWT Secret Storage

**Location:** `src/backend/utils/secrets.ts`

**Finding:** Uses Google Secret Manager for production secret storage

**Assessment:** Good security practice for production deployments

---

## G - Recommendations

### Immediate Actions Required (Critical/High Severity)

1. **Update React** to patch CVE-2025-55182 (RCE):
   ```bash
   npm update react@^19.1.2 react-dom@^19.1.2
   ```

2. **Update Validator** to patch CVE-2025-12758 and CVE-2025-56200:
   ```bash
   npm install validator@^13.15.22
   ```

3. **Update Axios** to patch CVE-2025-58754 and CVE-2025-54371:
   ```bash
   npm update axios@latest
   npm audit fix
   ```

4. **Replace Speakeasy** with maintained alternative:
   ```bash
   npm uninstall speakeasy
   npm install otplib
   ```

### Short-Term Actions (Medium Severity)

5. Review and restrict CORS configuration for production
6. Implement rate limiting middleware
7. Add input sanitization for SSH tunnel names
8. Consider reducing file upload size limits

### Long-Term Actions

9. Establish automated dependency scanning (npm audit, Snyk, Dependabot)
10. Implement security headers middleware (helmet.js)
11. Add Content Security Policy (CSP) headers
12. Regular security audits (quarterly recommended)

---

## H - Sources

### CVE Databases
- [NIST National Vulnerability Database (NVD)](https://nvd.nist.gov/)
- [CVE Details](https://www.cvedetails.com/)
- [Snyk Vulnerability Database](https://security.snyk.io/)
- [GitHub Security Advisories](https://github.com/advisories)

### Package-Specific Sources
- [React Security Advisory](https://react.dev/blog/2025/12/03/critical-security-vulnerability-in-react-server-components)
- [Electron Security Blog](https://electronjs.org/blog)
- [Express.js Security Releases](https://expressjs.com/2025/05/19/security-releases.html)

### 2025-2026 Security Context
- [Node.js January 2026 Security Release](https://nodejs.org/en/blog/vulnerability/december-2025-security-releases)
- [OpenJS Foundation Security Checkpoint 2025](https://openjsf.org/blog/openjs-security-checkpoint-2025-so-far)

---

**Report Generated:** January 20, 2026
**Next Review Recommended:** April 20, 2026
