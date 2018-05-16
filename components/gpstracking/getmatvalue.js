
export default  {
  async getMetsValue(speed){
     // deltaSpeed is in m/s
     if (speed != NaN) {
      var mph = await speed*2.24;
       if (mph <= 0.625) {  
            return 0
        }else if (mph <= 1){
          
           return 1.3;
        }else if (mph <= 2){
        
          return (1.3 + 1.5*(mph - 1));
           
          // 2.8 at 2 mph
        }else if (mph <= 2.5){
      
           return 2.8 + 0.4*(mph - 2);
           // 3.0 at 2.5 mph
        }else if (mph <= 3.5){
       
           return 1.3
            // 4.3 at 3.5 mph
        }else if (mph <= 4){  
         
           return 3.0 + 1.3*(mph - 2.5)
          // 6.0 at 4 mph
        }
        else if (mph <= 5){
          
           return 6 + 2.3*(mph - 4) ;
          // 8.3 at 5 mph
           
        }else if (mph <= 6){
        
           return 8.3 + 1.5*(mph - 5);
             // 9.8 at 6 mph
        }else if (mph <= 7){
         
           return 9.8 + 1.2*(mph - 6);
           // 11.0 at 7mph
        }else if (mph <= 7.7){
         
           return 11 + 1.143*(mph - 7)
             // 11.8 at 7.7 mph
        }else if (mph <= 9){
          
           return 11.8 + 0.77*(mph - 7.7)
           // 12.8 at 9 mph
        }else if (mph <= 10){
        
           return 12.8 + 1.7*(mph - 9)
           // 14.5 at 10 mph
        }else if (mph <= 11){
        
          return 14.5 + 1.5*(mph - 10)
         // 16 at 11 mph
        }else if (mph <= 12){
          
           return 16 + 3*(mph - 11);
          // 19 at 12 mph
        }else if (mph <= 14){
          
          return 19 + 2*(mph - 12);
          // 23 at 14 mph
        }else if (mph <= 15){
          
           return 23 + 1*(mph - 14)
          // 24 at 15 mph
        }else {
         
            return 1.3 ;         
            // For speeds greater than 15 mph (23 kmph) we assume that the person is driving so we don't add calories
        }
    }
  }

}