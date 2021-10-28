const fs = requrie("fs")
const axios = require("axios")
var result = "["

//x-RapidApi-Host
//x-RapidAPI-Key

const instance = axios.create({
  timeout : 1000,
  baseURL : "https://contextualwebsearch-websearch-v1.p.rapidapi.com/api/Search",
  headers: {
    'x-rapidapi-host': 'contextualwebsearch-websearch-v1.p.rapidapi.com',
    'x-rapidapi-key': 'oK1mVi9mxcmshlRwFxN1OtkX5mA8p1IsWRCjsnJoFSAGamjLNY'
  }
});


async function writeOut(){
  fs.writeFileSync("./out.json", result)  
}

function sleep(seconds){
 return new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve(true)
    },seconds * 1000);
})
}

async function handlePage(page, request){
   request.page = page
   var result = await instance.get("/WebSearchAPI", { params : request })
   var results = result.data.value;
   for(var i = 0; i < results.length;i++){
        var r = results[i];
        console.log("Saving ", r.url);
        results.push({
          name :  r.title,
          url : r.url
        })
   }
  
   return results
}

async function searchApi(){
  var pageCount = 1;
  var request = {
    q : "myshopify.com",
    pageSize : 20
  }
  
  try {
  for(var i = 0; i < pageCount;i++){
       var pageData = await handlePage(i + 1, request)
       
       var strEntry = JSON.stringify(pageData).replace("[", "")
       .replace("]", "")
       result += strEntry;
       await sleep(2);
       //process entry and add to string
  }
  } catch(e) {
      console.log("Error", e);  
  }
  
  result += "]"
  //writeOut()
  
}


searchApi()
.then(() => { process.exit() } )
