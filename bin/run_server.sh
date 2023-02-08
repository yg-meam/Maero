echo "run_server.sh"
source /home/ubuntu/.bashrc
cd /home/ubuntu/maero

pm2 start npm --name "maero" -- run start

echo "run_server.sh complete"
