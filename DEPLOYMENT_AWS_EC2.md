# AWS EC2 & S3 Deployment Guide for NeuroReader

This guide provides step-by-step instructions to deploy **NeuroReader** on an **AWS EC2** instance using **Docker & Docker Compose**, with all PDF/document uploads stored directly in **Amazon S3**.

---

## 🏗️ Architecture Overview

```
                        ┌─────────────────────────────────────────────────────────┐
                        │                     AWS Cloud                           │
                        │                                                         │
  User / Browser        │   ┌─────────────────────────────────────────────────┐   │
   (PDF.js Client) ────►│   │               AWS EC2 Instance                  │   │
        │               │   │                                                 │   │
        │               │   │   [Nginx :80/:443]                              │   │
        │               │   │         │ (reverse proxy + 50MB upload limit)   │   │
        │               │   │         ▼                                       │   │
        │               │   │   [Gunicorn :8000]                              │   │
        │               │   │         │                                       │   │
        │               │   │   [Django REST Framework]                       │   │
        │               │   │         │                  │                    │   │
        │               │   └─────────┼──────────────────┼────────────────────┘   │
        │               │             │                  │                        │
        │               │             ▼                  ▼                        │
        │               │     [AWS S3 Bucket]     [Groq LPU API]                  │
        │               │    (PDFs & Documents)   (Fast AI Inference)             │
        └───────────────┴─────────────┼──────────────────┘                        │
                                      └───────────────────────────────────────────┘
```

---

## Part 1: AWS S3 Bucket Setup

