
import React from 'react'

const eyantraContext=React.createContext({
    username:'',
      stats: {            
    totalUsers: 0,
    totalAdmins: 0,
    totalSecretaries: 0,
    totalJointSecretaries: 0,
  },
    notifications:[],
    resources:[],
    teamMembers:[],
    events:[],
    projects:[],
    
    getProjects:()=>{},
    getEvents:()=>{},
    getNotifications:()=>{},
     getResources:()=>{},
     getTeamMembers:()=>{},

})


export default eyantraContext;