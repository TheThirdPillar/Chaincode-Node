// TODO: Check for response status
const { validationResult } = require('express-validator')

/* Application chaincodes */
const identity = require('../chaincode/identity')
const gigs = require('../chaincode/gigs')

/* Data models */
var Application = require('../models/application')
const e = require('express')
const { response } = require('express')

// TODO: Move this inside the chaincode
exports.profileUpload = (req, res) => {
    let user = req.user
    let file = req.file
    identity.uploadPhoto(file, user, (response) => {
        if (response.status === 'SUCCESS') {
            return res.status(200).json(response)
        } else {
            return res.status(400).json(response)
        }
    })
}

exports.registerApplication = (req, res) => {
    
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({status: 'FAILED', errors: errors.array()})
    }

    try {
        let application = new Application({
            appName: req.body.appName,
            appId: req.body.appId,
            owner: req.user._id
        })
        application.save((error, application) => {
            if (error) {
                return res.status(500).json({status: 'FAILED', message: 'Failed to register community at the moment.'})
            }
            return res.status(200).json({status: 'SUCCESS', message: 'Successfully registered the application.', application: application})
        })
    } catch (error) {
        return res.status(500).json({status: 'FAILED', error: error})
    }
}

exports.applicationGetter = (req, res) => {
    // TODO: Automate

    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({status: 'FAILED', errors: errors.array()})
    }

    try {
        if (req.params['appId'] === 'identity') {
            if (req.params['functionName'] === 'searchApplicationUserByUsername') {
                let searchedUsername = req.query['search']
                if (!searchedUsername) return res.status(400).json({status: "FAILED", message: "Please provide username in request body."})

                identity.searchApplicationUserByUsername(searchedUsername, (response) => {
                    return res.status(200).json(response)
                })
            } else if (req.params['functionName'] === 'getUserData') {
                let user = req.user
                identity.getUserData(user, (response) => {
                    if (response.status === 'SUCCESS') {
                        return res.status(200).json(response)
                    } else {
                        return res.status(400).json(response)
                    }
                })
            } else if (req.params['functionName'] === 'getRequests') {
                let userapplication = req.user
                identity.getAllRequests(userapplication, (response) => {
                    if (response.status === 'SUCCESS') {
                        return res.status(200).json(response)
                    } else {
                        return res.status(400).json(response)
                    }
                })
            } else if (req.params['functionName'] === 'getPubicProfile') {
                let username = req.query['username']
                identity.getPubicProfile(username, (response) => {
                    if (response.status === 'SUCCESS') {
                        return res.status(200).json(response)
                    } else {
                        return res.status(400).json(response)
                    }
                })
            } else if (req.params['functionName'] === 'getDocuments') {
                let user = req.user
                identity.getAllDocuments(user, (response) => {
                    if (response.status === 'SUCCESS') {
                        return res.status(200).json(response)
                    } else {
                        return res.status(400).json(response)
                    }
                })
            } else if (req.params['functionName'] === 'getUserSkillData') {
                let user = req.user
                identity.getUserSkillData(user, (response) => {
                    if (response.status === 'SUCCESS') {
                        return res.status(200).json(response)
                    } else {
                        return res.status(400).json(response)
                    }
                })
            } else {
                console.log(req.params['functionName'])
                return res.status(400).json({status: 'FAILED', message: 'Invalid function name'})
            }
        } else if (req.params['appId'] === 'gigs') {
            if (req.params['functionName'] === 'getAdminData') {
                let user = req.user
                gigs.getAdminData(user, (response) => {
                    if (response.status === 'SUCCESS') {
                        return res.status(200).json(response)
                    } else {
                        return res.status(400).json(response)
                    }
                })
            } else if (req.params['functionName'] === 'getGigsData') {
                let user = req.user
                gigs.getGigsData(user, (response) => {
                    if (response.status === 'SUCCESS') {
                        return res.status(200).json(response)
                    } else {
                        return res.status(400).json(response)
                    }
                })
            } else {
                return res.status(400).json({status: 'FAILED', message: 'Invalid function name'})
            } 
        } else {
            return res.status(400).json({status: 'FAILED', message: 'Invalid application id'})
        }
    } catch (error) {
        console.error(error)
        return res.status(500).json({status: 'FAILED', error: error })
    }
}

