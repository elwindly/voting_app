

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
var baseUrl = location.origin;
$(document).ready(function(){

jQuery('#login').on('submit',function(e){
    e.preventDefault();
    var email = jQuery('[name=emailLog]').val();
    var pwd = jQuery('[name=pwdLog]').val();
    var data ={
        emailLog:email,
        pwdLog:pwd
    };
    $.ajax({
        url: `${baseUrl}/users/login`,
        type: 'POST',
        data: data,
        success: function(data, textStatus, request) {
           $('#loginModal').modal('hide');     
           window.location.replace('/userLogged');
        },
        error: function(e) {
            console.log(e);
            alert('"Invalid username. email or password"');
        }
    });
 
});

jQuery('#signUp').on('submit',function(e){
    e.preventDefault();
    var email = jQuery('[name=email]').val();
    var pwd = jQuery('[name=password]').val();
    var name = jQuery('[name=name]').val();
    var data ={
        email:email,
        password:pwd,
        name:name
    };
    $.ajax({
        url: `${baseUrl}/users`,
        type: 'POST',
        data: data,
        success: function(data, textStatus, request) {
           $('#signUpModal').modal('hide');     
           window.location.replace('/userLogged');
        },
        error: function(e) {
            console.log(e);
            alert("Username or email is already in use!");
        }
    });
});



jQuery('#logOut').on('click',function(e){
    e.preventDefault();
    $.ajax({
        url: `${baseUrl}/users/me/token`,
        type: 'DELETE',
        success: function(result) {
            window.location.replace('/');
            alert('You succesfully logged out');
        }
    });
});

$('#options').change(function(){
    var inp = jQuery('#options').val();
 
    if(inp === 'add'){
       var textInp = jQuery('<input type="text" class="form-control" id="new" autofocus>');
       jQuery('#opList').append(textInp);
       jQuery('#pollButton').removeClass('disabled');
    }else if(inp === 'select'){
        jQuery('#new').remove();
        jQuery('#pollButton').addClass('disabled');
    }else{
        jQuery('#new').remove();
        jQuery('#pollButton').removeClass('disabled');
    }


});

jQuery('#vote').on('submit',function(e){
    e.preventDefault();
    //console.log('option',$('[name=option]').length);
    //console.log($(this).serializeArray());
    var inp = jQuery('#options').val();
    var id = jQuery('#options').data('id');

    if(inp === 'add'){

        var option = jQuery('#new').val().trim();
        if(!option || $('[name=option]').length > 9) {
            alert("There is too many option/ You can't submit an empty field!")
            return;
        }
        var data ={
            option:option,
            voteCount:1  
        };
       var method = 'POST';
    }else{
        var data = {inp:inp};
        var method = 'PATCH';
    }

    $.ajax({
        url: `${baseUrl}/poll/${id}`,
        type: method,
        data: data,
        success: function(data, textStatus, request) {
        
            if(inp === 'add'){
                pollData.push(1);
                pollOptions.push(option);
            }else{
                var index = pollOptions.indexOf(inp);
                pollData[index] +=1; 
            }

           pie.update();
        },
        error: function(e) {
            console.log(e);
            alert('Somethin went wrong');
        }
    });
 
});
    var counter = 2;
    $('#addOpt').click(function(){

        if(counter >= 10){
            alert('Only 10 option allowed');
            return false;
        }
        counter++;
        var html = '<div class="form-group" id="option'+ counter +'">';
            html += '<label class="control-label col-sm-2" for="option">Option:</label>';
            html += '<div class="col-sm-10">';
            html += '<input type="text" class="form-control" name="option" placeholder="Write an option" required>';
            html += '</div>'
            html += '</div>';
            
            $('#before').before(html);
    });
     $('#remove').click(function(){
         if(counter < 1){
             alert('There is nothing to remove');
             return false;
         }
            
            $('#option' + counter).remove();
            counter--;
    });

    jQuery('#newPoll').on('submit',function(e){
        e.preventDefault();
        //console.log($(this).serializeArray());
        var data = $(this).serializeArray();
        if(data.length < 3){
            alert("You must provide at least 2 options");
            return false;
        }
        for(let i = 0; i < data.length;i++){
            if(data[i].value == ''){
                alert("You cannot have empty fields");
                return false;
            }
        }
        //$.each($(this).serializeArray())
        $.ajax({
            url: `${baseUrl}/userLogged/newPoll`,
            type: 'POST',
            data: data,
            success: function(data, textStatus, request) {
                window.location.replace('/poll/' +data._id);

            },
            error: function(e) {
                console.log(e);
                alert('Something went wrong');
            }
            });
    
    });

    jQuery('#delete').on('click',function(e){
        e.preventDefault();

        if(!confirm("Are you sure you want to delete this poll?")){
            return;
        }
        var id = jQuery('#delete').data('id');
        console.log(id);
        $.ajax({
            url: `${baseUrl}/poll/${id}`,
            type: 'DELETE',
            success: function(data, textStatus, request) {
                window.location.replace('/userLogged');

            },
            error: function(e) {
                alert('Something went wrong');
            }
            });
    
    });
});




























// var x = location.origin;
// console.log(x);
// console.log(`${x}/api/getPools`);
// fetch(`${x}/api/getPools`)
//   .then((res)=>{
//     //console.log(JSON.stringify(result,'',2));
//     return res.json();
//   })
//   .then((polls)=>{
//       console.log(polls);
//   })
//   .catch((err)=>{
//     console.log(err);
//   });