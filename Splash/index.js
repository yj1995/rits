import React from 'react';
import Logo from '../../assets/images/FullLogo.jpg';

const Splash=()=>{

      return (
        <div
        style={{
            position: 'absolute', 
            left: '60%', 
            top: '50%',
            transform: 'translate(-50%, -50%)'
        }}
    >
        <img src={Logo} style={{width:"50%",height:"50%"}} />
    </div>         
      );
  }
  
  
  export default Splash ;

    
   