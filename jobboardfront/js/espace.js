function b64_to_utf8(str) {
    return decodeURIComponent(escape(window.atob(str)));
}

$('#forRecruter').hide()

if(localStorage.getItem('id') && localStorage.getItem('role') == 0) {
    $.getScript("js/espace/user.js")
    $("#listcandidatclass").show()
    $('#tableUser').hide()
    $('#tableCompany').hide()
    $('#tableJob').hide()
    $('#adjob').hide()
} else if (localStorage.getItem('id') && localStorage.getItem('role') == 1) {
    $.getScript("js/espace/company.js")

} else if (localStorage.getItem('id') && localStorage.getItem('role') == 2) {
    $.getScript("js/espace/admin.js")
    
} else {
    window.location.replace("../index.html")
}



if (localStorage.getItem('id')) {
    $('#connexion').attr("href", "")
    $('#connexion').attr("data-bs-toggle", "")
    $('#connexion').attr("data-bs-target", "")    
    $('#connexion').attr("onclick", "deco()")
    $('#connexion').text("Logout")
    $('#monespace').show()
}

function deco() {
    localStorage.removeItem('id')
    localStorage.removeItem('role')
    window.location.replace('index.html')
}
function createRow(i, element, date) {
    $('.listcandidatclass').append('<tr class="tr'+i+'"></tr>')
    $('.tr'+i).append('<td>'+element[0]+'</td>',
    '<td>'+element[3]+'</td>',
    '<td>'+element[1]+'</td>',
    '<td>'+date+'</td>',
    '<td>'+element[2]+'</td>')
}
$(document).ready(() => {
    let id = b64_to_utf8(localStorage.getItem('id'))
    $.get("http://127.0.0.1:5000/api/users/get/"+ id +"" , (data) => {
        var options = {weekday: "long", year: "numeric", month: "long", day: "2-digit"};
        let date = new Date(data['date_inscr']).toLocaleDateString("fr-FR", options)
        $("#prenom").attr('value', data['prenom'] )
        $("#nom").attr('value', data['nom'])
        $("#mail").attr('value', data['mail'])
        $("#tel").attr('value', data['tel'])
        $('#date_inscr').attr('value', date )
        //Ajouter les informations dans le formulaire
        $('#prenommodif').attr('value', data['prenom'])
        $('#nommodif').attr('value', data['nom'])
        $('#telmodif').attr('value', data['tel'])
        $("#mailmodif").attr('value', data['mail'])
    })
    
})

$('#modifrequest').click((e) => {
    e.preventDefault()
    let id = b64_to_utf8(localStorage.getItem('id'))
    var data={
        mail: $('#mailmodif').val(),
        prenom: $('#prenommodif').val(),
        nom: $('#nommodif').val(),
        tel: $('#telmodif').val()
       }
    let jsonConvert = JSON.stringify(data)
    $.ajax({
        method: "POST",
        url: "http://localhost:5000/api/users/update/"+id+"",
        data: jsonConvert,
        contentType: "application/json",
        dataType: 'JSON',
        success: function (data) {
            $('form').append('<div class="alert alert-success mt-2" role="alert">'+ data +'</div>')
            // Redirection
            setTimeout(function(){window.location.replace("monespace.html")}, 1000);
        },
        error: function (request, error) {
            alert(request.responseText);
            alert(error)
        }
    })
})

$('#modifpass').click((e) => {
    e.preventDefault()
    let pass = {
        mdp: $('#passmodif').val()
    }
    let id = b64_to_utf8(localStorage.getItem('id'))
    let jsonMdp = JSON.stringify(pass)
    $.ajax({
        method: "POST",
        url: "http://localhost:5000/api/users/changepass/"+id+"",
        data: jsonMdp,
        contentType: "application/json",
        dataType: 'JSON',
        success: function (data) {
            $('form').append('<div class="alert alert-success mt-2 mb-2" role="alert">'+ data +'</div>')
            // Redirection
            setTimeout(function(){window.location.replace("monespace.html")}, 1000);
        },
        error: function (request, error) {
            alert(request.responseText);
            alert(error)
        }
    })
})


$('#companymodif').hide()
$('#cardmodif').hide()

$('#modif').click((e) => {
    e.preventDefault()
    $('#cardmodif').show()
    $('#modif').hide()
})

$('#close').click((e) => {
    e.preventDefault()
    $('#cardmodif').hide()
    $('#modif').show()
})

