const fs = require("fs")
const axios = require("axios")
var result = "["
var pageSkip = process.argv[2] ? parseInt(process.argv[2]) : 0;
var query = process.argv[3] ? process.argv[3] : "Free shipping shop";
//x-RapidApi-Host
//x-RapidAPI-Key

const instance = axios.create({
  timeout : 500000,
  baseURL : "https://contextualwebsearch-websearch-v1.p.rapidapi.com/api/Search",
  headers: {
    'x-rapidapi-host': 'contextualwebsearch-websearch-v1.p.rapidapi.com',
    'x-rapidapi-key': 'oK1mVi9mxcmshlRwFxN1OtkX5mA8p1IsWRCjsnJoFSAGamjLNY'
  }
});


async function writeOut(){
  fs.writeFileSync("./out."+ (new Date()).getTime() + ".json", result)  
}

function sleep(seconds){
 return new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve(true)
    },seconds * 1000);
})
}

async function handlePage(page, request){
   request.page = page + pageSkip
   var result = await instance.get("/WebSearchAPI", { params : request })
   var results = [];
   for(var i = 0; i < result.data.value.length;i++){
        var r = result.data.value[i];
        try {
        console.log("Checking ->", r.url)
        var webPage = await axios({
          url : r.url,
          method : 'GET',
          responseType : 'blob',
        });
        console.log(webPage);
         break;
        if(!webPage.data.includes("shopify"))
         continue;
       
        console.log("Saving ", r.url);
        results.push({
          name :  r.title,
          url : r.url
        })
        } catch(e) {
          console.log("Failed to load", r.url);  
        }
   }
  
   return results
}

async function searchApi(){
// var googleData = await axios.get("https://google.com");
//console.log(googleData.data);
// return;
  var pageCount = 1;
  var request = {
    q : query,
    pageSize : 20
  }
  console.log("Performing Query", request)
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
  writeOut()
  
}


searchApi()
.then(() => { process.exit() } )
