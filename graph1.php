<?php
$con = mysqli_connect("localhost","root","","mydb");
if($con){​​
echo "connected";
}​​
?>
<html>
<head>
<script type="text/javascript" src="https://www.gstatic.com/charts/loader.js">
<script type="text/javascript">
google.charts.load('current', {​​'packages':['corechart']}​​);
google.charts.setOnLoadCallback(drawChart);



function drawChart() {​​



var data = google.visualization.arrayToDataTable([
['grievance_type', 'dep_name'],
<?php
$sql = "SELECT * FROM grievance";
$fire = mysqli_query($con,$sql);
while ($result = mysqli_fetch_assoc($fire)) {​​
echo"['".$result['grievance_type']."',".$result['dep_name']."],";
}​​



?>
]);



var options = {​​
title: 'Grievance and their departments'
}​​;



var chart = new google.visualization.PieChart(document.getElementById('piechart'));



chart.draw(data, options);
}​​
</script>
</head>
<body>
<div id="piechart" style="width: 900px; height: 500px;"></div>
</body>
</html>