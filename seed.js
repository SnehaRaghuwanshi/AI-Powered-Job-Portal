const mongoose = require('mongoose');
require('dotenv').config();
const Job = require('./models/Job');
const User = require('./models/User');

const seed = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected!');

  // Ek recruiter user banao
  let recruiter = await User.findOne({ email: 'recruiter@demo.com' });
  if (!recruiter) {
    recruiter = await User.create({
      name: 'Demo Recruiter',
      email: 'recruiter@demo.com',
      password: 'password123',
      role: 'recruiter'
    });
  }

  // Purani jobs delete karo
  await Job.deleteMany({});

  // Naye jobs add karo
  await Job.insertMany([
    { title: 'Frontend Developer', company: 'TechCorp', location: 'Remote', salary: '₹12–18 LPA', type: 'Remote', skills: ['React', 'JavaScript', 'CSS'], description: 'We are looking for a skilled Frontend Developer...', postedBy: recruiter._id },
    { title: 'Backend Developer', company: 'StartupXYZ', location: 'Bangalore', salary: '₹15–25 LPA', type: 'On-site', skills: ['Node.js', 'MongoDB', 'Express'], description: 'Join our backend team to build scalable APIs...', postedBy: recruiter._id },
    { title: 'Full Stack Developer', company: 'Innovate Inc', location: 'Hybrid – Mumbai', salary: '₹18–30 LPA', type: 'Hybrid', skills: ['React', 'Node.js', 'PostgreSQL'], description: 'Full stack role with exciting product work...', postedBy: recruiter._id },
    { title: 'ML Engineer', company: 'AI Labs', location: 'Remote', salary: '₹20–35 LPA', type: 'Remote', skills: ['Python', 'TensorFlow', 'NLP'], description: 'Work on cutting-edge ML models...', postedBy: recruiter._id },
    { title: 'DevOps Engineer', company: 'CloudBase', location: 'Pune', salary: '₹16–28 LPA', type: 'On-site', skills: ['Docker', 'Kubernetes', 'AWS'], description: 'Manage and scale our cloud infrastructure...', postedBy: recruiter._id },
  ]);

  console.log('✅ 5 jobs added successfully!');
  console.log('📧 Recruiter login: recruiter@demo.com / password123');
  process.exit();
};

seed().catch(err => { console.error(err); process.exit(1); });