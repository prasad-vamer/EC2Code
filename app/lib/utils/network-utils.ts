export class NetworkUtils {
  private static isValidIp(ip: string): boolean {
    const ipRegex =
      /^(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|\d)\.(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|\d)\.(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|\d)\.(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|\d)$/;
    return ipRegex.test(ip);
  }

  private static isValidCidr(ip: string): boolean {
    const cidrRegex =
      /^(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|\d)\.(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|\d)\.(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|\d)\.(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|\d)\/(3[0-2]|[12]?[0-9])$/;
    return cidrRegex.test(ip);
  }

  static formatToCidr(ip: string): string {
    if (this.isValidCidr(ip)) {
      return ip; // Already in CIDR format, return as-is
    }
    if (this.isValidIp(ip)) {
      return `${ip}/32`; // Convert valid IP to CIDR
    }
    throw new Error(`Invalid IP address: ${ip}`);
  }
}
