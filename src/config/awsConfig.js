// AWS Amplify Configuration
// このファイルは本番環境でのみ使用されます
// useMock = false の場合に読み込まれます

// aws-exports.js が存在する場合はそちらを優先
let amplifyConfig;

try {
  const awsExports = await import('./aws-exports.js');
  amplifyConfig = awsExports.default;
} catch (e) {
  // aws-exports.js が存在しない場合は環境変数から設定
  amplifyConfig = {
    aws_project_region: import.meta.env.VITE_AWS_REGION || 'ap-northeast-1',
    aws_cognito_region: import.meta.env.VITE_AWS_REGION || 'ap-northeast-1',
    aws_user_pools_id: import.meta.env.VITE_USER_POOL_ID,
    aws_user_pools_web_client_id: import.meta.env.VITE_USER_POOL_CLIENT_ID,
    aws_cognito_identity_pool_id: import.meta.env.VITE_IDENTITY_POOL_ID,
    aws_appsync_graphqlEndpoint: import.meta.env.VITE_GRAPHQL_ENDPOINT,
    aws_appsync_region: import.meta.env.VITE_AWS_REGION || 'ap-northeast-1',
    aws_appsync_authenticationType: 'AMAZON_COGNITO_USER_POOLS',
    aws_user_files_s3_bucket: import.meta.env.VITE_S3_BUCKET,
    aws_user_files_s3_bucket_region: import.meta.env.VITE_AWS_REGION || 'ap-northeast-1',
  };
}

export const awsConfig = {
  Auth: {
    Cognito: {
      userPoolId: amplifyConfig.aws_user_pools_id,
      userPoolClientId: amplifyConfig.aws_user_pools_web_client_id,
      identityPoolId: amplifyConfig.aws_cognito_identity_pool_id,
      loginWith: {
        email: true
      },
      signUpVerificationMethod: 'code',
      userAttributes: {
        email: {
          required: true
        },
        name: {
          required: true
        }
      },
      passwordFormat: {
        minLength: 8,
        requireLowercase: false,
        requireUppercase: false,
        requireNumbers: false,
        requireSpecialCharacters: false
      }
    }
  },
  API: {
    GraphQL: {
      endpoint: amplifyConfig.aws_appsync_graphqlEndpoint,
      region: amplifyConfig.aws_appsync_region,
      defaultAuthMode: 'userPool'
    }
  },
  Storage: {
    S3: {
      bucket: amplifyConfig.aws_user_files_s3_bucket,
      region: amplifyConfig.aws_user_files_s3_bucket_region
    }
  }
};

// Initialize Amplify (本番環境で使用)
export const configureAmplify = async () => {
  const { Amplify } = await import('aws-amplify');
  Amplify.configure(awsConfig);
};

