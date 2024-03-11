const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const personalInfoSchema = new Schema({
    firstName: String,
    middleName: String,
    lastName: String,
    currentLocation: String,
    experience: String,
    totalExperienceYear: String,
    totalExperienceMonth: String,
    primaryContact: String,
    secondaryContact: String,
    currentSalary: String,
    desiredSalary: String,
    noticePeriod: String,
    dateOfBirth: Date,
    homeAddress: String,
    mailingAddress: String,
}, { timestamps: true });

const description = new Schema({
    resumeHeadline: String,
    careerSummary: String,
    keySkills: {type: [{label:String, value: String}], _id: false}
}   );

const professionalInfoSchema = new Schema({
    preferredRoleType: String,
    workingArrangements: String,
    roleName:String,
    roleCategory: String,
    currentNoticePeriod: String,
    currentSalary: Number,
    expectedSalary: Number,
    currentLocation: String,
    preferredLocation: String,
    // resumeCV: String,
    // coverLetter: String,
    // videoProfile: String,
}, { timestamps: true });

const qualificationSchema = new Schema({
    education:String,
    instituteName:String,
    course:String,
    specialization:String,
    courseType:String,
    startYear:String,
    endYear:String,
    location:String
}, { timestamps: true });

const employmentHistorySchema = new Schema({
    currentEmployee: Boolean,
    employmentType: String,
    companyName: String,
    designation: String,
    joiningMonth: String,
    joiningYear: String,
    workedTillMonth: String,
    workedTillYear: String,
    currentLocation: String,
    skills: {type: [{label:String, value: String}], _id: false},
    jobDescription: String
}, { timestamps: true });

const additionalInfoSchema = new Schema({
    skills: { type: [String], required: true },
    languages: [
        {
            language:String,
            proficiency:String
        }
    ],
    certifications: [
        {
            certificateName:String,
            certificateID:String,
            certificateUrl:String,
            certificateStartMonth:String,
            certificateStartYear:String,
            certificateEndMonth:String,
            certificateEndYear:String,
            certificateNotExpire:Boolean
        }
    ],
    onlineProfile: [
        {
            profileName:String,
            profileUrl:String,
            description:String
        }
    ],
    researchPublications: [
        { 
            researchTitle:String,
            researchUrl:String,
            publishedYear:String,
            publishedMonth:String,
            description:String
        }
    ],
    workSamples:[
        {
            workTitle:String,
            workUrl:String,
            durationFromYear:String,
            durationFromMonth:String,
            durationToYear:String,
            durationToMonth:String,
            currentProject:Boolean,
            description:String
        }
    ],
    patents: [
            {
            patentTitle:String,
            patentUrl:String,
            patentOffice:String,
            patentIssued:Boolean,
            applicationNo:String,
            issueMonth:String,
            issueYear:String,
            description:String           
        }
    ],
}, { timestamps: true });

const userSchema = new Schema({
    personalInfo: personalInfoSchema,
    aboutMeDescription: description,
    profileImage: String,
    professionalInfo: professionalInfoSchema,
    qualifications: [qualificationSchema],
    employmentHistory: [employmentHistorySchema],
    additionalInfo: additionalInfoSchema,
    profileResume:String,
    password: String, 
    email: { type: String, required: true },
    googleId: { type:String, unique:true, sparse:true},

}, { timestamps: true });

const User = mongoose.model('User', userSchema);

module.exports = User;
