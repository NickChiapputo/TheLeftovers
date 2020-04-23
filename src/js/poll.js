

function communicateWithServer( data, request, url, asynchronous )
{
	var xmlHttp = new XMLHttpRequest();
	xmlHttp.open( request, url, asynchronous );
	xmlHttp.send( data );
	return xmlHttp;
}

//Displays a pie chart
function displayPoll()
{
    var url = "http://64.225.29.130/feedback/view"
    var method = "POST";
    var response = communicateWithServer("", method, url, false);
    var obj = JSON.parse(response.responseText);
    var question1 = "What was your favorite part of your experience?";
    var question2 = "Are there any comments you'd like to give to the management staff?";
    var question3 = "What was your least favorite part of your experience?";
    var question4 = "How would you rate your experience today?";
    var qServiceCount1, qEnvironmentCount1,qFoodCount1,qSystemCount1
    var qServiceCount2,qEnvironmentCount2,qFoodCount2,qSystemCount2;
    var rOneCount, rTwoCount,rThreeCount,rFourCount,rFiveCount;
    var rSixCount,rSevenCount,rEightCount,rNineCount,rTenCount;
    //Counts statistics from poll
    for(i=0; i<obj.length; i++)
    {
        for(var attr in obj[i])
        {
            if(obj[i].question==question1)
            {
                if(attr=="Service")
                    qServiceCount1=obj[i].Service;
                else if(attr=="Environment")
                    qEnvironmentCount1=obj[i].Environment;
                else if(attr=="Food")
                    qFoodCount1=obj[i].Food;
                else if(attr=="System")
                    qSystemCount1=obj[i].System;
            
            }
            else if(obj[i].question==question2)
            {
                if(attr!="question")
                    document.getElementById("cmt").innerHTML+="<table><th>"+attr+"</th></table>"
            }
            else if(obj[i].question==question3)
            {
                if(attr=="Service")
                    qServiceCount2=obj[i].Service;
                else if(attr=="Environment")
                    qEnvironmentCount2=obj[i].Environment;
                else if(attr=="Food")
                    qFoodCount2=obj[i].Food;
                else if(attr=="System")
                    qSystemCount2=obj[i].System;
            }
            else if(obj[i].question==question4)
            {
                if(attr=="1")
                    rOneCount=obj[i][attr];
                else if(attr=="2")
                    rTwoCount=obj[i][attr];
                else if(attr=="3")
                    rThreeCount=obj[i][attr];
                else if(attr=="4")
                    rFourCount=obj[i][attr];
                else if(attr=="5")
                    rFiveCount=obj[i][attr];
                else if(attr=="6")
                    rSixCount=obj[i][attr];
                else if(attr=="7")
                    rSevenCount=obj[i][attr];
                else if(attr=="8")
                    rEightCount=obj[i][attr];
                else if(attr=="9")
                    rNineCount=obj[i][attr];
                else if(attr=="10")
                    rTenCount=obj[i][attr];
            }
        }
    }
    //Retrieved from google chartts
    google.charts.load('current', {'packages':['corechart']});
    google.charts.setOnLoadCallback(drawChart);

    function drawChart() {

      var data = google.visualization.arrayToDataTable([
        ['Task', 'Favorite experience'],
        ['Service',    qServiceCount1],
        ['Environment', qEnvironmentCount1],
        ['Food',  qFoodCount1],
        ['System',    qSystemCount1]
      ]);

      var options = {
        title: question1
      };

      var chart = new google.visualization.PieChart(document.getElementById('piechart'));

      chart.draw(data, options);
    }

    google.charts.setOnLoadCallback(drawChart2);

    function drawChart2() {

      var data = google.visualization.arrayToDataTable([
        ['Task', 'Least favorite experience'],
        ['Service',    qServiceCount2],
        ['Environment', qEnvironmentCount2],
        ['Food',  qFoodCount2],
        ['System',    qSystemCount2]
      ]);

      var options = {
        title: question3,
        is3D:true
      };

      var chart = new google.visualization.PieChart(document.getElementById('piechart2'));

      chart.draw(data, options);
    }

    google.charts.load('current', {'packages':['bar']});
    google.charts.setOnLoadCallback(drawStuff);

    function drawStuff() {
      var data = new google.visualization.arrayToDataTable([
        ['Service', 'People'],
        ["1", rOneCount],
        ["2", rTwoCount],
        ["3", rThreeCount],
        ["4", rFourCount],
        ['5', rFiveCount],
        ["6", rSixCount],
        ["7", rSevenCount],
        ["8", rEightCount],
        ["9", rNineCount],
        ['10', rTenCount],
      ]);

      var options = {
        title: 'Rating of service',
        width: 400,
        height: 300,
        legend: { position: 'none' },
        chart: { title: 'Rating of service',
                 subtitle: 'Amount of votes' },
        bars: 'horizontal', // Required for Material Bar Charts.
        axes: {
          x: {
            0: { side: 'top', label: 'Votes'} // Top x-axis.
          }
        },
        bar: { groupWidth: "90%" }
      };

      var chart = new google.charts.Bar(document.getElementById('top_x_div'));
      chart.draw(data, options);
    };
    //Retrieved from google charts https://developers.google.com/chart/interactive/docs/gallery/piechart
    
    document.getElementById("cmt").innerHTML+=""
    
}