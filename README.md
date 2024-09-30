# CDK Development Environment

# Initialize a new CDK project
<!-- THIS COMMAND is Not needed as it is done in the docker image itself; directly execute cdk init -->
```bash
npm i aws-cdk
```

```bash
cdk init app --language=typescript app
```

remoe the git initialized in the app folder
```bash
rm -rf .git
rm -rf .gitignore
```

Bbootstrap the AWS environment that configured.
this prepares the environment for CDK deployments.
```bash
cdk bootstrap
```

# Deployment

# Development

## UseFull Commands
create an `.env` file as in the `.env_copy` file and fill in the necessary values.

cdk init app --language typescript
cdk bootstrap
cdk synth
cdk deploy
cdk diff
<!-- List STacks -->
cdk list
cdk doctor
cdk destroy <Stack Name>
cdk destroy InfraStack
cdk deploy --parameteres durationPara=3


<details>
  <summary># Learning Notes</summary>

  ## STACKS
  Stack represents the unit of deployment in AWS CDK.

  ## CDK CONSTRUCTS
  CDK construct represents a cloud component which encapsulates everything cloud-formation needs to create the required AWS resources
  3 types

  L1, L2 & L3
  ===>===>====>
  Level of encapsulation increases=> 

  ## APP Constructs
  App is a special construct that represents the entire CDK Application.
  The App construct provides the root context
  App can Contain one or more stack  whcih can contain one or more child constructs
  App context is used to contruct, validate and synthesize the cdk constructs

  ## Why removing stack is not removing the resoucrs.
  In AWS CDK, when you create resources using higher-level constructs like L2 and L3, the default behavior is that these resources are not automatically deleted when the stack is destroyed. This is because higher-level constructs often have additional safety measures and considerations in place to prevent accidental deletion of important resources.
  When you destroy a stack, by default, only the resources directly defined in the stack (i.e., L1 constructs) are deleted. Resources created by higher-level constructs (L2 and L3) are not automatically deleted to avoid unintended data loss or disruption to other parts of your infrastructure.

</details>

# Continuous Support and Pathc Management

- Update AWS CDK and Dependencies
```bash
npm install aws-cdk-lib@latest constructs@latest
```