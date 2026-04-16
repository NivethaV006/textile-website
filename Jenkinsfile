pipeline {
    agent any

    environment {
        // Change to your actual Docker Hub username and image name
        DOCKERHUB_CREDENTIALS = 'dockerhub-credentials'
        DOCKER_IMAGE = 'nivethav006/textile-website:latest'
        KUBECONFIG = credentials('kubeconfig-credentials')
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    echo "Building optimized Node.js Alpine Docker image..."
                    sh "docker build -t ${DOCKER_IMAGE} ."
                }
            }
        }

        stage('Push to Docker Hub') {
            steps {
                script {
                    echo "Pushing image to Docker Hub..."
                    withCredentials([usernamePassword(credentialsId: env.DOCKERHUB_CREDENTIALS, passwordVariable: 'DOCKERHUB_PASS', usernameVariable: 'DOCKERHUB_USER')]) {
                        sh "echo \$DOCKERHUB_PASS | docker login -u \$DOCKERHUB_USER --password-stdin"
                        sh "docker push ${DOCKER_IMAGE}"
                    }
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                script {
                    echo "Deploying to Kubernetes in WSL (Minikube)..."
                    sh "kubectl --kubeconfig \$KUBECONFIG apply -f k8s/deployment.yaml"
                    sh "kubectl --kubeconfig \$KUBECONFIG apply -f k8s/service.yaml"
                    sh "kubectl --kubeconfig \$KUBECONFIG rollout restart deployment textile-app"
                }
            }
        }
    }

    post {
        success {
            echo 'Deployment successful! Application should be available via Minikube.'
        }
        failure {
            echo 'Deployment failed. Please check Jenkins logs.'
        }
    }
}
