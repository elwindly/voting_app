function createChart(title,labels,datapoints){
    var ctx = $("#myChart");
    var colorArr = [];
    for(let i = 0; i < labels.length;i++){
        colorArr.push(getRandomColor());
    }
    var myPieChart = new Chart(ctx,{
        type: 'pie',
        data: {
            labels:labels,
            datasets:[{
                label:title,
                data:datapoints,
                backgroundColor:colorArr}]},
            animation:{
                animateScale:true
            },
            options:{
                responsive:true,
                legend:{
                    position:"right"
                },
                title:{
                    display:true,
                    text:title
                }
        }
    });
    return myPieChart;
}

function getRandomColor() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}