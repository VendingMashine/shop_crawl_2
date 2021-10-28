
var request_lib = require()
const fs = requrie("fs")
const axios = require("axios")
var result = "["

//x-RapidApi-Host
//x-RapidAPI-Key

const instance = axios.create({
  timeout : 1000,
  baseURL : ""
});


async function writeOut(){
  fs.writeFileSync("./out.json", result)  
}



async function handlePage(page, request){
  
   var results = []
   for(var i = 0; i < results.length;i++){
        var r = results[i];
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
    q : ".myshopify.com",
    pageSize : 20
  }
  
  try {
  for(var i = 0; i < pageCount;i++){
       var pageData = await handlePage(i + 1, request)
       
       var strEntry = JSON.stringify(pageData).replace("[", "")
       .replace("[", "")
       result += strEntry;
       //process entry and add to string
  }
  } catch(e) {
      console.log("Error", e);  
  }
  
  result += "]"
  
  
}


searchApi()
.then(() => { process.exit() } )
