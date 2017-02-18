import apis from '../apis';

export default {
   getAllUser(pageID,user) {
    let page = pageID;
    const url = apis.leaderBoardapi+`?page=${page}`;
    console.log('url',url);
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