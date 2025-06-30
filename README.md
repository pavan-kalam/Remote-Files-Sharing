# File Sharing Hub with Admin Panel

A secure file sharing web application where users can upload documents with their names, and administrators can manage received files through a dedicated admin interface.

## Features

### Public Upload Interface
- 👤 **Name Required**: Users must enter their name before uploading
- 📁 **Drag & drop** file upload
- 🚀 **Multiple file upload** support
- 📊 **Progress tracking**
- 💅 **Modern, responsive UI**
- 🔒 **500MB** file size limit per file
- 🌐 **Public access** via ngrok

### Admin Management Panel
- 🛡️ **Secure admin interface** at `/admin`
- 🔔 **Real-time notifications** when files are received
- 👤 **Sender identification** - see who uploaded files
- 💾 **File organization** - move files to custom destinations
- 📊 **Upload statistics** and tracking
- 🗑️ **Dismiss uploads** option
- ⏱️ **Auto-refresh** every 3 seconds
- 🚀 **Auto-opens** admin panel when server starts
- 📁 **Quick path selection** with shortcuts for common folders

## Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start the Server**
   ```bash
   npm start
   ```

3. **Access the Applications**
   - **Public Upload**: `http://localhost:3000`
   - **Admin Panel**: `http://localhost:3000/admin`