exports.applicationSetter = (req, res) => {
    // This is to handle post requests, 
    // TODO: Automated discovery

    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({status: 'FAILED', errors: errors.array()})
    }

    try {

        let formData = req.body
        let user = req.user
        if (req.params['appId'] === 'identity') {
            if (req.params['functionName'] === 'registerUser') {
                identity.registerUser(formData, user, (response) => {
                    if (response.status === 'SUCCESS') {
                        return res.status(200).json(response)
                    } else {
                        return res.status(400).json(response)
                    }
                })
            } else if (req.params['functionName'] === 'addEducationRecord') {
                identity.addEducationRecord(formData, user, (response) => {
                    if (response.status === 'SUCCESS') {
                        return res.status(200).json(response)
                    } else {
                        return res.status(400).json(response)
                    }
                })
            } else if (req.params['functionName'] === 'addProfessionalRecord') {
                identity.addProfessionalRecord(formData, user, (response) => {
                    if (response.status === 'SUCCESS') {
                        return res.status(200).json(response)
                    } else {
                        return res.status(400).json(response)
                    }
                })
            } else if (req.params['functionName'] === 'addSkillRecord') {
                identity.addSkillRecord(formData, user, (response) => {
                    if (response.status === 'SUCCESS') {
                        return res.status(200).json(response)
                    } else {
                        return res.status(400).json(response)
                    }
                })
            } else if (req.params['functionName'] === 'updateUser') {
                identity.updateUser(formData, user, (response) => {
                    if (response.status === 'SUCCESS') {
                        return res.status(200).json(response)
                    } else {
                        return res.status(400).json(response)
                    }
                })
            } else if (req.params['functionName'] === 'addDocument') {
                identity.addDocument(formData, user, (response) => {
                    if (response.status === 'SUCCESS') {
                        return res.status(200).json(response)
                    } else {
                        return res.status(400).json(response)
                    }
                })
            } else if (req.params['functionName'] === 'handleIdentityDocument') {
                identity.handleIdentityDocument(formData, user, (response) => {
                    if (response.status === 'SUCCESS') {
                        return res.status(200).json(response)
                    } else {
                        return res.status(400).json(response)
                    }
                })
            } else if (req.params['functionName'] === 'requestVerification') {
                identity.requestVerification(formData, user, (response) => {
                    if (response.status === 'SUCCESS') {
                        return res.status(200).json(response)
                    } else {
                        return res.status(400).json(response)
                    }
                })
            } else if (req.params['functionName'] === 'requestAccess') {
                identity.requestDocumentAccess(formData, user, (response) => {
                    if (response.status === 'SUCCESS') {
                        return res.status(200).json(response)
                    } else {
                        return res.status(400).json(response)
                    }
                })
            } else if (req.params['functionName'] === 'handleProductivityStack') {
                identity.handleProductivityStack(formData, user, (response) => {
                    if (response.status === 'SUCCESS') {
                        return res.status(200).json(response)
                    } else {
                        return res.status(400).json(response)
                    }
                })
            } else if (req.params['functionName'] === 'requestStackValidation') {
                identity.requestStackValidation(formData, user, (response) => {
                    if (response.status === 'SUCCESS') {
                        return res.status(200).json(response)
                    } else {
                        return res.status(400).json(response)
                    }
                })
            } else {
                return res.status(400).json({status: 'FAILED', message: 'Invalid function name'})
            }
        } else if (req.params['appId'] === 'gigs') {
            if (req.params['functionName'] === 'addGig') {
                gigs.addGig(formData, user, (response) => {
                    if (response.status === 'SUCCESS') {
                        return res.status(200).json(response)
                    } else {
                        return res.status(400).json(response)
                    }
                })
            } else if (req.params['functionName'] === 'bookmarkGig') {
                gigs.bookmarkGig(formData, user, (response) => {
                    if (response.status === 'SUCCESS') {
                        return res.status(200).json(response)
                    } else {
                        return res.status(400).json(response)
                    }
                })
            } else if (req.params['functionName'] === 'gigApplication') {
                gigs.gigApplication(formData, user, (response) => {
                    if (response.status === 'SUCCESS') {
                        return res.status(200).json(response)
                    } else {
                        return res.status(400).json(response)
                    }
                })
            } else if (req.params['functionName'] === 'gigSubmission') {
                gigs.gigSubmission(formData, user, (response) => {
                    if (response.status === 'SUCCESS') {
                        return res.status(200).json(response)
                    } else {
                        return res.status(400).json(response)
                    }
                })
            } else {
                return res.status(400).json({status: 'FAILED', message: 'Invalid function name'})
            }
        } else {
            return res.status(400).json({status: 'FAILED', message: 'Invalid application id'})
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json({status: 'FAILED', error: error })
    }
}

