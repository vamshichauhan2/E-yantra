import React, { useState, useEffect } from 'react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import AOS from 'aos';
import 'aos/dist/aos.css';
import './faq.css';

const eYantraQuestionsNITAP = [
  {
    question: "What is eYantra?",
    answer: "eYantra is an enthusiastic club at NIT Andhra Pradesh where students come together to build and innovate with drones, electric vehicles, and embedded systems. It’s a hub of learning through hands-on projects, workshops, and peer collaboration. The club encourages passion for technology and engineering. It aims to develop skilled engineers ready for future challenges. We’re always dreaming big and flying high!"
  },
  {
    question: "Who can join the eYantra Club?",
    answer: "Anyone at NIT Andhra Pradesh with a keen interest in robotics and electronics can join, regardless of your year or branch. The club nurtures freshers and seniors alike, helping everyone grow their technical and teamwork skills. We believe in inclusivity and share knowledge freely. Joining means becoming part of a passionate community. It’s about learning, experimenting, and building lasting friendships."
  },
  {
    question: "How do I participate in eYantra competitions?",
    answer: "Competitions like eYantra Robotics Challenge are announced every year. Simply register through the official portal and start working on challenges with your team. Workshops and mentorship sessions help you build and improve your projects. Participating boosts your practical skills and confidence. Winners get recognition, certificates, and great exposure to the robotics community."
  },
  {
    question: "Does eYantra provide training and resources?",
    answer: "Absolutely! We conduct regular workshops, webinars, and hands-on sessions at NIT Andhra Pradesh. Members get access to rich digital content and project guidelines. Your mentors, including seniors and faculty, support you every step. Whether you’re new or experienced, learning never stops here. It’s a continuous journey of growth and discovery."
  },
  {
    question: "Can I collaborate on projects within the club?",
    answer: "Collaboration is the heart of eYantra at NIT Andhra Pradesh. We work in teams to solve real-world problems creatively. Sharing ideas and skills makes projects more innovative and fun. Club activities promote teamwork, critical thinking, and leadership. It’s a great way to make friends with similar ambitions and build your dream project together."
  },
  {
    question: "Are there any events or workshops organized by the eYantra Club?",
    answer: "Yes! The club hosts events like skill-building workshops, tech talks, drone flying sessions, and more. We also participate in NIT Andhra Pradesh’s annual festivals and technical fests like VULCANZY. These platforms allow members to showcase their talents and learn from experts. It’s an energetic community always buzzing with new ideas and activities. Staying connected means endless learning opportunities."
  },
  {
    question: "How is eYantra linked with NIT Andhra Pradesh?",
    answer: "The eYantra Club is proudly rooted in NIT Andhra Pradesh’s culture of innovation and excellence. Supported by dedicated faculty and driven students, it’s a space where cutting-edge research and practical engineering meet. The club represents the institute in important national-level challenges and competitions. It embodies the spirit of teamwork, creativity, and leadership that NIT AP fosters. Together, we drive technological progress forward."
  },
  {
    question: "Why should I join the eYantra Club?",
    answer: "Joining is your chance to turn theoretical knowledge into real-world skills at NIT Andhra Pradesh. The club provides mentorship, resources, and a vibrant community passionate about robotics. It opens doors to competitions, internships, and career growth. You’ll build confidence and expertise in embedded systems, electronics, and automation. Ultimately, eYantra is where your engineering dreams take flight."
  },
  {
    question: "What skills will I gain from being part of eYantra?",
    answer: "You’ll gain hands-on experience with drones, electric vehicles, embedded software, and hardware design. Problem-solving, teamwork, and project management skills are nurtured. Exposure to industry tools and practices sets you apart professionally. The club fosters leadership and communication skills through group projects and presentations. These skills prepare you for a successful engineering career."
  },
  {
    question: "When does registration for eYantra start?",
    answer: "Registration typically opens at the beginning of the academic semester, usually around July or August. Official announcements are shared through NIT Andhra Pradesh’s channels and the eYantra portal. Keep an eye on club notices and emails to not miss the window. Early registration helps with timely access to workshops and resources. Staying informed is your best step to joining smoothly."
  },
  {
    question: "Is prior knowledge of robotics or programming required to join?",
    answer: "Not at all! The club welcomes all levels, especially beginners. Comprehensive training and resources are provided to build your skills from scratch. Mentors and seniors guide you through each step with patience. If you have curiosity and a willingness to learn, that’s more than enough to start."
  },
  {
    question: "Can I join eYantra if I'm from a non-engineering background?",
    answer: "Yes, eYantra at NIT AP encourages participation from all disciplines. The club believes that passion and eagerness to learn robotics matter most. Cross-disciplinary ideas often lead to stronger projects. The inclusive environment supports everyone in their learning journey. So come, bring your unique perspective and grow with us."
  },
  {
    question: "Who can I contact for eYantra club queries?",
    answer: "You can reach out to the club coordinator or faculty mentor at NIT Andhra Pradesh. Senior members of the club are also approachable for guidance and support. Official communication channels include club emails, social media pages, and notice boards. The eYantra community is friendly and ready to help. Don’t hesitate to connect anytime!"
  },
  {
    question: "How do I access eYantra projects and codes?",
    answer: "Projects, sample codes, and learning materials are accessible via the official eYantra GitHub and club resources. The club regularly shares updates and repositories for all members. Workshops explain practical use of these projects step-by-step. You’re encouraged to modify, contribute and share your improvements. This hands-on approach accelerates learning and innovation."
  },
  
];


const EyantraFAQ = () => {
  const [openKey, setOpenKey] = useState(null);

  useEffect(() => {
    AOS.init({ duration: 2000 });
  }, []);

  return (
    <div className='EyantraFAQ-container'>
      {eYantraQuestionsNITAP.map((item, index) => (
        <div key={index} className="EyantraHelp-Section-Container" >
          <div 
            data-aos="fade-left" 
            className="eyantra-query-container" 
            style={{ display: 'flex', justifyContent: 'space-between', cursor: 'pointer' }}
            onClick={() => setOpenKey(openKey === index ? null : index)}
          >
            <h4 className='eyantra-query-container-title'>{item.question}</h4>
            <div>{openKey === index ? <ExpandLessIcon /> : <ExpandMoreIcon />}</div>
          </div>
          {openKey === index && (
            <p data-aos="fade-left" className='eyantra-query-answer'>{item.answer}</p>
          )}
          <hr />
        </div>
      ))}
    </div>
  );
};

export default EyantraFAQ;
