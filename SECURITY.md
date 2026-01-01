# Security Policy

## Supported Versions

We actively support the following versions with security updates:

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

We take security vulnerabilities seriously. If you discover a security vulnerability, please follow these steps:

1. **Do not** open a public GitHub issue
2. Email security details to: [your-email@example.com]
3. Include:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)

## Response Timeline

- **Critical**: Response within 24 hours
- **High**: Response within 72 hours
- **Medium/Low**: Response within 1 week

## Bug Bounty

We offer a bug bounty program for security vulnerabilities:

- **Critical**: $50 - $200
- **High**: $25 - $100
- **Medium**: $10 - $50
- **Low**: Recognition in release notes

Bounty amounts depend on:
- Severity and impact
- Quality of report
- Quality of suggested fix

## Security Best Practices

When using this project:

1. Always use the latest version
2. Review dependencies regularly (`go list -m -u all`)
3. Enable security scanning in CI/CD
4. Use environment variables for sensitive data
5. Never commit private keys or secrets

## Security Audit Status

- [ ] External security audit planned
- [x] Automated scanning (Gosec, Nancy, Slither) enabled
- [ ] Third-party audit completed

## Disclosure Policy

We follow responsible disclosure:
1. Reporter notifies maintainers privately
2. Maintainers confirm and assess the issue
3. Fix is developed and tested
4. Fix is released
5. Public disclosure after fix is available

