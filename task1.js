var express = require('express');
var request = require('request');
var cheerio = require('cheerio');
var app = express();


app.get('/', function (req, res) {
  res.send('Server is working fine!');
});

app.get('/I/want/title/', function(req, res){

    var length = false;
    var list_arr_index = false;
    let query = req.query.address;
    let is_array = Array.isArray(query);

    console.log('is_array:', is_array);
    
    //more than one link
    if(is_array)
    {   
        list_arr_index = length = query.length;
        query.forEach(function(url) {
            fetch_after_validation(url,length)
        });
    }
    else if(query!=undefined)
    {
        //one link
        
        // console.log('query',query)
        let substring = ".com" 
        let isValidString = query.includes(substring);
        if(!isValidString)
            return res.send("invalid address has been parsed.", 400);

        substring = "https://";
        let check_HTTP_protocol = query.includes(substring);

        if(!check_HTTP_protocol)
           query = 'https://'+query;
         
        let result = fetchTitle(query);
        // console.log('fetch_result:',result);
    }
    else
        return res.send("Required parameters are not parsed properly in url!", 400);
    
    var html_data ='<h1> Following are the titles of given websites: </h1> <br>';
    html_data += '<ul>';

    function onComplete(data)
    {
        if(length<=1)
            return res.send('<b>'+data+'</b>');
        else
        {
            list_arr_index= list_arr_index-1;
            html_data += '<li> <b>'+ query[list_arr_index]+' -- '+data+'</b> </li>';            
        }
        if(list_arr_index==0){
            html_data +='</ul>';
            return res.send(html_data);
        }
        
    }
    function fetchTitle(url) 
    {
        request(url, function (error, response, body) 
        {
            let output = url; 
            
            if (!error && response.statusCode === 200) {
                let $ = cheerio.load(body);
                // console.log(`URL = ${url}`);
                
                let title = $("head > title").text().trim();
                // console.log('title:',title);
                onComplete(title);            
                
            
            } else {
                console.log(`Error = ${error}, code = ${response.statusCode}`);
            }
        });
    }
    function fetch_after_validation(url){

        let substring = ".com" 
        let isValidString = url.includes(substring);
        if(!isValidString)
            return res.send("invalid address has been parsed.", 400);

        substring = "https://";
        let check_HTTP_protocol = url.includes(substring);

        if(!check_HTTP_protocol)
           url = 'https://'+url;
         
        // console.log('url:', url);
        let result = fetchTitle(url);

    }
});

app.get('*', function(req, res){
  res.send("Sorry! Unable to find that Page", 404);
});

app.listen(3000, function () {
  console.log('app listening on port 3000!');
});



