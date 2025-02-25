export class CloudInit {
  static addUser(userName: string): string {
    return `#!/bin/bash
# Create a new user
sudo useradd -m -s /bin/bash ${userName}

# Add user to sudoers
echo '${userName} ALL=(ALL) NOPASSWD:ALL' | sudo tee /etc/sudoers.d/${userName}

# Set permissions for SSH key authentication
sudo mkdir -p /home/${userName}/.ssh
sudo cp /home/admin/.ssh/authorized_keys /home/${userName}/.ssh/authorized_keys
sudo chown -R ${userName}:${userName} /home/${userName}/.ssh
sudo chmod 700 /home/${userName}/.ssh
sudo chmod 600 /home/${userName}/.ssh/authorized_keys
    `;
  }
}
