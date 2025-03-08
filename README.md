# 🚀 AWS CDK - Developer EC2 Environment

This repository provisions a **Developer Environment** on **AWS EC2** using **AWS CDK (TypeScript)**. 
The setup includes a **VPC, Security Group, and an EC2 Instance**, ensuring a secure and scalable development environment.

## **🌟 Features**
- ✅ **EC2 Instance**: Pre-configured for development tasks, enabling a remote coding environment.
- ✅ **VPC (Virtual Private Cloud)**: Isolated networking for enhanced security.
- ✅ **Security Group**: Controlled inbound and outbound access to allow secure SSH and development tools.
- ✅ **Scalability**: Supports heavy workloads for software builds, testing, and development.
- ✅ **Infrastructure as Code**: Easily deploy, modify, and manage using AWS CDK.

## **🚀 Upcoming Features**
- ✨ **Resource Scheduling**: Start and stop the EC2 instance based on a  developer's schedule.
- ✨ **Auto Scaling**: Automatically scale the EC2 instance based on the workload.
- ✨ **Monitoring & Logging**: Implement CloudWatch for monitoring and logging.
- ✨ **Cost Display**: Present the usage statistics along with the estimated bill amount and duration.

---

## **💪🏼 Technologies**
- **AWS CDK (TypeScript)**: Infrastructure as Code for provisioning AWS resources.
- **AWS EC2**: Virtual server for development and deployment.
- **AWS VPC**: Isolated networking environment for secure communication.
- **AWS Security Group**: Firewall rules for controlling inbound and outbound traffic.
- **Docker & Docker Compose**: Containerization for building and deploying the application.

---

