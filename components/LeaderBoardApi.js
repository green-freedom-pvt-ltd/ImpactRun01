export default {
   getAllUser(pageID,user) {
    let page = pageID;
    const url = `http://dev.impactrun.com/api/leaderBoard/?page=${page}`;
    if (page === null) {
      page = 1;
    }  
    return fetch(url,{
      method: "GET",
       headers: {  
          'Authorization':"Bearer 1e9eec1f16e1d16bd10e4e853605e949358445b5",
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