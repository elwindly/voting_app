var baseUrl = location.origin;

$(document).ready(function(){


 ///// User handling logic start  
    //user login
    jQuery('#login').on('submit', function(e){
        e.preventDefault();
        var data ={
            emailLog:jQuery('[name=emailLog]').val(),
            pwdLog:jQuery('[name=pwdLog]').val()
        };
        ajaxRequest(`${baseUrl}/users/login`, 'POST', data, function(err, data) {
            if (!err) {
                window.location.replace('/userLogged');
            } else {
                alert('"Invalid username. email or password"');
            }
        });
    });

    //user signup
    jQuery('#signUp').on('submit',function(e){
        e.preventDefault();
        var data ={
            email:jQuery('[name=email]').val(),
            password:jQuery('[name=password]').val(),
            name:jQuery('[name=name]').val()
        };
        ajaxRequest(`${baseUrl}/users`, 'POST', data, function(err, data) {
            if (!err) {
                window.location.replace('/userLogged');
            } else {
                alert("Username or email is already in use!");
            }
        });
    });

    //user log out
    jQuery('#logOut').on('click',function(e){
        e.preventDefault();
        ajaxRequest(`${baseUrl}/users/me/token`, 'DELETE', {}, function(err, data) {
            if (!err) {
                window.location.replace('/');
                alert('You succesfully logged out');
            } 
        });
    });
 ///// User handling logic end

$('#options').change(function(){
    var inp = jQuery('#options').val();
 
    if (inp === 'add') {
       var textInp = jQuery('<input type="text" class="form-control" id="new" autofocus>');
       jQuery('#opList').append(textInp);
       jQuery('#pollButton').removeClass('disabled');
    } else if (inp === 'select'){
        jQuery('#new').remove();
        jQuery('#pollButton').addClass('disabled');
    } else {
        jQuery('#new').remove();
        jQuery('#pollButton').removeClass('disabled');
    }
});


    // optimist update on pie!!!
    jQuery('#vote').on('submit',function(e){
        e.preventDefault();

        var inp = jQuery('#options').val();
        var id = jQuery('#options').data('id');
        var data, method;
        if (inp === 'add') {
            var option = jQuery('#new').val().trim();
            if (!option || $('[name=option]').length > 9) {
                alert("There is too many option/ You can't submit an empty field!")
                return;
            }
            pollData.push(1);  
            pollOptions.push(option);
            data ={option:option, voteCount:1 };
            method = 'POST';
        } else {
            var index = pollOptions.indexOf(inp);
            pollData[index] +=1; 
            var data = {inp:inp};
            var method = 'PATCH';
        }
        pie.update();
        ajaxRequest(`${baseUrl}/poll/${id}`, method, data, function(err, data) {
            console.log(data);
                if (!err) {
                    
                } else {
                    alert('Something went wrong');
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
        ajaxRequest(`${baseUrl}/userLogged/newPoll`, 'POST', data, function(err, data) {
            if (!err) {
                window.location.replace('/poll/' +data._id);
            } else {
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

        ajaxRequest(`${baseUrl}/poll/${id}`, 'DELETE', {}, function(err, data) {
            if (!err) {
                window.location.replace('/userLogged');
            } else {
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