## **📌 Prerequisites**
Before deploying, ensure you have the following:
- **AWS Account** with permissions to create EC2, VPC, and security groups.
- **Docker and Docker Compose** (Latest version)- [Download](https://www.docker.com/products/docker-desktop/)

---

## **🛠️ Configuration: Understanding `parameters.ts`**

The `parameters.ts` file defines the environment configuration for deploying EC2 instances. It includes two primary modes:

### **1️⃣ Test Mode (`test`)**
- Used for testing and developing new features in AWS CDK.
- Deploys a minimal EC2 instance to **reduce costs** while still allowing feature validation.

### **2️⃣ Development Mode (`dev`)**
- Deploys the **actual EC2 instance** used for software development.
- Ensures a full-fledged development environment for engineers.

### **🔹 Environment Configuration (`env`)**
```ts
env: {
  account: process.env.AWS_ACCOUNT_ID,
  region: process.env.AWS_DEFAULT_REGION,
}
```
- Defines the **AWS Account ID** and **Region** where the resources will be deployed.
- Helps avoid **cross-stack reference errors** in AWS CDK.

### **🔹 `devInstanceServiceProps`: EC2 Instance Configuration**
- An **object**, where all the properties inside it represent the properties used under the service `devInstanceService` .

### **🔊 Key Parameters in `ec2Instances` under `devInstanceServiceProps`**
- `ec2Instances`: An **array of objects**, where each object defines an EC2 instance's parameters.
- If you need **10 EC2 instances for 10 developers**, you simply add **10 objects** to this array.

#### **1️⃣ `keyPairName`**
- Specifies the **name of the SSH Key Pair** that will be associated with the EC2 instance.
- Can be found in **AWS Console → EC2 → Key Pairs**.

#### **2️⃣ `keyPairPublicKeyPath`** (Optional)
- Specifies the **path** to an **existing SSH public key**.
- If provided, **CDK will not generate a new key pair**, instead, it will use the provided public key.
- If not provided, **CDK automatically creates a key pair** and stores it in **AWS Systems Manager Parameter Store**.

📞 **Reference**: [AWS CDK Key Pair Documentation](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_ec2.CfnKeyPair.html)

#### **3️⃣ `ec2InstanceUsername`** (Optional)
- Defines the **user account** inside the EC2 instance.
- By default, Debian-based EC2 instances use **`admin`**.
- If a custom username is provided, it will be created within the EC2 instance.
- This username is used for SSH login.

#### **4️⃣ `ec2InstanceType`**
- Specifies the **EC2 instance type** for development.
- Choose an instance type based on your workload and budget.

📞 **Reference**: [AWS EC2 Instance Types](https://aws.amazon.com/ec2/instance-types/)

#### **5️⃣ `ingressRules`** (Security Group Rules)
- Defines **inbound traffic rules** for the EC2 instance's Security Group.
- Each rule consists of:
  - **`port`**: The port number to allow traffic (e.g., SSH, HTTP).
  - **`source`**: Defines where the traffic is allowed from.

##### **Example: Security Rules for a React Developer**
```ts
[
  { port: 22, source: ec2.Peer.anyIpv4() },  // SSH access from anywhere
  { port: 5173, source: ec2.Peer.anyIpv4() }, // Vite React app
  { port: 3000, source: ec2.Peer.anyIpv4() }, // Backend service
  { port: 8080, source: ec2.Peer.anyIpv4() }, // Database viewer
]
```
- Ensures that developers can SSH into the instance and run their applications.

---

### **🫧 Summary**
- **Test Mode (`test`)**: Cost-efficient EC2 for AWS CDK feature testing.
- **Dev Mode (`dev`)**: Full-scale EC2 for software development.
- **Flexible EC2 Configuration**: Supports multiple EC2 instances with customizable parameters.
- **Automated Key Management**: Uses either an existing key pair or generates one via AWS Systems Manager.
- **Secure Access Rules**: Defines controlled inbound access via **Security Groups**.

This structured parameterization allows teams to **dynamically provision development environments** in AWS with minimal manual effort. 🚀

---

## **⚙️ Setup & Deployment**

### **1️⃣ Clone the Repository**
[![Clone Repo](https://img.shields.io/badge/Clone-Repository-blue?style=for-the-badge&logo=github)](https://github.com/prasad-vamer)

```sh
cd <TO_REPOSITORY_FOLDER>
```

### **2️⃣ Configure AWS Credentials in Environment Variables**
```sh
create a `.env` file as in the `.env_copy` file and fill in the necessary values.
```

### **3️⃣ Build the Docker Image**
```sh
docker-compose build
```

### **4️⃣ Run the Docker Container**
```sh
docker compose run --rm app bash
```

### **5️⃣ Bootstrap CDK environment**
- Initialize the CDK environment by bootstrapping the AWS environment.
- Perform this step only if not done already.
```sh
cdk bootstrap
```

### **6️⃣ Deploy the CDK Stack**
- Deploy the CDK stack to create the EC2 instance.
```sh
cdk deploy DevInstanceStage/*
```
- Deployment will take some time, once the deployment is done, you will see the public IP of the ec2 instance in the output.
- Direct deployment like this will create the ssh key pair and store it in the AWS System manager Parameter Store.
- This key pair will be used to ssh into the ec2 instance.

#### ***📝 Note:***

#### To retrieve the key pair from the parameter store, run the following command:

```sh
bash ../helper-scripts/fetch-aws-parameter-store-key.sh /ec2/keypair/YOUR_KEY_PAIR_ID ../tmp/ACCESS_KEY.pem
```
- Store the key pair in a safe location and use it to ssh into the ec2 instance.

#### If you already have a key pair, you can pass it's public key as a parameter in the file before deploying the stacks. 
[app/lib/config/parameters.ts](app/lib/config/parameters.ts)

  - replace the value of 'keyPairPublicKeyPath' with the path to your public key.
  - since the public key need to be accessible to the CDK running inside the docker container, you can place the public key in the `tmp` folder and pass the path to keyPairPublicKeyPath.
  - eg: `keyPairPublicKeyPath: '../tmp/your_public_key.pub'`

### **7️⃣ SSH into the EC2 Instance**
- Retrieve the public IP of the EC2 instance from the AWS Console or the output of the CDK deployment.
- Retrieve the key pair from the parameter store using the command mentioned above.\
- Use the key pair to ssh into the EC2 instance:

```sh
ssh -i /path/to/your/ACCESS_KEY.pem USER-NAME@YOUR_EC2_PUBLIC_IP
```

- **USER-NAME** : The user name of the EC2 instance (default: `admin`).
  - if you want to have  your own user name, you can pass it as a parameter in the file [app/lib/config/parameters.ts](app/lib/config/parameters.ts)
  - replace the value of 'ec2InstanceUsername' with your desired user name.
- **YOUR_EC2_PUBLIC_IP** : The public IP of the EC2 instance.

--- 

## **🔗 Useful Commands**

### **🔑 GENERATE SSH KEY PAIR**
```sh
ssh-keygen -t rsa -b 4096 -m PEM -f MyEc2Key.pem
```

#### **🔐 Secure the Key Pair**
```sh
chmod 400 MyEc2Key.pem
```

### Get the public IP of the ec2 instances
```sh
aws ec2 describe-instances --query "Reservations[].Instances[].PublicIpAddress" 
```

### **🧹 Clean Up**
- Delete the CDK stack to remove the EC2 instance.

```sh
cdk destroy DevInstanceStage/*
```
