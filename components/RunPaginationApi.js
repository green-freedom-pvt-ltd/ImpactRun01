export default {
   getAllRuns(pageID) {
    let page = pageID;
    const url = `http://139.59.243.245/api/runs/?page=${page}`;
    if (page === null) {
      page = 1;
    }
    
    return fetch(url,{
      method: "GET",
       headers: {  
          'Authorization':"Bearer 1e9eec1f16e1d16bd10e4e853605e949358445b5"
        }
      })
      .then((response) => {
        return response.json();
      });
  }
}