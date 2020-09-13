function redirect1(){window.location.href="d_analysis.html";}
function redirect2(){window.location.href="import.html";}
function show_data(){          //απεικόνηση στοιχείων χρήστη
			$.ajax({ 
       		type: "POST", 
       		url: "show_user_data.php",
       		dataType:"json", 
       		success: function(data) {
       		    console.log(data);

                document.getElementById("period").innerHTML=data[2]+ "\t"+ "-" + "\t" +data[3];
                if (typeof(data[0])!="string"){                                                       //είσοδος χρήστη με δεδομένα
	                document.getElementById("score").innerHTML=data[0][12] + '%';
	                graph(data[0],data[1]);
	       		    document.getElementById("date").innerHTML=data[4];
       			    leaderboard(data[0][12],data[5],data[6],data[7]);
                }else{                                                                               //είσοδος χρήστη χωρίς δεδομένα
                	document.getElementById("score").innerHTML=data[0];
                	document.getElementById("date").innerHTML= "-";
                	leaderboard(data[0],data[5],data[6],data[7]);
                }
        	}
		});

}

function graph(data,labels){                                           //δημιουργία γραφήματος οικολογικής κίνησης
    let myChart=document.getElementById("myChart").getContext("2d");
    let barchart=new Chart(myChart,{
    	type:'line',
    	data:{
    		labels:labels,
    		datasets: [{
    			label:'Score οικολογικής μετακίνησης (%)',
    			data: data,
    			pointBorderColor:['#49e2ff', '#fff000', '#111000', '#FF0000',
                        '#00FF00', '#0000FF', '#00FFFF', '#FF00FF', '#C0C0C0','#808080',
                        '#800000','#808000','#808080'],
    			pointBackgroundColor:['#49e2ff', '#fff000', '#111000', '#FF0000',
                        '#00FF00', '#0000FF', '#00FFFF', '#FF00FF', '#C0C0C0','#808080',
                        '#800000','#808000','#808080'],
                borderWidth: 1,
                borderColor:'#f72b2b',        
    		}]
    	},
		options:{
			legend:{
				display:false
			},
			title: {
	            display: true,
	            fontSize: 18,
	            text: 'Score οικολογικής μετακίνησης τους τελευταίους 12 μήνες(%)'
	         },
	        tooltips: {
	            callbacks: {
	              label: function(tooltipItems, data) {
	                return data.labels[tooltipItems.index] +
	                " : " +
	                data.datasets[tooltipItems.datasetIndex].data[tooltipItems.index] +
	                ' %';
	             }
	          }
	        },
	        scales:{
				yAxes:[{
					scaleLabel:{
						display:true,
						labelString: 'Score(%)'
					}
				}],
				xAxes:[{
					scaleLabel:{
						display:true,
						labelString:'Μήνας-Έτος'
					}
				}]
			},
			elements:{
				line:{
					fill:false
				}
			}
		}
    });
}

function leaderboard(current,scores,names,rank){                                 //δημιουργία leaderboard
    ranks=["1","2","3",rank];
    scores[3]=current;
	table=document.getElementById("tb");
	tableBody=document.createElement("tbody");
    th=document.createElement("th");
	th.appendChild(document.createTextNode('Rank'));
	tableBody.appendChild(th);
	th=document.createElement("th");
	th.appendChild(document.createTextNode('Username'));
	tableBody.appendChild(th);
	th=document.createElement("th");
	th.appendChild(document.createTextNode('Score'));
	tableBody.appendChild(th);
	table.appendChild(tableBody);
	for(i=0;i<names.length;i++){
		tr=document.createElement("tr");
		if(i==names.length-1) tr.setAttribute("style","background-color: #c4c4c4;"); //highlight κατάταξη συνδεδεμένου χρήστη
		td1=document.createElement("td");
		td2=document.createElement("td");
		td3=document.createElement("td");
		datatd1=document.createTextNode(ranks[i]);
		datatd2=document.createTextNode(names[i]);
		if (scores[i]=="-") datatd3=document.createTextNode(scores[i]);
		else datatd3=document.createTextNode(scores[i] + '%');
		td1.appendChild(datatd1);
        td2.appendChild(datatd2);
        td3.appendChild(datatd3);
        tr.appendChild(td1);
        tr.appendChild(td2);
        tr.appendChild(td3);
        tableBody.appendChild(tr);
	}
	table.appendChild(tableBody);
}