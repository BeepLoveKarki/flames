let host = "a1dwqhuuo6ioox-ats.iot.us-east-1.amazonaws.com";
let region = "us-east-1";
let clientId = "smartmeter-web";

let credentials = {};
credentials.accessKeyId = "AKIAVN4GETJVOA562KHJ";
credentials.secretAccessKey = "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" ;

let coords,mymap,myIcon,nmymap;

$(document).ready(()=>{
  show(1);
  coords=[27.70169,85.3206];
  connect();
  mapit();
});

function mapit(){
  mymap = L.map('mapid').setView(coords, 10);
  
  myIcon = L.icon({
    iconUrl: 'public/images/meter.png',
    iconSize: [65, 70],
	popupAnchor: [0, -30]
  });
  
  L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiYmVlcGxvdmUiLCJhIjoiY2s1dGI4YjQzMGFnNDNqbWNxeWlvNjh4MSJ9.ap5khhdsKYbAyxFgN5Ln-g', {
    maxZoom: 50,
    id: 'mapbox/streets-v11',
    accessToken: 'pk.eyJ1IjoiYmVlcGxvdmUiLCJhIjoiY2s1dGI4YjQzMGFnNDNqbWNxeWlvNjh4MSJ9.ap5khhdsKYbAyxFgN5Ln-g'
 }).addTo(mymap);
  
 nmapit();
}

function nmapit(){
  nmymap = L.map('nmapid').setView(coords, 10);
  
  L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiYmVlcGxvdmUiLCJhIjoiY2s1dGI4YjQzMGFnNDNqbWNxeWlvNjh4MSJ9.ap5khhdsKYbAyxFgN5Ln-g', {
    maxZoom: 50,
    id: 'mapbox/streets-v11',
    accessToken: 'pk.eyJ1IjoiYmVlcGxvdmUiLCJhIjoiY2s1dGI4YjQzMGFnNDNqbWNxeWlvNjh4MSJ9.ap5khhdsKYbAyxFgN5Ln-g'
 }).addTo(nmymap);

  getdatas();
}


function getdatas(){
  $.get("https://b61vdb8jgk.execute-api.us-east-1.amazonaws.com/meter").then((data,status)=>{
  d=JSON.parse(JSON.stringify(data));
  let e=d["data"].slice(1,d["data"].length-1);
  let f=e.split("\),");
  let g= new Array();
  for(let i=0;i<f.length;i++){
    f[i]=f[i].trim().slice(4,f[i].indexOf("d")-3).trim();
	let y={};
	y["uid"]=f[i].split(", ")[0];
	y["unit"]=f[i].split(", ")[1];
	y["lat"]=f[i].split(", ")[2];
	y["lng"]=f[i].split(", ")[3];
	g.push(y);
  }
  
  let total=0.0;
  for(let i=0;i<g.length;i++){
	total+=parseFloat(g[i]["unit"]);
    for(let j=i+1;j<g.length;j++){
	  if(g[i]["uid"]==g[j]["uid"]){
		g[i]["unit"]=(parseFloat(g[i]["unit"])+parseFloat(g[j]["unit"])).toString();
		g.splice(j,1);
	  }
	 }
	}
  
  let h= new Array();
  g.forEach((val,index)=>{
    let m=[val["lat"],val["lng"]];
	h.push(m);
	let c=L.circle(m, {
      color: 'red',
      fillColor: '#f03',
      fillOpacity: 0.1,
      radius: 500
    }).addTo(nmymap);
	c.bindPopup("Meter Uid: "+val["uid"]+"<br/>Power Consumed: "+val["unit"]+" KWh");
  });

  L.polygon(h).addTo(nmymap);
  nmymap.flyTo(h[0], 11);
  $("#pp").append(total.toString()+" KWh");
  });
}



function marker(t){
  mymap.flyTo(coords, 10);
  let marker = L.marker(coords,{icon:myIcon}).addTo(mymap);
  marker.bindPopup(t).openPopup();
}

