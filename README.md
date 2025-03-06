# 🚀 AWS CDK - Developer EC2 Environment

This repository provisions a **Developer Environment** on **AWS EC2** using **AWS CDK (TypeScript)**. 
The setup includes a **VPC, Security Group, and an EC2 Instance**, ensuring a secure and scalable development environment.

## **🌟 Features**
- ✅ **EC2 Instance**: Preconfigured for development tasks, enabling a remote coding environment.
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

## **🛠️ Setup & Deployment**

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
- Deploynment will take some time, once the deployment is done, you will see the public IP of the ec2 instance in the output.
- Direct deploymenet like this will create the ssh key pair and store it in the AWS System manager Parameter Store.
- This key pair will be used to ssh into the ec2 instance.

#### ***📝 Note:***

#### To retrieve the key pair from the parameter store, run the following command:

```sh
bash ../helper-scripts/fetch-aws-parameter-store-key.sh /ec2/keypair/YOUR_KEY_PAIR_ID ../tmp/ACCESS_KEY.pem
```
- Store the key pair in a safe location and use it to ssh into the ec2 instance.

#### If you already have a key pair, you can pass it's public key as a parameter in the file before deploying the stacks. 
[app/lib/config/parameters.ts](app/lib/config/parameters.ts)

  - replace the value of 'ec2KeyPairPublicKeypath' with the path to your public key.
  - since the public key need to be accessible to the CDK running insde the docker container, you can place the public key in the `tmp` folder and pass the path toec2KeyPairPublicKeypath.
  - eg: `ec2KeyPairPublicKeypath: '../tmp/your_public_key.pub'`

### **7️⃣ SSH into the EC2 Instance**
- Retrieve the public IP of the EC2 instance from the AWS Console or the ouput of the CDK deployment.
- Retrieve the key pair from the parameter store using the command mentioned above.\
- Use the key pair to ssh into the EC2 instance:

```sh
ssh -i /path/to/your/ACCESS_KEY.pem USER-NAME@YOUR_EC2_PUBLIC_IP
```

- **USER-NAME** : The user name of the EC2 instance (default: `admin`).
  - if weant to have  your own user name, you can pass it as a parameter in the file [app/lib/config/parameters.ts](app/lib/config/parameters.ts)
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