4. **Make Public with ngrok** (Optional)
   ```bash
   ngrok http 3000
   ```
   See the [ngrok Setup Guide](#ngrok-setup--public-access) below for detailed instructions.

## How to Use

### For File Senders (Public Interface)
1. **Enter Name**: Users must provide their name first
2. **Upload Files**: Drag and drop or browse to select files
3. **Share**: Click "Share Files" to upload

### For Administrators (Admin Panel)
1. **Monitor Uploads**: Visit `http://localhost:3000/admin`
2. **Receive Notifications**: Get alerts when new files arrive
3. **Review Files**: See sender name, files, and upload time
4. **Organize Files**: 
   - Enter destination path
   - Click "Save Files" to move files from uploads folder
   - Or "Dismiss" to delete unwanted uploads

## File Management

### Temporary Storage
- Files are initially stored in the `uploads/` folder
- Files include sender name and timestamp to prevent conflicts

### Admin Actions
- **Save Files**: Move files to a custom destination path
- **Dismiss**: Delete files from the uploads folder
- Files are renamed with sender name prefix when moved

## Configuration

- **Port**: Default is 3000 (configurable via PORT environment variable)
- **File Size Limit**: 500MB per file (configurable in server.js)
- **Upload Directory**: `uploads/` folder (automatically created)
- **Default Destination**: `/Users/pavankalam/Desktop/ReceivedFiles`

## API Endpoints

### Public Endpoints
- `GET /` - Public upload interface
- `POST /upload` - File upload with sender name

### Admin Endpoints
- `GET /admin` - Admin management panel
- `GET /api/pending-uploads` - Get all uploads
- `POST /api/move-files` - Move files to destination
- `DELETE /api/dismiss-upload/:id` - Delete upload

## Dependencies

- **Express**: Web server framework
- **Multer**: File upload handling middleware
- **CORS**: Cross-origin resource sharing
- **Open**: Auto-open browser functionality
- **fs**: File system operations

## File Structure

```
sharing/
├── server.js              # Backend Express server
├── public/
│   └── index.html         # Public upload interface
├── admin.html             # Admin management panel
├── uploads/               # Temporary file storage
└── package.json           # Dependencies and scripts
```

## ngrok Setup & Public Access

### 📡 What is ngrok?
ngrok creates secure tunnels to your local server, making it accessible from anywhere on the internet. Perfect for sharing your file upload system with others remotely.

### 🛠️ Installation

#### macOS (using Homebrew)
```bash
brew install ngrok
```

#### Windows
1. Download from [ngrok.com](https://ngrok.com/download)
2. Extract to a folder in your PATH
3. Or use Chocolatey: `choco install ngrok`

#### Linux
```bash
# Download and install
curl -s https://ngrok-agent.s3.amazonaws.com/ngrok.asc | sudo tee /etc/apt/trusted.gpg.d/ngrok.asc >/dev/null
echo "deb https://ngrok-agent.s3.amazonaws.com buster main" | sudo tee /etc/apt/sources.list.d/ngrok.list
sudo apt update && sudo apt install ngrok
```

### 🔑 Setup Authentication
1. Sign up at [ngrok.com](https://ngrok.com) (free account)
2. Get your authtoken from the dashboard
3. Configure ngrok:
```bash
ngrok config add-authtoken YOUR_AUTH_TOKEN
```

### 🚀 Basic Usage

#### Start a Tunnel
```bash
# Basic HTTP tunnel on port 3000
ngrok http 3000

# With custom subdomain (paid plans)
ngrok http 3000 --subdomain myfileapp

# With custom domain (paid plans)
ngrok http 3000 --hostname myapp.example.com
```

#### Multiple Tunnels
```bash
# Start multiple tunnels simultaneously
ngrok http 3000 --region us    # US region
ngrok http 3000 --region eu    # EU region
```

### 📊 ngrok Commands & Options

#### Essential Commands
```bash
# Start HTTP tunnel
ngrok http 3000

# Start with specific region
ngrok http 3000 --region us     # United States
ngrok http 3000 --region eu     # Europe
ngrok http 3000 --region ap     # Asia Pacific
ngrok http 3000 --region au     # Australia
ngrok http 3000 --region sa     # South America
ngrok http 3000 --region jp     # Japan
ngrok http 3000 --region in     # India

# Start TCP tunnel
ngrok tcp 3000

# View version
ngrok version

# Update ngrok
ngrok update

# View help
ngrok help
```

#### Advanced Options
```bash
# Custom configuration file
ngrok http 3000 --config /path/to/config.yml

# Enable inspection (default: true)
ngrok http 3000 --inspect

# Disable inspection for better performance
ngrok http 3000 --inspect=false

# Set custom headers
ngrok http 3000 --host-header=rewrite

# Basic authentication
ngrok http 3000 --basic-auth="username:password"

# OAuth authentication (paid feature)
ngrok http 3000 --oauth=google

# IP restrictions (paid feature)
ngrok http 3000 --allow-cidr=192.168.1.0/24
```

### 🎛️ ngrok Web Interface

When ngrok is running, access the web interface at: `http://localhost:4040`

**Features:**
- 📊 **Live request inspection** - See all HTTP requests in real-time
- 🔍 **Request details** - Headers, body, response times
- 🔄 **Replay requests** - Resend requests for testing
- 📈 **Traffic statistics** - Connection metrics and performance
- ⚙️ **Tunnel status** - Active tunnels and configuration

### 📝 Configuration File

Create `~/.ngrok2/ngrok.yml` for persistent settings:

```yaml
version: "2"
authtoken: YOUR_AUTH_TOKEN
region: us
console_ui_color: transparent
tunnels:
  file-sharing:
    proto: http
    addr: 3000
    subdomain: myfileapp
    auth: "admin:secretpassword"
    host_header: rewrite
```

Start configured tunnel:
```bash
ngrok start file-sharing
```

### 🌐 For This File Sharing App

#### Quick Start
```bash
# 1. Start your server
npm start

# 2. In a new terminal, start ngrok
ngrok http 3000
```

#### Get Your Public URL
After starting ngrok, look for the line:
```
Forwarding    https://abcd-1-2-3-4.ngrok-free.app -> http://localhost:3000
```

**Share this URL with others:**
- **Public Upload**: `https://abcd-1-2-3-4.ngrok-free.app`
- **Admin Panel**: `http://localhost:3000/admin` (only accessible locally)

#### API to Get Current URL
```bash
# Get tunnel information programmatically
curl http://localhost:4040/api/tunnels

# Extract HTTPS URL only
curl -s http://localhost:4040/api/tunnels | grep -o '"public_url":"[^"]*' | grep https | cut -d'"' -f4
```

### ⚠️ Important Notes

#### Free Plan Limitations
- ✅ **1 simultaneous tunnel**
- ✅ **40 connections/minute**
- ✅ **Random subdomain** (changes on restart)
- ❌ No custom domains
- ❌ No reserved subdomains
- ❌ No password protection

#### Paid Plan Benefits
- 🎯 **Multiple simultaneous tunnels**
- 🎯 **Custom/reserved subdomains**
- 🎯 **Custom domains**
- 🎯 **Password protection**
- 🎯 **IP whitelisting**
- 🎯 **Higher connection limits**

#### Security Considerations
- 🔐 **Use HTTPS URLs** (ngrok provides both HTTP and HTTPS)
- 🔐 **Admin panel stays local** (not exposed via ngrok)
- 🔐 **Monitor ngrok dashboard** at `http://localhost:4040`
- 🔐 **Consider authentication** for sensitive files
- 🔐 **URLs change** when restarting (free plan)

### 🛑 Stopping ngrok
```bash
# Stop current tunnel
Ctrl+C (in ngrok terminal)

# Kill all ngrok processes
pkill ngrok

# On Windows
taskkill /f /im ngrok.exe
```

### 🔧 Troubleshooting

#### Common Issues
```bash
# Error: authentication failed
ngrok config add-authtoken YOUR_AUTH_TOKEN

# Error: tunnel already exists
pkill ngrok  # Kill existing processes

# Error: port already in use
lsof -ti :3000  # Find process using port 3000
kill PID        # Kill the process

# Check ngrok status
ngrok status

# View ngrok logs
ngrok http 3000 --log stdout
```

#### Performance Tips
- 🚀 **Use --inspect=false** for production
- 🚀 **Choose nearest region** for better latency
- 🚀 **Monitor bandwidth** in dashboard
- 🚀 **Consider paid plan** for higher limits

## Security & Privacy

- 🔒 **Local file storage** - all files stay on your system
- 👤 **Sender tracking** - know who sent what files
- 🗑️ **File control** - dismiss unwanted uploads
- 🚫 **No public downloads** - files not accessible via web
- ⚠️ **Admin access** - secure your admin panel URL (only local access)
- 🌐 **ngrok security** - use HTTPS URLs, monitor traffic via dashboard 