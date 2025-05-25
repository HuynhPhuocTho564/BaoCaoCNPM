# GitHub Actions Workflows

Thư mục này chứa các GitHub Actions workflows để tự động hóa quá trình CI/CD cho dự án ChatStoryAI.

## Các Workflows

### 1. CI/CD Pipeline (`ci.yml`)
**Trigger**: Push và Pull Request đến `main`, `develop`

**Chức năng**:
- ✅ Kiểm tra code style với ESLint
- ✅ Kiểm tra TypeScript type checking
- ✅ Build ứng dụng Next.js
- ✅ Kiểm tra lỗ hổng bảo mật dependencies
- ✅ Test Docker build
- ✅ Kiểm tra code formatting

**Jobs**:
- `test`: Chạy lint, type check, build
- `docker-build`: Test Docker build
- `security`: Scan bảo mật
- `format-check`: Kiểm tra format code

### 2. Performance Check (`performance.yml`)
**Trigger**: Push và Pull Request đến `main`

**Chức năng**:
- 🚀 Lighthouse performance audit
- 📊 Bundle size analysis
- ⚡ Performance metrics tracking

**Jobs**:
- `lighthouse`: Chạy Lighthouse CI
- `bundle-analysis`: Phân tích kích thước bundle

### 3. Security Scan (`security.yml`)
**Trigger**: Push, Pull Request, và hàng tuần

**Chức năng**:
- 🔒 Dependency security scanning
- 🔍 CodeQL static analysis
- 🕵️ Secret detection với TruffleHog

**Jobs**:
- `dependency-scan`: Scan dependencies
- `codeql-analysis`: Static code analysis
- `secret-scan`: Tìm secrets bị leak

### 4. Deploy (`deploy.yml`)
**Trigger**: Push đến `main` và tags

**Chức năng**:
- 🚀 Deploy ứng dụng lên production
- 📦 Tạo deployment artifacts
- 🐳 Build Docker images

**Jobs**:
- `deploy`: Deploy application

## Cấu hình

### Lighthouse Configuration (`.lighthouserc.json`)
```json
{
  "ci": {
    "collect": {
      "url": ["http://localhost:3000"]
    },
    "assert": {
      "assertions": {
        "categories:performance": ["warn", {"minScore": 0.8}],
        "categories:accessibility": ["error", {"minScore": 0.9}]
      }
    }
  }
}
```

### Environment Variables
Các biến môi trường cần thiết:
- `NEXT_TELEMETRY_DISABLED=1`: Tắt telemetry Next.js
- Các secrets khác tùy theo nhu cầu deploy

## Badges Status
Thêm vào README.md chính:

```markdown
![CI/CD](https://github.com/your-username/ChatStoryAI/workflows/CI/CD%20Pipeline/badge.svg)
![Security](https://github.com/your-username/ChatStoryAI/workflows/Security%20Scan/badge.svg)
![Performance](https://github.com/your-username/ChatStoryAI/workflows/Performance%20Check/badge.svg)
```

## Tùy chỉnh

### Thêm Tests
Để thêm unit tests, cập nhật `ci.yml`:
```yaml
- name: Run tests
  run: npm test
```

### Cấu hình Deploy
Cập nhật `deploy.yml` với thông tin server của bạn:
```yaml
- name: Deploy to server
  run: |
    # SSH commands hoặc deployment scripts
```

### Notifications
Thêm notifications Slack/Discord:
```yaml
- name: Notify Slack
  uses: 8398a7/action-slack@v3
  with:
    status: ${{ job.status }}
    webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

## Monitoring

- **Artifacts**: Các reports được lưu trong GitHub Actions artifacts
- **Security Reports**: Upload hàng tuần
- **Performance Reports**: Lighthouse reports cho mỗi PR

## Troubleshooting

### Build Failures
1. Kiểm tra logs trong GitHub Actions
2. Chạy local: `npm run lint && npm run build`
3. Kiểm tra dependencies: `npm audit`

### Performance Issues
1. Xem Lighthouse reports
2. Kiểm tra bundle size
3. Optimize images và assets

### Security Issues
1. Xem security reports
2. Update dependencies: `npm update`
3. Fix vulnerabilities: `npm audit fix`