### 1. Create S3 Bucket
1. Open the [AWS Management Console](https://console.aws.amazon.com/) and navigate to **Amazon S3**.
2. Click **Create bucket**.
3. Choose a unique **Bucket name** (e.g., `neuroreader-uploads-<your-name>`).
4. Select your preferred **AWS Region** (e.g., `us-east-1` or `ap-south-1`).
5. **Block Public Access**: Keep all blocks ON (NeuroReader securely streams files through authenticated endpoints).
6. Click **Create bucket**.

### 2. Configure CORS on S3 Bucket
1. Click your newly created bucket and go to the **Permissions** tab.
2. Scroll down to **Cross-origin resource sharing (CORS)** and click **Edit**.
3. Paste the following configuration and click **Save changes**:
```json
[
    {
        "AllowedHeaders": ["*"],
        "AllowedMethods": ["GET", "PUT", "POST", "HEAD"],
        "AllowedOrigins": ["*"],
        "ExposeHeaders": ["ETag", "Content-Disposition"]
    }
]
```

### 3. Create an IAM User for S3 Access
1. Navigate to **IAM** > **Users** > **Create user** (e.g., `neuroreader-s3-user`).
2. Select **Attach policies directly** and click **Create policy**.
3. Use the JSON editor and paste (replace `YOUR_BUCKET_NAME` with your actual bucket name):
```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "s3:ListBucket",
                "s3:GetBucketLocation"
            ],
            "Resource": "arn:aws:s3:::YOUR_BUCKET_NAME"
        },
        {
            "Effect": "Allow",
            "Action": [
                "s3:PutObject",
                "s3:GetObject",
                "s3:DeleteObject"
            ],
            "Resource": "arn:aws:s3:::YOUR_BUCKET_NAME/*"
        }
    ]
}
```
4. Name the policy `NeuroReaderS3AccessPolicy` and attach it to the user.
5. Click on the created user > **Security credentials** tab > **Create access key**.
6. Select **Application running outside AWS** (or Other) and copy:
   - `AWS_ACCESS_KEY_ID`
   - `AWS_SECRET_ACCESS_KEY`

---

## Part 2: Launch & Configure AWS EC2 Instance

### 1. Launch EC2 Instance
1. In the AWS Console, open **EC2** and click **Launch instance**.
2. **Name**: `NeuroReader-Server`
3. **OS Image**: **Ubuntu Server 24.04 LTS** (or 22.04 LTS).
4. **Instance Type**:
   - `t3.small` or `t3.medium` (Recommended).
   - `t2.micro` or `t3.micro` works for low-traffic demo/testing.
5. **Key pair**: Create or select an existing `.pem` key pair for SSH access.
6. **Network Settings (Security Group)**:
   - Allow **SSH** (Port 22) from your IP.
   - Allow **HTTP** (Port 80) from Anywhere (`0.0.0.0/0`).
   - Allow **HTTPS** (Port 443) from Anywhere (`0.0.0.0/0`).
   - *(Optional)* Allow **Custom TCP** (Port 8000) from Anywhere for direct testing.
7. **Storage**: 20–30 GB gp3 root volume.
8. Click **Launch instance**.

---

## Part 3: Deploy with Docker on EC2

### 1. Connect to EC2
```bash
ssh -i /path/to/your-key.pem ubuntu@<YOUR_EC2_PUBLIC_IP>
```

### 2. Install Docker & Docker Compose
Run the official Docker convenience script:
```bash
# Update and install curl & git
sudo apt update && sudo apt upgrade -y
sudo apt install -y curl git

# Install Docker engine
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Add ubuntu user to docker group (run without sudo)
sudo usermod -aG docker ubuntu
newgrp docker

# Verify Docker installation
docker --version
docker compose version
```

### 3. Clone Repository & Setup Environment
```bash
# Clone the repository
git clone https://github.com/YOUR_GITHUB_USERNAME/NeuroReader.git
cd NeuroReader/NeuroReader

# Create .env from template
cp .env.example .env
nano .env
```

Fill in your actual production values in `.env`:
```ini
# Django Core Settings
SECRET_KEY=your-random-generated-secret-key-32-chars-or-more
DEBUG=False
ALLOWED_HOSTS=*
CSRF_TRUSTED_ORIGINS=http://<YOUR_EC2_PUBLIC_IP>,http://localhost

# AWS S3 Storage
USE_S3=True
AWS_ACCESS_KEY_ID=AKIA...YOUR_ACCESS_KEY_ID...
AWS_SECRET_ACCESS_KEY=...YOUR_SECRET_ACCESS_KEY...
AWS_STORAGE_BUCKET_NAME=your-s3-bucket-name
AWS_S3_REGION_NAME=us-east-1

# AI Inference (Groq)
GROQ_API_KEY=gsk_...YOUR_GROQ_API_KEY...
```
*(Press `Ctrl + O` then `Enter` to save, and `Ctrl + X` to exit `nano`)*

---

### 4. Build and Run with Docker Compose
```bash
# Build and start services in detached mode
docker compose up -d --build
```

Verify that both containers are running:
```bash
docker compose ps
```
Output should show:
- `neuroreader_web` (State: Up)
- `neuroreader_nginx` (State: Up, Ports: 0.0.0.0:80->80/tcp)

Check live logs to verify database migrations and static collection:
```bash
docker compose logs -f
```

---

## Part 4: Post-Deployment Management

### Create Admin / Superuser
```bash
docker compose exec web python manage.py createsuperuser
```

### Accessing the Web Application
Open your browser and navigate to:
```
http://<YOUR_EC2_PUBLIC_IP>/
```
- Homepage: `http://<YOUR_EC2_PUBLIC_IP>/homepage.html`
- Login: `http://<YOUR_EC2_PUBLIC_IP>/login.html`
- Reader: `http://<YOUR_EC2_PUBLIC_IP>/index.html`
- Django Admin: `http://<YOUR_EC2_PUBLIC_IP>/admin/`

---

## Part 5: Useful Commands

| Task | Command |
|---|---|
| View application logs | `docker compose logs -f web` |
| View Nginx access/error logs | `docker compose logs -f nginx` |
| Restart all containers | `docker compose restart` |
| Stop application | `docker compose down` |
| Rebuild after code changes | `docker compose up -d --build` |
| Run tests inside container | `docker compose exec web pytest` |
| Run Django shell | `docker compose exec web python manage.py shell` |

---

## Part 6: (Optional) Adding Free SSL / HTTPS with Let's Encrypt

If you have a domain pointed to your EC2 IP (e.g. `reader.yourdomain.com`):

1. Install Certbot on EC2:
```bash
sudo apt install -y certbot python3-certbot-nginx
```
2. Generate SSL certificate:
```bash
sudo certbot certonly --standalone -d reader.yourdomain.com
```
3. Update `nginx/nginx.conf` to mount certificates and listen on port 443 with `ssl_certificate` and `ssl_certificate_key`.
