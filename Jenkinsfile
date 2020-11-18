def dockerRepo = 'pub-registry.dev.witcom.services/witcom/id-generator'
def gitRepo = 'https://github.com/witcom-gmbh/id-generator'
def approvalRequired = false;
def getSource = false;
def packageJSONVersion = "UNKNOWN";
pipeline {
    agent none
  
    stages {
        stage('Process Pull-Request'){
            when {
                expression { env.CHANGE_ID != null }
            } 
		    stages {
			    stage('Verify'){
                    when {
                        expression { approvalRequired }
                    }                    
				    steps {
					    script {
						    def userInput
						    try {
							    userInput = input(
								id: 'Proceed1', message: 'Kann der Merge durchgefuehrt werden ?', parameters: [
								[$class: 'BooleanParameterDefinition', defaultValue: true, description: '', name: 'Bitte bestaetigen']
								])
						    } catch(err) { // input false
							    userInput = false
							    echo "This Job has been Aborted"
						    }
						    if (userInput != true) {
							    throw "Pull-request not confirmed"
						    }
					    }
				    }
			    } // end stage-verify
		    } //end stages for pull-request
        }
        stage('Create and publish docker-image from master') {
            when {
                branch 'master'
            }
            stages {
			    stage ('Get sources'){
				    when {
                       expression { getSource }
                    }
					agent { label 'master' }
					steps {
						git credentialsId: 'witcom-jenkins-bot', url: "${gitRepo}"
						script {
							def packageJSON = readJSON file: 'package.json'
							packageJSONVersion = packageJSON.version
						}
						echo packageJSONVersion
					}
				}
				
                stage('Init build'){
                    agent { label 'master' }
                    steps {
                        script {
						    def packageJSON = readJSON file: 'package.json'
						    packageJSONVersion = packageJSON["version"]
						}
						echo packageJSONVersion
	                    stash name:"openshiftbc",includes:"*.yaml"
                    }
                }
                stage('Create OpenShift buildconfigs') {
                    agent { label 'master' }
                    steps {
                        unstash name:"openshiftbc"
                        script {
                            //delete existing buildconfig
                            openshift.withCluster() {
                                openshift.withProject() {
                                    def existingBC = openshift.selector('bc', [build: 'id-generator'])
                                    if(existingBC){
                                        existingBC.delete();
                                    }
                                }
                            }
                            def bc = readYaml file: './openshift-bc.yaml'
                            bc.spec.output.to.name = "${dockerRepo}:${packageJSONVersion}"
							bc.spec.source.git.uri = "${gitRepo}"
                            bc.metadata.name = "id-generator-version"
                            bc.metadata.labels["version"]= "appVersion"
                            timeout(time: 1, unit: 'MINUTES') {
                            openshift.withCluster() {
                                openshift.withProject() {
                                def fromYaml = openshift.create( bc )
                                echo "Created Buildconfig: ${fromYaml.names()}"
                                }
                            }  
                            }
                            //create bc for latest-tag 
                            bc.spec.output.to.name = "${dockerRepo}:latest"
                            bc.metadata.name = "id-generator-latest"
                            bc.metadata.labels["version"]="latest"
							bc.spec.source.git.uri = "${gitRepo}"
                            timeout(time: 1, unit: 'MINUTES') {
                            openshift.withCluster() {
                                openshift.withProject() {
                                def fromYaml = openshift.create( bc )
                                echo "Created Buildconfig: ${fromYaml.names()}"
                                }
                            }  
                            }
                        } //end script
                    } //end steps
                } //end stage
                stage('run version docker build and push ') {
                    agent { label 'master' }
                    steps {
                        script {
		                    timeout(time: 20, unit: 'MINUTES') {
                            openshift.withCluster() {
                                openshift.withProject() {
                                def bc = openshift.selector('bc', [build: 'id-generator',version:'appVersion'])
                                //def buildSelector = bc.startBuild("--from-file=target/app.jar")
								def buildSelector = bc.startBuild();
                                echo "Found ${bc.count()} buildconfigs - expecting 1"
                                def blds = bc.related('builds')
                                blds.untilEach() {
                                    return it.object().status.phase == "Complete"
                                }
                                //delete build configs
                                echo "Deleting the buildconfig....."
                                bc.delete()

                                }
                            }  
                        } // end timeout                
                        } // end script
                    } //end steps
                } // end stage     
                stage('run latest docker build and push') {
                    agent { label 'master' }
                    steps {
                        script {
                        timeout(time: 20, unit: 'MINUTES') {
                            openshift.withCluster() {
                                openshift.withProject() {
                                def bc = openshift.selector('bc', [build: 'id-generator',version:'latest'])
                                def buildSelector = bc.startBuild()
                                echo "Found ${bc.count()} buildconfigs - expecting 1"
                                def blds = bc.related('builds')
                                blds.untilEach() {
                                    return it.object().status.phase == "Complete"
                                }
                                //delete build configs
                                echo "Deleting the buildconfig....."
                                bc.delete()

                                }
                            }  
                        } // end timeout                
                        } // end script
                    } //end steps
                } // end stage
            }     
        }// End Create and publish docker-image from master
    } // end stages
}
