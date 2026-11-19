#!/usr/bin/env bash
# One-time (and repeatable) setup of backups on the staging server. Run as root
# from the root-owned checkout, after a deployment has put it in place:
#
#   bash /opt/owis/repo/deploy/hostinger/server/install-backups.sh
#
# It creates the encryption key if there is none (the key is never printed),
# installs rclone, owis-backup and owis-restore-test, refreshes
# owis-deploy-staging so that "status" also reports on backups, and enables the
# two timers. It never connects or changes an off-site destination.
set -euo pipefail
umask 077

[ "$(id -u)" -eq 0 ] || {
  echo "must run as root" >&2
  exit 1
}
here="$(cd "$(dirname "$0")" && pwd)"
key="/opt/owis/backup.key"

install -d -m 700 /var/backups/owis /var/backups/owis/staging

if [ -s "$key" ]; then
  echo "keeping the existing $key"
else
  openssl rand -base64 48 > "$key"
  echo "created $key (not shown here)"
  echo "IMPORTANT: copy this key to a password manager. Archives kept outside"
  echo "this server cannot be opened without it."
fi
chown root:root "$key"
chmod 600 "$key"

# rclone copies the encrypted archives off-site. It comes from the Ubuntu
# archive (signed packages); nothing is connected or uploaded by installing it.
command -v rclone > /dev/null || {
  apt-get update -qq
  DEBIAN_FRONTEND=noninteractive apt-get install -y -qq rclone > /dev/null
  echo "installed $(rclone version | head -n 1)"
}

install -m 750 -o root -g root \
  "$here/owis-backup" "$here/owis-restore-test" "$here/owis-deploy-staging" "$here/owis-migrate" /usr/local/sbin/

cat > /etc/logrotate.d/owis << 'ROTATE'
/var/log/owis-backup-*.log /var/log/owis-restore-test-*.log {
    monthly
    rotate 12
    compress
    missingok
    notifempty
}
ROTATE
chmod 644 /etc/logrotate.d/owis
install -m 644 -o root -g root "$here"/owis-*.service "$here"/owis-*.timer /etc/systemd/system/
systemctl daemon-reload
systemctl enable --now owis-backup-staging.timer owis-restore-test-staging.timer > /dev/null
systemctl list-timers 'owis-*' --no-pager --all | sed -n '1,4p'
echo BACKUPS_INSTALLED