function connect () {
	let requestUrl =SigV4Utils.getSignedUrl(host,region,credentials);
    let client = new Paho.MQTT.Client(requestUrl, clientId);
    let connectOptions = {
        onSuccess: function(){
            receivemessage(client);
        },
        useSSL: true,
        timeout: 5,
        mqttVersion: 4,
        onFailure: function() {
            alert("IoT failed due to some unknown region. Do try again later.");
        }
    };
    client.onMessageArrived = onMessageArrived;
	client.connect(connectOptions);
}

function onMessageArrived(message){
  let d=JSON.parse(message.payloadString);
  coords=[d["lat"],d["lng"]];
  marker((d["unit"]/3200).toString()+" kwh");
}

function receivemessage(client){
  client.subscribe("meterdata/+");
}

function getmeters(){
  
}


function getusers(){
}

function getpayment(){
  
}

function ota(){
  //for OTA
}


function show(a){
  
  if(a!=5 && a!=6){
    $("#"+a.toString()).addClass("active");
  }
  for(let i=1;i<=4;i++){
     if(i!=a){
	   $("#"+i.toString()).removeClass("active");
	 }
  }
  
  switch(a){
    case 1:
	$("#data1").show();
	$("#data2").hide();
	$("#data3").hide();
	$("#data4").hide();
	break;
	
	case 2:
	$("#data1").hide();
	$("#data2").show();
	$("#data3").hide();
	$("#data4").hide();
	break;
	
	case 3:
	$("#data1").hide();
	$("#data2").hide();
	$("#data3").show();
	$("#data4").hide();
	break;
	
	case 4:
	$("#data1").hide();
	$("#data2").hide();
	$("#data3").hide();
	$("#data4").show();
	break;
	
	case 5:
	$("#up").modal('show');
	break;
	
	case 6:
	window.location.replace("/logout");
	break;
  
  }
  
}


function SigV4Utils() {}
    
    SigV4Utils.getSignatureKey = function (key, date, region, service) {
        let kDate = AWS.util.crypto.hmac('AWS4' + key, date, 'buffer');
        let kRegion = AWS.util.crypto.hmac(kDate, region, 'buffer');
        let kService = AWS.util.crypto.hmac(kRegion, service, 'buffer');
        let kCredentials = AWS.util.crypto.hmac(kService, 'aws4_request', 'buffer');    
        return kCredentials;
    };
    
    SigV4Utils.getSignedUrl = function(host, region, credentials) {
        let datetime = AWS.util.date.iso8601(new Date()).replace(/[:\-]|\.\d{3}/g, '');
        let date = datetime.substr(0, 8);
    
        let method = 'GET';
        let protocol = 'wss';
        let uri = '/mqtt';
        let service = 'iotdevicegateway';
        let algorithm = 'AWS4-HMAC-SHA256';
    
        let credentialScope = date + '/' + region + '/' + service + '/' + 'aws4_request';
        let canonicalQuerystring = 'X-Amz-Algorithm=' + algorithm;
        canonicalQuerystring += '&X-Amz-Credential=' + encodeURIComponent(credentials.accessKeyId + '/' + credentialScope);
        canonicalQuerystring += '&X-Amz-Date=' + datetime;
        canonicalQuerystring += '&X-Amz-SignedHeaders=host';
    
        let canonicalHeaders = 'host:' + host + '\n';
        let payloadHash = AWS.util.crypto.sha256('', 'hex')
        let canonicalRequest = method + '\n' + uri + '\n' + canonicalQuerystring + '\n' + canonicalHeaders + '\nhost\n' + payloadHash;
    
        let stringToSign = algorithm + '\n' + datetime + '\n' + credentialScope + '\n' + AWS.util.crypto.sha256(canonicalRequest, 'hex');
        let signingKey = SigV4Utils.getSignatureKey(credentials.secretAccessKey, date, region, service);
        let signature = AWS.util.crypto.hmac(signingKey, stringToSign, 'hex');
    
        canonicalQuerystring += '&X-Amz-Signature=' + signature;
        if (credentials.sessionToken) {
            canonicalQuerystring += '&X-Amz-Security-Token=' + encodeURIComponent(credentials.sessionToken);
        }
    
        let requestUrl = protocol + '://' + host + uri + '?' + canonicalQuerystring;
        return requestUrl;
    };
    

