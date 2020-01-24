$(document).ready(()=>{
  show(1);
});

function getmeters(){
  
}


function getusers(){
  /*$.get("/sales").then((data)=>{
    let d=$.parseJSON(data);
	let vals={};
	vals["x"]=d["locs"];
	vals["y"]=d["datas"];
	vals["type"]='bar';
	let graph=new Array();
	graph.push(vals);
	Plotly.newPlot('graph', graph);
   });*/
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
