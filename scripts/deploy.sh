#!/usr/bin/env bash
set -euo pipefail

export DEBIAN_FRONTEND=noninteractive

echo "[1/6] Installing system packages..."
apt update -y
apt install -y nginx git curl ca-certificates idn2

echo "[2/6] Installing Node.js 20..."
if ! command -v node >/dev/null 2>&1; then
  curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
  apt install -y nodejs
fi

echo "[3/6] Cloning project..."
mkdir -p /var/www
if [ -d /var/www/site ]; then
  rm -rf /var/www/site
fi
git clone https://github.com/GenioFalco/tech-showcase-shop.git /var/www/site
cd /var/www/site
git checkout main || true

echo "[4/6] Building project..."
npm ci || npm install
npm run build

echo "[5/6] Configuring Nginx..."
puny=$(idn2 -a 'тысяча-мелочей.рф')
cat >/etc/nginx/sites-available/tech-showcase-shop <<CONF
server {
  listen 80;
  listen [::]:80;
  server_name $puny;

  root /var/www/site/dist;
  index index.html;

  location / {
    try_files $uri $uri/ /index.html;
  }

  access_log /var/log/nginx/tech-showcase-shop.access.log;
  error_log  /var/log/nginx/tech-showcase-shop.error.log;
}
CONF

rm -f /etc/nginx/sites-enabled/default
ln -sf /etc/nginx/sites-available/tech-showcase-shop /etc/nginx/sites-enabled/tech-showcase-shop
nginx -t
systemctl enable --now nginx
systemctl reload nginx

echo "[6/6] Done. Site should be available over HTTP at: тысяча-мелочей.рф ($puny)"
echo "For HTTPS, run: apt install -y certbot python3-certbot-nginx && certbot --nginx -d $puny --email you@example.com --agree-tos --no-eff-email --redirect"

