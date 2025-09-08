# 📧 Communications Block - Email Marketing Plugin for Motorical

[![Production Ready](https://img.shields.io/badge/Status-Production%20Ready-brightgreen.svg)](https://github.com/gliepins/marketing-motorical)
[![Plugin Architecture](https://img.shields.io/badge/Architecture-Plugin-blue.svg)](https://motorical.com)
[![Node.js](https://img.shields.io/badge/Node.js-20%2B-green.svg)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15%2B-blue.svg)](https://postgresql.org/)

> **A production-ready email marketing plugin that seamlessly integrates with the [Motorical](https://motorical.com) email infrastructure ecosystem.**

---

## 🚀 **What is Communications Block?**

Communications Block is an **enterprise-grade email marketing plugin** designed specifically for the **[Motorical](https://motorical.com) ecosystem**. It transforms any Motorical-powered email infrastructure into a complete marketing automation platform while maintaining the plugin architecture principles of independence, scalability, and easy deployment.

### **🎯 Plugin Philosophy**

- **🔌 Truly Pluggable**: Add or remove without affecting core Motorical services
- **🏗️ Independently Deployable**: Own database, services, and repository
- **🌐 API-First Integration**: Loose coupling via REST APIs and environment configuration
- **⚡ Production Battle-Tested**: Live in production with active customers and real campaigns

---

## 🏢 **Part of the Motorical Ecosystem**

### **🌟 [Motorical.com](https://motorical.com) - Professional Email Infrastructure**

The Communications Block leverages the powerful **Motorical** email delivery platform:

- **🚀 High-Performance SMTP**: Enterprise-grade email delivery infrastructure
- **📊 Advanced Analytics**: Real-time delivery intelligence and reputation monitoring  
- **🔐 Security-First**: DKIM signing, SPF/DMARC alignment, dedicated IPs
- **📈 Scalability**: Handle millions of emails with intelligent rate limiting
- **🛡️ Deliverability**: Professional reputation management and ISP relationships

**Perfect for:**
- SaaS platforms needing transactional + marketing emails
- Agencies managing multiple client email campaigns  
- E-commerce businesses requiring reliable email delivery
- Enterprise teams needing advanced email infrastructure

👉 **[Get started with Motorical →](https://motorical.com)**

---

## ✨ **Features**

### **📋 Campaign Management**
- **Lists & Contacts**: Import, segment, and manage contact databases
- **Email Templates**: HTML/text templates with merge variable support
- **Smart Campaigns**: Scheduling, chunked delivery, timezone handling
- **Real-time Analytics**: Comprehensive delivery tracking and recipient insights

### **🛡️ Compliance & Deliverability**  
- **Customer-Scoped Suppressions**: Industry-standard unsubscribe management
- **CAN-SPAM Compliance**: Automatic unsubscribe handling with legal compliance
- **Cross-Customer Isolation**: Professional suppression list management
- **GDPR Ready**: Data export, deletion, and retention controls

### **🎛️ Enterprise Controls**
- **Delete Confirmations**: Prevent accidental data loss across all operations
- **Tenant Isolation**: Multi-customer support with strict data boundaries
- **Advanced Permissions**: Role-based access and entitlement enforcement
- **Audit Logging**: Complete activity tracking for compliance

### **📊 Business Intelligence**
- **Delivery Intelligence**: Advanced recipient scoring and domain analysis
- **Campaign Analytics**: Open rates, click rates, bounce analysis, ROI tracking
- **Suppression Management**: Comprehensive unsubscribe analytics and management
- **API Integration**: Full REST API for custom integrations and automation

---

## 🔌 **Plugin Architecture**

### **How It Plugs Into Motorical**

```
┌─────────────────────────────────────────────────────────────┐
│                    Motorical Core Platform                 │
├─────────────────┬─────────────────┬─────────────────────────┤
│ Backend API     │ Frontend App    │ SMTP Gateway            │
│ Port 3001       │ Port 3000       │ Port 2587               │
│ Main Database   │ Material-UI     │ Email Delivery          │
└─────────────────┴─────────────────┴─────────────────────────┘
                           │
        ┌─────────────────────────────────────────────────┐
        │              Integration Layer                  │
        │ • Nginx Reverse Proxy (/comm-api/* → :3011)   │
        │ • Tenant Provisioning (X-Internal-Token)       │
        │ • Frontend Pages (Material-UI Integration)     │
        └─────────────────────────────────────────────────┘
                           │
┌─────────────────────────────────────────────────────────────┐
│                Communications Block Plugin                 │
├─────────────────┬─────────────────┬─────────────────────────┤
│ Comm API        │ Comm Database   │ Background Workers      │
│ Port 3011       │ communications  │ Sender + Stats          │
│ REST Endpoints  │ _db             │ Campaign Processing     │
└─────────────────┴─────────────────┴─────────────────────────┘
```

### **🔗 Integration Points**

| Integration | Type | Description |
|-------------|------|-------------|
| **Authentication** | HTTP API | Tenant provisioning via `X-Internal-Token` |
| **Frontend** | Reverse Proxy | Nginx routes `/comm-api/*` to Communications Block |
| **Email Delivery** | REST API | Uses Motorical's `/v1/send` endpoint for email delivery |
| **Analytics** | Webhook | Receives delivery events from Motorical platform |

### **🎯 Plugin Benefits**

- **✅ Independent Deployment**: Deploy, update, scale independently
- **✅ Zero Downtime**: Add/remove without affecting core Motorical services  
- **✅ Separate Repository**: Own git history, releases, and development cycle
- **✅ Custom Database**: Isolated data with own backup/recovery procedures
- **✅ Modular Features**: Enable only the marketing features you need

---

## 🛠️ **Quick Start**

### **Prerequisites**

- **Motorical Platform**: Running Motorical email infrastructure ([Get Motorical](https://motorical.com))
- **Node.js**: v20+ 
- **PostgreSQL**: v15+
- **Redis**: v6+ (for background job processing)
- **Nginx**: For reverse proxy (or similar load balancer)

### **Installation**

```bash
# 1. Clone the plugin repository
git clone https://github.com/gliepins/marketing-motorical.git
cd marketing-motorical

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env
# Edit .env with your Motorical API credentials

# 4. Setup database
sudo -u postgres psql -c "CREATE DATABASE communications_db;"
sudo -u postgres psql -c "CREATE USER comm_user WITH PASSWORD 'secure_password';"
sudo -u postgres psql -d communications_db -f migrations/schema.sql

# 5. Start services
sudo cp systemd/*.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable --now motorical-comm-api motorical-comm-sender motorical-comm-stats

# 6. Verify installation
curl -f http://localhost:3011/api/health
```

---

## 🔧 **Configuration**

### **Environment Variables**

```bash
# Communications Block Configuration
COMM_PORT=3011
COMM_DB_URL=postgresql://user:pass@localhost:5432/communications_db

# Motorical Integration
MOTORICAL_API_BASE=https://api.motorical.com
MOTORICAL_API_KEY=mb_your_api_key
COMM_INTERNAL_TOKEN=your_secure_internal_token

# Email Configuration
COMM_FROM_ADDRESS=noreply@yourdomain.com
COMM_PUBLIC_BASE=https://yourdomain.com

# Security
SERVICE_JWT_SECRET=your_jwt_secret
```

### **Nginx Integration**

```nginx
# Add to your Motorical frontend Nginx config
location /comm-api/ {
    proxy_pass http://127.0.0.1:3011/;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

---

## 📊 **API Reference**

### **Core Endpoints**

```bash
# Tenant Management
POST   /api/provision/tenant     # Provision new tenant (internal)

# Lists & Contacts  
GET    /api/lists                # Get all lists
POST   /api/lists                # Create new list
POST   /api/lists/:id/contacts/import  # CSV import

# Templates
GET    /api/templates            # Get all templates
POST   /api/templates            # Create template

# Campaigns
GET    /api/campaigns            # Get all campaigns
POST   /api/campaigns            # Create campaign
POST   /api/campaigns/:id/schedule    # Schedule campaign
GET    /api/campaigns/:id/analytics   # Campaign analytics
GET    /api/campaigns/:id/recipients  # Get campaign recipients

# Suppressions (Customer-Scoped)
GET    /api/suppressions         # Get suppression list
POST   /api/suppressions         # Add suppression
DELETE /api/suppressions/:id     # Remove suppression

# Compliance
GET    /t/u/:token              # Unsubscribe landing page
POST   /t/u/:token              # Process unsubscribe
```

---

## 🏗️ **Architecture**

### **Database Schema**

```sql
-- Core Tables
tenants(id, motorical_account_id, status, created_at)
contacts(id, tenant_id, email, name, status, ...)
lists(id, tenant_id, name, description, ...)
templates(id, tenant_id, name, subject, body_html, body_text, ...)
campaigns(id, tenant_id, name, template_id, motor_block_id, status, ...)

-- Customer-Scoped Suppressions
suppressions(id, motorical_account_id, tenant_id, email, reason, source, ...)
  -- UNIQUE(motorical_account_id, email) for cross-customer isolation

-- Analytics & Events
email_events(id, tenant_id, campaign_id, contact_id, message_id, type, occurred_at, ...)
```

### **Services**

- **Comm API** (Port 3011): REST endpoints and business logic
- **Sender Worker**: Campaign processing and email delivery
- **Stats Worker**: Real-time analytics and event processing

---

## 🚀 **Production**

### **Health Monitoring**

```bash
# Health check
curl -f http://localhost:3011/api/health

# Service status
sudo systemctl status motorical-comm-*

# Logs
sudo journalctl -u motorical-comm-* -f
```

### **Backup & Recovery**

```bash
# Database backup
pg_dump -U comm_user communications_db > backup_$(date +%Y%m%d_%H%M%S).sql

# Service restart
sudo systemctl restart motorical-comm-api motorical-comm-sender motorical-comm-stats
```

---

## 🤝 **Contributing**

```bash
# Development setup
git clone https://github.com/gliepins/marketing-motorical.git
cd marketing-motorical
npm install
npm run dev
```

### **Plugin Guidelines**

- Maintain plugin boundaries: No direct connections to main Motorical DB
- API-first integration: All communication via REST APIs
- Environment-driven configuration: No hard-coded integration points
- Independent deployability: Deploy without main platform changes

---

## 📝 **License**

MIT License - see [LICENSE](LICENSE) file for details.

---

## 🌟 **Get Started with Motorical**

Ready to supercharge your email infrastructure? 

👉 **[Visit Motorical.com](https://motorical.com)** for professional email delivery infrastructure.

📧 **Contact**: [support@motorical.com](mailto:support@motorical.com)  
🌐 **Website**: [https://motorical.com](https://motorical.com)  
📚 **Documentation**: [https://docs.motorical.com](https://docs.motorical.com)

---

**Built with ❤️ for the Motorical ecosystem**
