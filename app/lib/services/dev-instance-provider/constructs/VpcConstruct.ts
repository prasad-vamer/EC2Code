import * as cdk from "aws-cdk-lib";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import { Construct } from "constructs";
import { NetworkUtils } from "utils/network-utils";

interface VpcConstructProps {
  whitelistIps?: string[];
}
export class VpcConstruct extends Construct {
  public readonly vpc: ec2.Vpc;

  constructor(scope: Construct, id: string, props: VpcConstructProps) {
    super(scope, id);

    // ✅ Create a VPC with a Public Subnet (Ensures deletion on `cdk destroy`)

    this.vpc = new ec2.Vpc(this, "DevVpc", {
      ipAddresses: ec2.IpAddresses.cidr("192.168.0.0/16"),
      vpcName: "DevVpc",
      natGateways: 0,
      maxAzs: 1,
      subnetConfiguration: [
        {
          name: "PublicSubnet1",
          subnetType: ec2.SubnetType.PUBLIC,
          cidrMask: 26, // 192.168.1.0 to 192.168.1.63 (64 IPs) - (59 usable IPs)
        },
      ],
    });

    // ✅ Add Network ACL to restrict access to the VPC based on the whitelist IPs
    const publicSubnets = this.vpc.selectSubnets({
      subnetType: ec2.SubnetType.PUBLIC,
    }).subnets;

    // Denys all inbound traffic from all sources by default
    // Denys all outbound traffic to all destinations by default
    const networkACL = new ec2.NetworkAcl(this, "EC2CodeNetworkACL", {
      vpc: this.vpc,
      networkAclName: "EC2CodeNetworkACL",
      subnetSelection: { subnets: publicSubnets },
    });

    if (props.whitelistIps && props.whitelistIps.length > 0) {
      // 🚩 Allow all traffic from whitelist IPs (custom IPs)
      props.whitelistIps.forEach((ip, index) => {
        networkACL.addEntry(`AllowAllInboundFromWhitelist${index}`, {
          ruleNumber: 100 + index,
          cidr: ec2.AclCidr.ipv4(NetworkUtils.formatToCidr(ip)),
          traffic: ec2.AclTraffic.allTraffic(), // All protocols, all ports
          direction: ec2.TrafficDirection.INGRESS,
          ruleAction: ec2.Action.ALLOW,
        });
      });

      // 🚩 Allow inbound Ephemeral Ports (1024-65535) for Internet responses
      networkACL.addEntry(`AllowEphemeralInbound`, {
        ruleNumber: 200,
        cidr: ec2.AclCidr.anyIpv4(),
        traffic: ec2.AclTraffic.tcpPortRange(1024, 65535),
        direction: ec2.TrafficDirection.INGRESS,
        ruleAction: ec2.Action.ALLOW,
      });

      // 🚩 Allow all outbound traffic (Internet, package download, Docker install)
      networkACL.addEntry(`AllowAllOutbound`, {
        ruleNumber: 100,
        cidr: ec2.AclCidr.anyIpv4(),
        traffic: ec2.AclTraffic.allTraffic(),
        direction: ec2.TrafficDirection.EGRESS,
        ruleAction: ec2.Action.ALLOW,
      });
    } else {
      // 🚩 If no whitelist IPs → allow everything (open)
      networkACL.addEntry("AllowAllInbound", {
        ruleNumber: 100,
        cidr: ec2.AclCidr.anyIpv4(),
        traffic: ec2.AclTraffic.allTraffic(),
        direction: ec2.TrafficDirection.INGRESS,
        ruleAction: ec2.Action.ALLOW,
      });

      networkACL.addEntry("AllowAllOutbound", {
        ruleNumber: 100,
        cidr: ec2.AclCidr.anyIpv4(),
        traffic: ec2.AclTraffic.allTraffic(),
        direction: ec2.TrafficDirection.EGRESS,
        ruleAction: ec2.Action.ALLOW,
      });
    }

    // ✅ Ensure deletion on `cdk destroy`
    (this.vpc.node.defaultChild as cdk.CfnResource).applyRemovalPolicy(
      cdk.RemovalPolicy.DESTROY
    );
  }
}
