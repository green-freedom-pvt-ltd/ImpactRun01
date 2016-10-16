export default {
   getAllUser(pageID,user) {
    let page = pageID;
    const url = `http://dev.impactrun.com/api/leaderBoard/?page=${page}`;
    if (page === null) {
      page = 1;
    }  
    const MyUserToken = user.auth_token;
    return fetch(url,{
      method: "GET",
       headers: {  
          'Authorization':"Bearer " + MyUserToken,
        }
      })
     .catch((err) => {
        console.log('WRONGDATApiRunBoard', err);
    })
      .then((response) => {
        return response.json();
      })
     
    }
}