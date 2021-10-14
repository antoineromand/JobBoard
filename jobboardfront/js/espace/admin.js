$(document).ready(function () {
    $.get("http://localhost:5000/api/admin/listjobseeker", (data) => {
        data.forEach(element => {
            var options = {weekday: "long", year: "numeric", month: "long", day: "2-digit"};
            let date = new Date(element['date_inscr']).toLocaleDateString("fr-FR", options)
            // console.log(data)
            $('#adminuser').append('<tr><td>'+element['id']+'</td><td>'+element['nom']+'</td><td>'+element['prenom']+'</td><td>'+element['mail']+'</td><td>'+element['tel']+'</td><td>'+date+'</td><td><div class="text-center"><button class="btn btn-danger" onclick=deleteUser('+element['id']+') >X</button></div></td></tr>')
        });
        var table=$('#tableUser').DataTable( {

            "aLengthMenu": [
                [5, 10, 25, -1],
                [5, 10, 25, "All"]
            ],
            "iDisplayLength": 5
        } );
        table.draw();
    })
    $.get("http://localhost:5000/api/admin/listcompanyuser", (data) => {
        data.forEach(element => {
            // var options = {weekday: "long", year: "numeric", month: "long", day: "2-digit"};
            // let date = new Date(data['date_inscr']).toLocaleDateString("fr-FR", options)
            $('#admincompanies').append('<tr><td>'+element[0]+'</td><td class="text-uppercase">'+element[6]+' '+element[7]+'</span></td><td>'+element[8]+'</td><td>'+element[9]+'</td><td class="text-uppercase">'+element[1]+'</td><td>'+element[2]+'</td><td>'+element[5]+'</td><td>'+element[3]+'</td><td><div class="text-center"><button class="btn btn-danger"onclick=deleteUser('+element[0]+')>X</button></div></td></tr>')
        })
        var table=$('#tableCompany').DataTable( {
            "aLengthMenu": [
                [5, 10, 25, -1],
                [5, 10, 25, "All"]
            ],
            "iDisplayLength": 5
        } );
        table.draw();
    })
    $.get("http://localhost:5000/api/admin/joblist", (data) => {
        data.forEach(element => {
            var options = {weekday: "long", year: "numeric", month: "long", day: "2-digit"};
            let date = new Date(element[2]).toLocaleDateString("fr-FR", options) 
            $('#adminads').append('<tr><td>'+element[0]+'</td><td>'+element[1]+'</td><td>'+element[8]+'</td><td>'+element[3]+'</td><td>'+element[4]+'</td><td>'+date+'</td><td>'+element[5]+'</td><td><div class="text-center"><button class="btn btn-danger" onclick=deleteAd('+element[0]+')>X</button></div></td></tr>')
        })
        var table=$('#tableJob').DataTable( {
            "aLengthMenu": [
                [5, 10, 25, -1],
                [5, 10, 25, "All"]
            ],
            "iDisplayLength": 5
        } );
        table.draw();
        
    })
});
$('.title_espace').prepend('<div class="row"><h1 class="mb-4">Espace Administrateur</h1></div>')
$('.info_perso').hide()
$('.info_entreprises').hide()
$('#adjob').hide()

function checkAllUser(bx) {
    var cbs = document.getElementsByTagName('input');
    for (var i = 0; i < cbs.length; i++) {
        if (cbs[i].type == 'checkbox') {
            cbs[i].checked = bx.checked;
        }
    }
}

function checkAllJob(bx) {
    var cbs = document.getElementsByTagName('input');
    for (var i = 0; i < cbs.length; i++) {
        if (cbs[i].type == 'checkbox') {
            cbs[i].checked = bx.checked;
        }
    }
}

function deleteUser(id) {
    if(confirm("Voulez vous vraiment supprimer cet utilisateur ?")) 
    { 
        $.ajax({
            url: 'http://localhost:5000/api/admin/user/delete/' + id,
            type: 'DELETE',
            success: function(result) {
                alert(result)
                setTimeout(function(){window.location.replace("monespace.html")}, 1000);
            }
        }); 
    } 
    return false;
}

function deleteAd(id){
    if(confirm("Voulez vous vraiment supprimer cet annonce ?")) 
    { 
        $.ajax({
            url: 'http://localhost:5000/api/admin/ad/delete/' + id,
            type: 'DELETE',
            success: function(result) {
                alert(result)
                setTimeout(function(){window.location.replace("monespace.html")}, 1000);
            }
        }); 
    } 
    return false;
}

$('#btn1').text('Liste des utilisateurs')
$('#btn2').text('Liste des annonces')
$('.result').hide()
$('.menu').hide()
$('.user-warning').hide()