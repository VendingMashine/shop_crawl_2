const fs = require("fs")
const axios = require("axios")
var result = "["
var pageSkip = process.argv[2] ? parseInt(process.argv[2]) : 0;
var pageCount = process.argv[4] ? parseInt(process.argv[4]) : 20;
var query = process.argv[3] ? process.argv[3] : "Free shipping shop";
//x-RapidApi-Host
//x-RapidAPI-Key
var request = require("request")
var prev = []
var path = "./out.json"
if (fs.existsSync(path)) {
 prev = require(path)
}

var customReq = request.defaults({
    headers: {'User-Agent': 'Mozilla/5.0 (platform; rv:geckoversion) Gecko/geckotrail Firefox/firefoxversion'}
})
const instance = axios.create({
  timeout : 500000,
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

function checkShop(url){
  return new Promise((resolve, reject) => {
     customReq({ uri : url , timeout : 10 * 1000},(error, response, body) => {
        if(error) return reject(error);
        //onsole.log(body)
        resolve(body.includes("shopify."));
     })
  });
}

async function handlePage(page, request){
   request.pageNumber = page + pageSkip
   var result = await instance.get("/WebSearchAPI", { params : request })
   var results = [];
   console.log("Results ", result.data.totalCount)
   console.log("Processing : ", result.data.value.length);
   for(var i = 0; i < result.data.value.length;i++){
        var r = result.data.value[i];
        try {
        console.log("Checking ->", r.url)
        var webPage = await checkShop(r.url)
        //console.log(webPage);
        
        if(!webPage)
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
  
  var request = {
    q : query,
    pageSize : 40
  }
  console.log("Performing Query", request)
  try {
  for(var i = 0; i < pageCount;i++){
       var pageData = await handlePage(i + 1, request)
       
       var strEntry = JSON.stringify(pageData).replace("[", "")
       .replace("]", "")
       if(i > 0) result +=  ",";
       result += strEntry;
       await sleep(2);
       //process entry and add to string
  }
  } catch(e) {
      console.log("Error", e);  
  }
  
  result += "]"
  var prsd = JSON.parse(result)
  result = JSON.stringify (prev.concat(prsd))
  writeOut()
  
}


searchApi()
.then(() => { process.exit() } )