exports.applicationPutter = (req, res) => {

    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({status: 'FAILED', errors: errors.array()})
    }

    try {
        let user = req.user
        let formData = req.body
        if (req.params['appId'] === 'identity') {
            if (req.params['functionName'] === 'handleVerification') {
                identity.handleVerificationRequest(formData, user, (response)  => {
                    if (response.status === 'SUCCESS') {
                        return res.status(200).json(response)
                    } else {
                        return res.status(400).json(response)
                    }
                })
            } else if (req.params['functionName'] === 'handleAccess') {
                identity.handleRequestAccess(formData, (response) => {
                    if (response.status === 'SUCCESS') {
                        return res.status(200).json(response)
                    } else {
                        return res.status(400).json(response)
                    }
                })
            } else if (req.params['functionName'] === 'handleVirtues') {
                identity.handleVirtues(formData, user, (response) => {
                    if (response.status === 'SUCCESS') {
                        return res.status(200).json(response)
                    } else {
                        return res.status(400).json(response)
                    }
                })
            } else if (req.params['functionName'] === 'addUserCommunities') {
                identity.addUserCommunities(formData, user, (response) => {
                    if (response.status === 'SUCCESS') {
                        return res.status(200).json(response)
                    } else {
                        return res.status(400).json(response)
                    }
                })
            } else if (req.params['functionName'] === 'handleSoftskills') {
                identity.handleSoftskills(formData, user, (response) => {
                    if (response.status === 'SUCCESS') {
                        return res.status(200).json(response)
                    } else {
                        return res.status(400).json(response)
                    }
                })
            } else {
                return res.status(400).json({status: 'FAILED', message: 'Invalid function name'})
            }
        } else if (req.params['appId'] === 'gigs') {
            if (req.params['functionName'] === 'handleApplication') {
                gigs.handleApplication(formData, (response) => {
                    if (response.status === 'SUCCESS') {
                        return res.status(200).json(response)
                    } else {
                        return res.status(400).json(response)
                    }
                })
            } else if (req.params['functionName'] === "handleSubmission") {
                gigs.handleSubmission(formData, user, (response) => {
                    if (response.status === 'SUCCESS') {
                        return res.status(200).json(response)
                    } else {
                        return res.status(400).json(response)
                    }
                })
            } else {
                return res.status(400).json({status: 'FAILED', message: 'Invalid function name'})
            }
        } else {
            return res.status(400).json({status: 'FAILED', message: 'Invalid application id'})
        }
    } catch (error) {
        console.error(error)
        return res.status(500).json({status: 'FAILED', errors: error})
    }
}

exports.applicationDeleter = (req, res) => {

    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({status: 'FAILED', errors: errors.array()})
    }

    try {
        let user = req.user
        let object = req.params['object']
        let formData = req.body
        if (req.params['appId'] === 'identity') {
            if (req.params['functionName'] === 'deleteItem') {
                identity.deleteItem(formData, (response) => {
                    if (response.status === 'SUCCESS') {
                        return res.status(200).json(response)
                    } else {
                        return res.status(400).json(response)
                    }
                })
            } else {
                return res.status(400).json({status: 'FAILED', message: 'Invalid function name'})
            }
        } else if (req.params['appId'] === 'gigs') {
            if (req.params['functionName'] === 'removeBookmark') {
                gigs.removeBookmark(object, user, (response) => {
                    if (response.status === 'SUCCESS') {
                        return res.status(200).json(response)
                    } else {
                        return res.status(400).json(response)
                    }
                })
            } else {
                return res.status(400).json({status: 'FAILED', message: 'Invalid function name'})
            }
        } else {
            return res.status(400).json({status: 'FAILED', message: 'Invalid application id'})
        }
    } catch (error) {
        return res.status(400).json({status: 'FAILED', errors: error})
    }
}