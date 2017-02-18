import apis from '../../apis';
export default {
   getAllRuns(pageID,user) {
    console.log('userDataapi',user);
    let page = pageID;
    const url = `http://dev.impactrun.com/api/runs/?page=${page}`;
    if (page === null) {
      page = 1;
    }  
    const MyUserToken = user.auth_token;
    console.log('myuserapitoken'+ MyUserToken);
    return fetch(url,{
      method: "GET",
       headers: {  
          'Authorization':"Bearer "+ MyUserToken,
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