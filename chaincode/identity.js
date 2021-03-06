/* Data models */
const Application = require('../models/application')
const userapplication = require('../models/userapplication')
const UserApplication = require('../models/userapplication')
const Record = require('../models/record')
const UserSkillData = require('../models/userskilldata')
const Document = require('../models/document')
const Request = require('../models/request')
const User = require('../models/user')
const Identity = require('../models/identity')
const Community = require('../models/community')
const UserCommunity = require('../models/usercommunity')
const EmailRequest = require('../models/emailRequests')
const WellBeingStack = require('../models/wellBeingStack')
const WellBeingValidation = require('../models/wellBeingValidation')

const request = require('../models/request')
const identity = require('../models/identity')
const { response } = require('express')
const e = require('express')

// TODO: Application Search will be repeated here,
// must be updated once route validators are improved.

module.exports = (() => {
    return {
        searchApplicationUserByUsername: (searchedUsername, callback) => {
            try {
                Identity.findByUsername(searchedUsername.toLowerCase(), (error, user) => {
                    if (error) {
                        let response = {
                            status: 'FAILED',
                            errors: error
                        }
                        return callback(response)
                    } else {
                        let response = {
                            status: 'SUCCESS',
                            user: user
                        }
                        return callback(response)
                    }
                })
            } catch (error) {
                let response = {
                    status: "FAILED",
                    error: error
                }
                console.log(error)
                callback(response)
            }
        },
        registerUser: (formData, user, callback) => {
            try {
                Identity.findByShieldUser(user, (error, user) => {
                    if (error) {
                        let response = {
                            status: 'FAILED',
                            errors: error
                        }
                        return callback(response)
                    } else {
                        let {username, ...profile} = formData
                        user.username = username.toLowerCase()
                        user.profile = profile
                        user.save((error, user) => {
                            if (error) {
                                let response = {
                                    status: 'FAILED',
                                    errors: error
                                }
                                return callback(response)
                            } else {
                                let response = {
                                    status: 'SUCCESS',
                                    user: user
                                }
                                return callback(response)
                            }
                        })
                    }
                })
            } catch (error) {
                console.log(error)
                let response = {

                    status: "FAILED",
                    error: error
                }
                callback(response)
            }
        },
        uploadPhoto: (file, user, callback) => {
            try {
                Identity.findByShieldUser(user, (error, identity) => {
                    if (error) {
                        let response = {
                            status: "FAILED",
                            errors: error
                        }
                        return callback(response)
                    }
                    identity.profile.avatar = file.path
                    identity.markModified('profile')
                    identity.save((error, saved) => {
                        if (error) {
                            let response = {
                                status: "FAILED",
                                errors: error
                            }
                            return callback(response)
                        } else {
                            let response = {
                                status: "SUCCESS",
                                messages: "Successfully updated the profile picture.",
                                updated: saved.profile.avatar
                            }
                            return callback(response)
                        }
                    })
                })
            } catch (error) {
                let response = {
                    status: "FAILED",
                    errors: error
                }
                return callback(response)
            }
        },
        addEducationRecord: (formData, user, callback) => {
            try {

                let record = new Record({
                    type: 'education',
                    recordData: formData
                })

                record.save((error, savedRecord) => {
                    if (error) {
                        let response = {
                            status: 'FAILED',
                            error: error
                        }
                        return callback(response)
                    } else {
                        Identity.findByShieldUser(user, (error, user) => {
                            if (error) {
                                let response = {
                                    status: 'SUCCSESS',
                                    errors: error
                                }
                                return callback(response)
                            } else {
                                user.educationRecords.push(savedRecord)
                                user.save((error, user) => {
                                    if (error) {
                                        let response = {
                                            status: 'FAILED',
                                            errors: error
                                        }
                                        return callback(response)
                                    } else {
                                        let response = {
                                            status: 'SUCCESS',
                                            user: user,
                                            message: 'Successfully added the educational record.'
                                        }
                                        return callback(response)
                                    }
                                })    
                            }
                        })
                    }
                })
            } catch (error) {
                let response = {
                    status: 'FAILED',
                    error : error
                }
                return callback(response)
            }
        },
        addProfessionalRecord: (formData, user, callback) => {
            try {

                let record = new Record({
                    type: 'professional',
                    recordData: formData
                })

                record.save((error, savedRecord) => {
                    if (error) {
                        let response = {
                            status: 'FAILED',
                            error: error
                        }
                        return callback(response)
                    } else {
                        Identity.findByShieldUser(user, (error, user) => {
                            if (error) {
                                let response = {
                                    status: 'FAILED',
                                    errors: error
                                }
                                return callback(response)
                            } else {
                                user.professionalRecords.push(savedRecord)
                                user.save((error, user) => {
                                    if (error) {
                                        let response = {
                                            status: 'FAILED',
                                            errors: error
                                        }
                                        return callback(response)
                                    } else {
                                        let response = {
                                            status: 'SUCCESS',
                                            user: user,
                                            message: 'Successfully added the professional record.'
                                        }
                                        return callback(response)
                                    }
                                })
                            }
                        })
                    }
                })
            } catch (error) {
                let response = {
                    status: 'FAILED',
                    error : error
                }
                return callback(response)
            }
        },
        addSkillRecord: (formData, user, callback) => {
            try {
                let userskilldata = new UserSkillData({
                    data: formData
                })
                userskilldata.save((error, skilldata) => {
                    if (error) {
                        let response = {
                            status: 'FAILED',
                            message: 'Unable to execute transaction'
                        }
                        return callback(response)
                    } else {
                        Identity.findByShieldUser(user, (error, user) => {
                            if (error) {
                                let response = {
                                    status: 'FAILED',
                                    errors: error
                                }
                                return callback(response)
                            } else {
                                user.skillRecords.push(skilldata)
                                user.save((error, user) => {
                                    if (error) {
                                        let response = {
                                            status: 'FAILED',
                                            errors: error
                                        }
                                        return callback(response)
                                    } else {
                                        let response = {
                                            status: 'SUCCESS',
                                            user: user,
                                            message: 'Successfully added the skill record.'
                                        }
                                        return callback(response)
                                    }
                                })
                            }
                        })
                    }
                })
                 // TODO: Add skills mentioned by user to the skillDB
            } catch (error) {
                let response = {
                    status: 'FAILED',
                    errors: error
                }
                return callback(response)
            }
        },
        getUserData: (user, callback) => {
            try {
                Identity.findOne({shieldUser: user._id})
                .populate({path: 'identityDocuments', populate: [{path: 'signed', ref: 'Request'}, {path: 'signedBy', ref: 'Identity', populate: {path: 'admin', ref:'Community'}}]})
                .populate({path: 'educationRecords', populate: {path: 'documents', populate: [{path: 'signed'}, {path: 'signedBy', populate: {path: 'admin'}}]}})
                .populate({path: 'professionalRecords', populate: {path: 'documents', populate: [{path: 'signed'}, {path: 'signedBy', populate: {path: 'admin'}}]}})
                .populate({path: 'skillRecords'})
                .populate({path: 'wellBeingStacks', populate: {path: 'WellBeingStack'}})
                .populate({path: 'wellBeingValidation', ref: 'WellBeingValidation', populate: [{path: 'wellBeingValidator', ref: 'Identity'}, {path: 'wellBeingValidatorCommunity', ref: 'Community'}]})
                .populate({path: 'communities', ref: 'UserCommunity', populate: {path: 'community', ref: 'Community'}})
                .populate({path: 'admin', ref: 'Community'})
                .exec((error, identityData) => {
                    if (error) {
                        let response = {
                            status: 'FAILED',
                            message: 'Unable to fetch userdata'
                        }
                        return callback(response)
                    } else {
                        if (!identityData) {
                            let newIdentityUser = new Identity({
                                shieldUser: user._id
                            })
                            newIdentityUser.save((error, savedDocument) => {
                                if (error) {
                                    let response = {
                                        status: 'FAILED',
                                        errors: error
                                    }
                                    return callback(response)
                                } else {
                                    let response = {
                                        status: 'SUCCESS',
                                        user: savedDocument
                                    }
                                    return callback(response)
                                }
                            })
                        } else {
                            let response = {
                                status: 'SUCCESS',
                                user: identityData
                            }
                            return callback(response)
                        }
                    }
                })
            } catch (error) {
                console.error(error)
                let response = {
                    status: 'FAILED',
                    errors: error
                }
                return callback(response)
            }
        },
        updateUser: (formData, user, callback) => {
            try {
                Identity.findByShieldUser(user, (error, identity) => {
                    if (error) {
                        let response = {
                            status: "FAILED",
                            errors: error
                        }
                        return callback(response)
                    } else {
                        identity.profile = formData
                        // Object.assign(userapplication.applicationData, {'profile': formData})
                        // userapplication.markModified('applicationData')
                        identity.save((error, saved) => {
                            if (error) {
                                let response = {
                                    status: "FAILED",
                                    errors: error
                                }
                                return callback(response)
                            } else {
                                let response = {
                                    status: "SUCCESS",
                                    message: "Profile successfully updated.",
                                    updated: saved
                                }
                                return callback(response)
                            }
                        })
                    }
                })
            } catch (error) {
                let response = {
                    status: "FAILED",
                    errors: error
                }
                return callback(response)
            }
        },
        addDocument: (formData, user, callback) => {
            // TODO: Prevent document duplication - IPFS multihash can be used here ??
            try {
                let recordId = formData.recordId
                Identity.findByShieldUser(user, (error, identity) => {
                    if (error) {
                        let response = {
                            status: "FAILED",
                            errors: error
                        }
                        return callback(response)
                    } else {
                        Record.findById(recordId, (error, record) => {
                            if (error) {
                                let response = {
                                    status: "FAILED",
                                    error: error
                                }
                                return callback(response)
                            } else {
                                // TODO: if record save fails, we should undo document save as well or find ways to retry.
                                // TODO: IPFS integrations
                                let document = new Document({
                                    encryptedFile: formData.encryptedFile,
                                    owner: identity._id,
                                    encryptedKey: formData.encryptedKey,
                                    record: record._id
                                })
                                document.save((error, document) => {
                                    if (error) {
                                        let response = {
                                            status: "FAILED",
                                            error: error
                                        }
                                        return callback(response)
                                    } else {
                                        record.documents.push(document)
                                        record.markModified('documents')
                                        record.save((error, record) => {
                                            if (error) {
                                                let response = {
                                                    status: "FAILED",
                                                    error: error
                                                }
                                                return callback(response)
                                            } else {
                                                let response = {
                                                    status: "SUCCESS",
                                                    message: "Successfully added the document.",
                                                    record: record,
                                                    document: document
                                                }
                                                return callback(response)
                                            }
                                        })
                                    }
                                })
                            }
                        })
                    }
                })
            } catch (error) {
                let response = {
                    status: 'FAILED',
                    errors: error
                }
                return callback(response)
            }
        },
        handleIdentityDocument: (formData, user, callback) => {
            // TODO: Document types could be added here
            try {
                Identity.findByShieldUser(user, (error, identity) => {
                    if (error) {
                        let response = {
                            status: "FAILED",
                            errors: error
                        }
                        return callback(response)
                    } else {
                        let document = new Document({
                            encryptedFile: formData.encryptedFile,
                            owner: identity._id,
                            encryptedKey: formData.encryptedKey,
                        })
                        document.save((error, document) => {
                            if (error) {
                                let response = {
                                    status: "FAILED",
                                    error: error
                                }
                                return callback(response)
                            } else {
                                identity.identityDocuments.push(document)
                                identity.save((error, updatedIdentity) => {
                                    if (error) {
                                        let response = {
                                            status: "FAILED",
                                            error: error
                                        }
                                        return callback(response)
                                    } else {
                                        let response = {
                                            status: "SUCCESS",
                                            message: "Successfully added the document.",
                                            identity: updatedIdentity,
                                            document: document
                                        }
                                        return callback(response)
                                    }
                                })
                            }
                        })
                    }
                })
            } catch (error) {
                let response = {
                    status: 'FAILED',
                    errors: error
                }
                return callback(response)
            }
        },
        requestVerification: (formData, user, callback) => {
            /* 
            / ? - 3 calls being made to match identity with user type (both receiving and requesting user)
            / ? - Finish Identity model todo and update here. Extremely important.
            */
            try {
                Document.findById(formData.document, (error, document) => {
                    if (error) {
                        let response = {
                            status: 'FAILED',
                            errors: error
                        }
                        return callback(response)
                    } else {
                        User.findUserByPublicKey(formData.receiverPublicKey, (error, receivingUser) => {
                            if (error) {
                                let response = {
                                    status: 'FAILED',
                                    errors: error
                                }
                                return callback(response)
                            } else {
                                Identity.findByShieldUser(receivingUser, (error, receivingUserIdentity) => {
                                    if (error) {
                                        let response = {
                                            status: 'FAILED',
                                            errors: error
                                        }
                                        return callback(response)
                                    } else {
                                        Identity.findByShieldUser(user, (error, requestingUserIdentity) => {
                                            if (error) {
                                                let response = {
                                                    status: 'FAILED',
                                                    error: error
                                                }
                                                return callback(response)
                                            } else {
                                                let request = new Request({
                                                    type: 'verification',
                                                    document: document._id,
                                                    requestedBy: requestingUserIdentity,
                                                    requestedTo: receivingUserIdentity,
                                                    sharedKey: formData.sharedKey
                                                })
                                                request.save((error, request) => {
                                                    if (error) {
                                                        let response = {
                                                            status: 'FAILED',
                                                            errors: error
                                                        }
                                                        return callback(response)
                                                    } else {
                                                        document.signed = request
                                                        document.save((error, document) => {
                                                            if (error) {
                                                                let response = {
                                                                    status: 'FAILED',
                                                                    errors: error
                                                                }
                                                                return callback(response)
                                                            } else {
                                                                let response = {
                                                                    status: 'SUCCESS',
                                                                    request: request,
                                                                    document: document
                                                                }
                                                                return callback(response)
                                                            }
                                                        })
                                                    }
                                                })
                                            }
                                        })
                                    }
                                })
                            }
                        })
                    }
                })
            } catch (error) {
                let response = {
                    status: 'FAILED',
                    errors: error
                }
                return callback(response)
            }
        },
        getAllRequests: (user, callback) => {

            try {
                Identity.findByShieldUser(user, (error, identity) => {
                    if (error) {
                        let response = {
                            status: 'FAILED',
                            error: error
                        }
                        return callback(response)
                    } else {
                        Request.find({$or: [{requestedBy: identity}, {requestedTo: identity}]})
                        .populate({path: 'document', populate: [{path: 'signed'}, {path: 'record'}]})
                        .populate({path: 'requestedBy', populate: { path: 'shieldUser'}})
                        .populate({path: 'requestedTo', populate: { path: 'shieldUser'}})
                        .exec((error, requests) => {
                            if (error) {
                                let response = {
                                    status: 'FAILED',
                                    errors: error
                                }
                                return callback(response)
                            } else {
                                let response = {
                                    status: 'SUCCESS',
                                    requests: requests,
                                    user: identity._id
                                }
                                return callback(response)
                            }
                        })
                    }
                })
            } catch (error) {
                console.log(error)
                let response = {
                    status: 'FAILED',
                    errors: error
                }
                return callback(response)
            }
        },
        handleVerificationRequest: (formData, user, callback) => {
            try {
                Identity.findByShieldUser(user, (error, signingUser) => {
                    if (error) {
                        let response = {
                            status: 'FAILED',
                            errors: error
                        }
                        return callback(response)
                    } else {
                        Request.findById(formData.requestId, (error, request) => {
                            if (error) {
                                let response = {
                                    status: 'FAILED',
                                    errors: error
                                }
                                return callback(response)
                            } else {
                                request.status = formData.status
                                request.dateOfAction = Date.now()
                                request.save((error, request) => {
                                    if (error) {
                                        let response = {
                                            status: 'FAILED',
                                            errors: error
                                        }
                                        return callback(response)
                                    } else {
                                        Document.findById(request.document._id, (error, document) => {
                                            if (error) {
                                                let response = {
                                                    status: 'FAILED',
                                                    errors: error
                                                }
                                                return callback(response)
                                            } else {
                                                document.signature = formData.signature
                                                document.signedHash = formData.hash
                                                document.signedBy = signingUser._id
                                                document.save((error, document) => {
                                                    if (error) {
                                                        let response = {
                                                            status: 'FAILED',
                                                            errors: error
                                                        }
                                                        return callback(response)
                                                    } else {
                                                        let response = {
                                                            status: 'SUCCESS',
                                                            document: document,
                                                            request: request
                                                        }
                                                        return callback(response)
                                                    }
                                                })
                                            }
                                        })
                                    }
                                })
                            }
                        })
                    }
                })
            } catch (error) {
                let response = {
                    status: 'FAILED',
                    errors: error
                }
                return callback(response)
            }
        },
        getPubicProfile: (username, callback) => {
            try {
                Identity.findByUsername(username)
                .populate({path: 'educationRecords', populate: {path: 'documents', populate: {path: 'signed'}}})
                .populate({path: 'professionalRecords', populate: {path: 'documents', populate: {path: 'signed'}}})
                .populate({path: 'skillRecords'})
                .exec((error, identity) => {
                    if (error) {
                        let response = {
                            status: 'FAILED',
                            error: error
                        }
                        return callback(response)
                    } else {
                        let response = {
                            status: 'SUCCESS',
                            user: identity
                        }
                        return callback(response)
                    }
                })
            } catch (error) {
                let response = {
                    status: 'FAILED',
                    errors: error
                }
                return callback(response)
            }
        },
        requestDocumentAccess: (formData, user, callback) => {
            Identity.findByShieldUser(user, (error, identity) => {
                if (error) {
                    let response = {
                        status: 'FAILED',
                        errors: error
                    }
                    return callback(response)
                } else {
                    Document.findById(formData.documentId, (error, document) => {
                        if (error) {
                            let response = {
                                status: 'FAILED',
                                errors: error
                            }
                            return callback(response)
                        } else {
                            let request = new Request({
                                type: 'access',
                                document: document._id,
                                requestedBy: identity._id,
                                requestedTo: document.owner
                            })
                            request.save((error, request) => {
                                if (error) {
                                    let response = {
                                        status: 'FAILED',
                                        errors: error
                                    }
                                    return callback(response)
                                } else {
                                    let response = {
                                        status: 'SUCCESS',
                                        request: request
                                    }
                                    return callback(response)
                                }
                            })
                        }
                    })
                }
            })
        },
        handleRequestAccess: (formData, callback) => {
            try {
                Request.findById(formData.requestId, (error, request) => {
                    if (error) {
                        let response = {
                            status: 'FAILED',
                            errors: error
                        }
                        return callback(response)
                    } else {
                        request.dateOfAction = Date.now()
                        request.status = formData.status
                        if (formData.status == 'accepted') {
                            request.sharedKey = formData.sharedKey
                        }
                        request.save((error, request) => {
                            if (error) {
                                let response = {
                                    status: 'FAILED',
                                    errors: error
                                }
                                return callback(response)
                            } else {
                                let response = {
                                    status: 'FAILED',
                                    request: request
                                }
                                return callback(response)
                            }
                        })
                    }
                })
            } catch (error) {
                let response = {
                    status: 'FAILED',
                    errors: error
                }
                return callback(response)
            }
        },
        getAllDocuments: (user, callback) => {
            try {
                Identity.findByShieldUser(user, (error, identity) => {
                    if (error) {
                        let response = {
                            status: 'FAILED',
                            errors: error
                        }
                        return callback(response)
                    } else {
                        Document.find({owner: identity})
                        .populate({path: 'signedBy', populate: {path: 'admin'}})
                        .exec((error, documents) => {
                            if (error) {
                                let response = {
                                    status: 'FAILED',
                                    errors: error
                                }
                                return callback(response)
                            } else {
                                let response = {
                                    status: 'SUCCESS',
                                    documents: documents
                                }
                                return callback(response)
                            }
                        })
                    }
                })
            } catch (error) {
                let response = {
                    status: 'FAILED',
                    errors: error
                }
                return callback(response)
            }
        },
        deleteItem: (formData, callback) => {
            // We need to send the objectId, and the kind of object
            // It could be a skill, record, or document object
            // TODO: Finish delete, we are leaving it pending,
            // deleting objects directly does not work, we have 
            // to remove their preferences too.
            try {

                let object = formData.object
                let objectId = formData.objectId

                if (object === 'skill') {
                    UserSkillData.deleteOne({ _id: objectId })
                    .exec((error) => {
                        if (error) {
                            let response = {
                                status: 'FAILED',
                                errors: error
                            }
                            return callback(response)
                        } else {
                            let response = {
                                status: "SUCCESS",
                                message: 'Successfully deleted the item.'
                            }
                            return callback(response)
                        }
                    })
                } else if (object === 'record') {
                    Record.deleteOne({ _id: objectId })
                    .exec((error) => {
                        if (error) {
                            let response = {
                                status: 'FAILED',
                                errors: error
                            }
                            return callback(response)
                        } else {
                            let response = {
                                status: 'SUCCESS',
                                message: 'Successfully deleted the record.'
                            }
                            return callback(response)
                        }
                    })
                } else if (object === 'community') {
                    UserCommunity.deleteOne({ _id: objectId })
                    .exec((error) => {
                        if (error) {
                            let response = {
                                status: 'FAILED',
                                errors: error
                            }
                            return callback(response)
                        } else {
                            let response = {
                                status: 'SUCCESS',
                                message: 'Successfully removed the community'
                            }
                            return callback(response)
                        }
                    })
                } else {
                    let response = {
                        status: 'FAILED',
                        message: 'Object not supported yet.'
                    }
                }
            } catch (error) {
                let response = {
                    status: 'FAILED',
                    errors: error
                }
                return callback(response)
            }
        },
        getUserSkillData: (user, callback) => {
            try {
                Identity.findByShieldUser(user)
                .populate({path: 'skillRecords'})
                .exec((error, identity) => {
                    if (error) {
                        let response = {
                            status: 'FAILED',
                            errors: error
                        }
                        return callback(response)
                    } else {
                        let response = {
                            status: 'SUCCESS',
                            skills: identity.skillRecords
                        }
                        return callback(response)
                    }
                })
            } catch (error) {
                let response = {
                    status: 'FAILED',
                    errors: error
                }
                return callback(response)
            }
        },
        handleVirtues: (formData, user, callback) => {
            try {
                Identity.findByShieldUser(user, (error, identity) => {
                    if (error) {
                        let response = {
                            status: "FAILED",
                            errors: error
                        }
                        return callback(response)
                    } else {
                        identity.virtues = formData.virtues
                        identity.save((error, saved) => {
                            if (error) {
                                let response = {
                                    status: "FAILED",
                                    errors: error
                                }
                                return callback(response)
                            } else {
                                let response = {
                                    status: "SUCCESS",
                                    message: "Successfully updated virtues.",
                                    identity: saved
                                }
                                return callback(response)
                            }
                        })
                    }
                })
            } catch (error) {
                let response = {
                    status: "FAILED",
                    errors: error
                }
                return callback(response)
            }
        },
        addUserCommunities: (formData, user, callback) => {
            try {
                Identity.findByShieldUser(user, (error, identity) => {
                    if (error) {
                        let response = {
                            status: "FAILED",
                            errors: error
                        }
                        return callback(response)
                    } else {
                        Community.findById(formData.communityId, (error, community) => {
                            if (error) {
                                let response = {
                                    status: "FAILED",
                                    errors: error
                                }
                                return callback(response)
                            } else {
                                let usercommunity = new UserCommunity({
                                    community: community._id,
                                    powURL: formData.powURL
                                })
                                usercommunity.save((error, saved) => {
                                    if (error) {
                                        let response = {
                                            status: 'FAILED',
                                            errors: error
                                        }
                                        return callback(response)
                                    } else {
                                        identity.communities.push(saved)
                                        identity.save((error, updated) => {
                                            if (error) {
                                                let response = {
                                                    status: "FAILED",
                                                    errors: error
                                                }
                                                return callback(response)
                                            } else {
                                                let response = {
                                                    status: "SUCCESS",
                                                    message: "Successfully updated user community,",
                                                    communities: updated.communities
                                                }
                                                return callback(response)
                                            }
                                        })
                                    }
                                })
                            }
                        })
                    }
                })
            } catch (error) {
                let response = {
                    status: "FAILED",
                    errors: error
                }
                return callback(response)
            }
        },
        handleSoftskills: (formData, user, callback) => {
            try {
                Identity.findByShieldUser(user, (error, identity) => {
                    if (error) {
                        let response = {
                            status: "FAILED",
                            errors: error
                        }
                        return callback(response)
                    } else {
                        identity.softskills = formData.softskills
                        identity.save((error, saved) => {
                            if (error) {
                                let response = {
                                    status: "FAILED",
                                    errors: error
                                }
                                return callback(response)
                            } else {
                                let response = {
                                    status: "SUCCESS",
                                    message: "Successfully updated softskills.",
                                    identity: saved
                                }
                                return callback(response)
                            }
                        })
                    }
                })
            } catch (error) {
                let response = {
                    status: "FAILED",
                    errors: error
                }
                return callback(response)
            }
        },
        handleProductivityStack: (formData, user, callback) => {
            console.log("REached");

            try {
                Identity.findByShieldUser(user)
                .populate({path: 'wellBeingStacks'})
                .exec((error, identity) => {
                    if (error) {
                        let response = {
                            status: "FAILED",
                            errors: error
                        }
                        return callback(response)
                    } else {
                        
                        // TODO: Replace object with MAP
                        
                        // Check if this particular stack exists
                        // If it exists, update stack ratings, set signature to NULL
                        // Create StackSignatureRequest
                        // If it does not exist, create stack ratings,
                        // Create StackSignature Request
                        
                        let stackExists = identity.wellBeingStacks.some(stack => stack.stackName === formData.stackName)

                        console.log(stackExists)

                        if (stackExists) {
                            
                            // Find the index
                            let stackIndex = identity.wellBeingStacks.findIndex(stack => stack.stackName === formData.stackName)
                            let stackToBeUpdated = identity.wellBeingStacks[stackIndex]

                            // Find and update the stack
                            WellBeingStack.findById(stackToBeUpdated._id)
                            .exec((error, stack) => {
                                if (error) {
                                    let response = {
                                        status: "FAILED",
                                        message: "Stack exists, but unable to find and udpate."
                                    }
                                    return callback(response)
                                } else {
                                    stack.lastUpdated = Date.now()
                                    stack.stackRatings = formData.stackRatings
                                    stack.markModified('stackRatings')
                                    stack.save((error, savedStack) => {
                                        if (error) {
                                            let response = {
                                                status: "FAILED",
                                                message: "Failed to save updated stack."
                                            }
                                            return callback(response)
                                        } else {
                                            // Re-evaluate well being score

                                            console.log(identity.wellBeingStacks)

                                            let response = {
                                                status: "SUCCESS",
                                                message: "Successfully updated the stack",
                                                updatedStack: savedStack             
                                            }
                                            return callback(response)
                                        }
                                    })
                                }
                            })

                        } else {
                            let wellBeingStack = new WellBeingStack({
                                stackName: formData.stackName,
                                stackRatings: formData.stackRatings,
                                lastUpdated: Date.now()
                            })
    
                            wellBeingStack.save((error, wbs) => {
                                if (error) {
                                    let response = {
                                        status: "FAILED",
                                        message: "Unable to update the stack rating"
                                    }
                                    return callback(response)
                                } else {
    
                                    identity.wellBeingStacks.push(wbs)
                                    identity.save((error, updatedIdentity) => {
                                        if (error) {
                                           let response = {
                                               status: "FAILED",
                                               message: "Stack updated, failed to update identity"
                                           }
                                           return callback(response)
                                        } else {
                                            // Re-evaluate well being score

                                            console.log(identity.wellBeingStacks)

                                            let response = {
                                                status: "SUCCESS",
                                                message: "Successfully updated the stack",
                                                updatedStack: updatedIdentity.wellBeingStack
                                            }
                                            return callback(response)
                                        }
                                    })
                                }
                            })
                        }
                    }
                })
            } catch (error) {
                let response = {
                    status: "FAILED",
                    errors: error
                }
                return callback(response)
            }
        },
        requestStackValidation: (formData, user, callback) => {
            try {
                Identity.findByShieldUser(user)
                .exec((error, identity) => {
                    if (error) {
                        let response = {
                            status: "FAILED",
                            errors: error
                        }
                        return callback(response)
                    } else {
                        Community.findById(formData.validatingCommunity)
                        .exec((error, community) => {
                            if (error) {
                                let response = {
                                    status: "FAILED",
                                    errors: error
                                }
                                return callback(response)
                            } else {
                                Identity.findByUsername(formData.validator, (error, validator) => {
                                    if (error) {
                                        let response = {
                                            status: "FAILED",
                                            errors: error
                                        }
                                        return callback(response)
                                    } else {
                                        console.log(validator)
                                        console.log(community)
                                        console.log(identity)
                                        let wbValidation = new WellBeingValidation({
                                            wellBeingStack: formData.stacks,
                                            requestedBy: identity._id,
                                            wellBeingValidator: validator._id,
                                            wellBeingValidatorCommunity: community._id
                                        })
                                        wbValidation.save((error, validationRequest) => {
                                            if (error) {
                                                let response = {
                                                    status: "FAILED",
                                                    errors: error
                                                }
                                                return callback(response)
                                            } else {
                                                identity.wellBeingValidation = validationRequest
                                                identity.save((error, updated) => {
                                                    if (error) {
                                                        let response = {
                                                            status: "FAILED",
                                                            errors: error
                                                        }
                                                        return callback(response)
                                                    } else {
                                                        let response = {
                                                            status: "SUCCESS",
                                                            updatedIdentity: updated
                                                        }
                                                        return callback(response)
                                                    }
                                                })
                                            }
                                        })
                                    }
                                })
                            }
                        })
                    }
                })
            } catch (error) {
                let response = {
                    status: "FAILED",
                    errors: error
                }
                return callback(response)
            }
        } 
    }
})() 