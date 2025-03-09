import * as ec2 from "aws-cdk-lib/aws-ec2";

export class CloudInit {
  /**
   * Creates a complete EC2 user data script
   */
  static createUserData(options: { userName?: string }): ec2.UserData {
    const userData = ec2.UserData.forLinux();

    userData.addCommands(
      "set -e", // Exit on error
      "exec > >(tee /var/log/user-data.log | logger -t user-data) 2>&1", // Log all output
      'echo "Starting user data script execution at $(date)"',
      'echo "Running as user: $(whoami)"'
    );

    // Add package installation commands
    userData.addCommands(...this.getPackageInstallationCommands());

    // Add user creation if needed
    if (options.userName) {
      userData.addCommands(...this.getUserCreationCommands(options.userName));
    }

    // Add Docker installation
    userData.addCommands(
      ...this.getDockerInstallationCommands(options.userName)
    );

    // Final message
    userData.addCommands(
      'echo "User data script completed successfully at $(date)"'
    );

    return userData;
  }

  private static getPackageInstallationCommands(): string[] {
    return [
      'echo "Installing necessary packages..."',
      "export DEBIAN_FRONTEND=noninteractive",
      'apt-get update || { echo "ERROR: apt-get update failed"; exit 1; }',
      'apt-get upgrade -y || { echo "ERROR: apt-get upgrade failed"; exit 1; }',
      'apt-get install -y --no-install-recommends build-essential git curl vim wget ca-certificates tzdata apt-transport-https gnupg lsb-release || { echo "ERROR: apt-get install failed"; exit 1; }',
      "apt-get clean",
      'echo "Necessary packages installed successfully."',
    ];
  }

  private static getUserCreationCommands(userName: string): string[] {
    return [
      `echo "Creating user ${userName}..."`,
      `sudo useradd -m -s /bin/bash ${userName} || { echo "ERROR: Failed to create user ${userName}"; exit 1; }`,
      `echo "${userName} ALL=(ALL) NOPASSWD:ALL" | sudo tee /etc/sudoers.d/${userName} || { echo "ERROR: Failed to add user to sudoers"; exit 1; }`,
      `sudo mkdir -p /home/${userName}/.ssh || { echo "ERROR: Failed to create .ssh directory"; exit 1; }`,
      `if [ -f /home/admin/.ssh/authorized_keys ]; then`,
      `  sudo cp /home/admin/.ssh/authorized_keys /home/${userName}/.ssh/authorized_keys || { echo "ERROR: Failed to copy authorized_keys"; exit 1; }`,
      `else`,
      `  echo "WARNING: /home/admin/.ssh/authorized_keys not found. Skipping SSH key setup."`,
      `fi`,
      `sudo chown -R ${userName}:${userName} /home/${userName}/.ssh || { echo "ERROR: Failed to set ownership on .ssh directory"; exit 1; }`,
      `sudo chmod 700 /home/${userName}/.ssh || { echo "ERROR: Failed to set permissions on .ssh directory"; exit 1; }`,
      `sudo chmod 600 /home/${userName}/.ssh/authorized_keys 2>/dev/null || echo "WARNING: Could not set permissions on authorized_keys (may not exist)"`,
      `echo "User ${userName} created successfully."`,
    ];
  }

  private static getDockerInstallationCommands(userName?: string): string[] {
    const commands = [
      'echo "Installing Docker..."',
      'for pkg in docker.io docker-doc docker-compose podman-docker containerd runc; do apt-get remove -y $pkg || echo "Package $pkg not installed, skipping"; done',
      'curl -fsSL https://get.docker.com -o get-docker.sh || { echo "ERROR: Failed to download Docker installation script"; exit 1; }',
      'sh get-docker.sh || { echo "ERROR: Docker installation script failed"; exit 1; }',

      // Add default admin user to docker group
      'echo "Adding default admin user to docker group..."',
      'if id "admin" &>/dev/null; then',
      '  usermod -aG docker admin || echo "WARNING: Failed to add admin to docker group"',
      "fi",

      // Start and enable Docker service
      'systemctl start docker || echo "WARNING: Failed to start Docker service"',
      'systemctl enable docker || echo "WARNING: Failed to enable Docker service"',
    ];

    if (userName) {
      commands.push(
        `if id "${userName}" &>/dev/null; then`,
        `  echo "Adding ${userName} to docker group..."`,
        `  usermod -aG docker ${userName} || { echo "ERROR: Failed to add ${userName} to docker group"; exit 1; }`,
        `fi`
      );
    }

    commands.push('echo "Docker installed successfully."');

    return commands;
  }
}
