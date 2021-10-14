//TODO: integré modale d'ajout d'annonce 
//petite modale de modification d'offre
//petite modale pour voir qui a postulé à l'offre ciblé dans le tableau

function b64_to_utf8(str) {
    return decodeURIComponent(escape(window.atob(str)));
}

function nl2br(str, isXhtml) {
    // Some latest browsers when str is null return and unexpected null value
    if (typeof str === 'undefined' || str === null) {
        return ''
    }
    // Adjust comment to avoid issue on locutus.io display
    var breakTag = (isXhtml || typeof isXhtml === 'undefined') ? '<br ' + '/>' : '<br>'

    return (str + '')
        .replace(/(\r\n|\n\r|\r|\n)/g, breakTag + '$1')
}
$('.user-warning').hide()
$("#listcandidat").hide()
$('.test').hide()
$('.menu').hide()
$('.resultat').hide()
$('#forRecruter').show()
$('#adjob').hide()

if (localStorage.getItem('id')) {
    $('#connexion').attr("href", "")
    $('#connexion').attr("data-bs-toggle", "")
    $('#connexion').attr("data-bs-target", "")
    $('#connexion').attr("onclick", "deco()")
    $('#connexion').text('Logout')
    $('#monespace').show()
}

$(document).ready(() => {
    let id = b64_to_utf8(localStorage.getItem('id'))
    $.get("http://127.0.0.1:5000/api/company/get/" + id + "", (data) => {
        // console.log(data)
        $("#nomEntreprise").attr('value', data[1])
        $("#secteurEntreprise").attr('value', data[2])
        $("#villeEntreprise").attr('value', data[3])
        $("#siteWebEntreprise").attr('value', data[5])
        $("#descriptionEntreprise").val(data[4])
        //Ajouter les informations dans le formulaire
        $('#entreprisenom').attr('value', data[1])
        $('#secteurmodif').attr('value', data[2])
        $('#villemodif').attr('value', data[3])
        $("#sitewebmodif").attr('value', data[5])
        $("#descrmodifcp").val(data[4])
    })
    $.get("http://127.0.0.1:5000/api/job/getall/" + id, (data) => {
        let i = 0
        data.forEach(element => {
            i++
            var options = { weekday: "long", year: "numeric", month: "long", day: "2-digit" };
            let date = new Date(element[2]).toLocaleDateString("fr-FR", options)
            let idAd = element[0];
            $('#forRecruter tbody').append('<tr class="tr' + i + '"></tr>')
            $('.tr' + i).append(
                '<td>' + element[1] + '</td>',
                '<td>' + date + '</td>',
                '<td>' + element[4] + '</td>',
                '<td>' + element[3] + '</td>',
                '<td>' + element[5] + '</td>',
                '<td><div class="text-center"><button class="btn btn-warning" data-bs-toggle="modal" data-bs-target="#modalModifAd' + i + '" ><i class="fas fa-edit"></i></button></div></td>',
                '<td><div class="text-center"><button class="btn btn_change" data-bs-toggle="modal" data-bs-target="#candidatslist' + i + '" ><i class="far fa-folder-open"></i></button></div></td>',
                '<td><div class="text-center"><button class="btn btn-danger" id="deletethisad' + i + '">X</button></div></td>'
            )
            modalcandidat(i, element[1], idAd)
            modalmodifad(i, element, id)
            modifadajax(i, id, idAd)
            deleteadajax(i, id, idAd, element[1])
        })
    })
})

function modalmodifad(i, element) {
    $('#forRecruter').append('<div class="modal fade" id="modalModifAd' + i + '" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true"></div>')
    $('#modalModifAd' + i).append('<div class="modal-dialog modal-lg modal-dialog-scrollable" id="mg' + i + '" role="document"></div>')
    $('#mg' + i).append('<div class="modal-content" id="mc' + i + '"></div>')
    $('#mc' + i).append('<div class="modal-header"><h5 class="modal-title">Modifier cette annonce</h5><button type="button" class="btn btn-danger close" data-bs-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>')
    $('#mc' + i).append('<div class="modal-body" id="mb' + i + '"></div>')
    $('#mb' + i).append('<form id="modifadform' + i + '"></form>')
    $('#modifadform' + i).append('<div class="form-group row ms-5 me-5 mt-3"><label for="modifpostead' + i + '" class="col-md-2 col-form-label"><h5>Poste</h5></label><div class="col-md-10"><input type="text" value="' + element[1] + '" class="form-control" id="modifpostead' + i + '"></div></div>')
    $('#modifadform' + i).append('<div class="form-group row ms-5 me-5 mt-3 mdville' + i + '"><label for="modifvillead' + i + '" class="col-12 col-md-2 col-form-label"><h5>Localisation</h5></label><div class="col-12 col-md-10"><select class="form-select" size="5" aria-label="size 5 select example" id="modifvillead' + i + '" required><option option selected value="" > France</option ><option value="1">Paris</option><option value="2">Marseille</option><option value="3">Lyon</option><option value="4">Toulouse</option><option value="5">Nice</option><option value="6">Nantes</option><option value="7">Strasbourg</option><option value="8">Montpellier</option><option value="9">Bordeaux</option><option value="10">Lille</option><option value="11">Rennes</option><option value="12">Reims</option><option value="13">Le Havre</option><option value="14">Saint-Étienne</option><option value="15">Toulon</option><option value="16">Grenoble</option><option value="17">Dijon</option><option value="18">Angers</option><option value="19">Nîmes</option><option value="20">Villeurbanne</option><option value="21">Saint-Denis</option><option value="22">Le Mans</option><option value="23">Clermont-Ferrand</option><option value="24">Aix-en-Provence</option><option value="25">Brest</option></select ></div></div>')
    $('.mdville' + i).prepend('<p>Localisation de l\'annonce : ' + element[5] + '</p>')
    $('.mdville' + i).prepend('<div class="alert alert-warning" role="alert">Si vous ne changez pas ce champ, veuillez le re-renseigner</div>')
    $('#modifadform' + i).append('<div class="form-group row ms-5 me-5 mt-3 mdsecteur' + i + '"><label for="modifsecteurad' + i + '" class="col-md-2 col-form-label"><h5>Secteur d\'activité</h5></label><div class="col-md-10"><select class="form-select" size="5" aria-label="size 5 select example" id="modifsecteurad' + i + '" required><option selected value="">Autre</option><option value="1">Informatique / Télécoms</option><option value="2">Agroalimentaire</option><option value="3">Banque / Assurance</option><option value="4">Chimie / Parachimie</option><option value="5">Études et conseils</option><option value="6">Métallurgie / Travail du métal</option><option value="7">Transports / Logistique</option><option value="9">Textile / Habillement / Chaussure</option><option value="10">Plastique / Caoutchouc</option><option value="11">Machines et équipements / Automobile</option><option value="12">BTP / Matériaux de construction</option><option value="13">Bois / Papier / Carton / Imprimerie</option><option value="14">Édition / Communication / Multimédia</option><option value="15">Électronique / Électricité</option><option value="16">Industrie pharmaceutique</option><option value="17">Services aux entreprises</option><option value="18">Commerce / Négoce / Distribution</option></select></div></div>')
    $('.mdsecteur' + i).prepend('<p>Secteur de l\'annonce : ' + element[4] + '</p>')
    $('.mdsecteur' + i).prepend('<div class="alert alert-warning" role="alert">Si vous ne changez pas ce champ, veuillez le re-renseigner</div>')
    $('#modifadform' + i).append('<div class="form-group row ms-5 me-5 mt-3 mdcontrat' + i + '"><label for="modifcontratad' + i + '" class="col-md-2 col-form-label"><h5>Type de contrat</h5></label><div class="col-md-10"><select class="form-select" size="3" aria-label="size 3 select example" id="modifcontratad' + i + '" required><option value="" selected>Autre</option><option value="CDI">CDI</option><option value="CDD">CDD</option><option value="ALTERNANCE">Alternance</option><option value="STAGE">Stage</option></select></div></div>')
    $('.mdcontrat' + i).prepend('<p>Type de contrat de l\'annonce : ' + element[3] + '</p>')
    $('.mdcontrat' + i).prepend('<div class="alert alert-warning" role="alert">Si vous ne changez pas ce champ, veuillez le re-renseigner</div>')
    $('#modifadform' + i).append('<div class="form-group row ms-5 me-5 mt-3"><label for="salarymodif" class="col-md-2 col-form-label"><h5>Salaire</h5></label><div class="col-md-6"><input type="text" class="form-control" id="salarymodif' + i + '" value="' + element[6] + '"></div></div>')
    $('#modifadform' + i).append('<div class="form-group row ms-5 me-5"><label for="modifmessage_recruteur' + i + '" class="col-md-2 col-form-label"><h5>Message</h5></label><div class="col-md-10"><textarea rows="5" class="form-control messageRecruteur" id="modifmessage_recruteur' + i + '"></textarea></div></div>')
    $("#modifmessage_recruteur" + i).val(element[7])
    $('#modifadform' + i).append('<div class="text-center mt-3"><button type="submit" id="modifthisad' + i + '" class="btn btn_edit">Modifier l\'annonce</button></div>')
}

function modifadajax(i, id, idAd) {
    $('#modifthisad' + i).click((e) => {
        e.preventDefault()
        var data = {
            poste: $('#modifpostead' + i).val(),
            secteur_activite: $('#modifsecteurad' + i + ' option:selected').html(),
            type_emploi: $('#modifcontratad' + i + ' option:selected').html(),
            ville: $('#modifvillead' + i + ' option:selected').html(),
            salaire: $('#salarymodif' + i).val(),
            description: $('#modifmessage_recruteur' + i).val()
        }
        let jsonConvert = JSON.stringify(data)
        $.ajax({
            method: "POST",
            url: "http://localhost:5000/api/job/update/" + id + "/" + idAd,
            data: jsonConvert,
            contentType: "application/json",
            dataType: 'JSON',
            success: function (data) {
                $('#modifadform' + i).append('<div class="alert alert-success mt-2" role="alert">' + data + '</div>')
                // Redirection
                setTimeout(function () { window.location.replace("monespace.html") }, 2000);
            },
            error: function (request, error) {
                alert(request.responseText);
                alert(error)
            }
        })
    })
}

function deleteadajax(i, id, idAd, titre) {
    $('#deletethisad' + i).click((e) => {
        e.preventDefault()
        if (confirm("Voulez vous vraiment supprimer cet annonce : " + titre + " ?")) {
            $.ajax({
                url: 'http://localhost:5000/api/job/delete/' + id + '/' + idAd,
                type: 'DELETE',
                success: function (result) {
                    alert(result)
                    setTimeout(function () { window.location.replace("monespace.html") }, 1000);
                }
            });
        }
        return false;
    })
}



function modalcandidat(i, titre, id) {
    $('#forRecruter').append('<div class="modal fade" id="candidatslist' + i + '" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true"></div>')
    $('#candidatslist' + i).append('<div class="modal-dialog mg' + i + '" role="document"></div>')
    $('.mg' + i).append('<div class="modal-content mc' + i + '"></div>')
    $('.mc' + i).append('<div class="modal-header"><h5 class="modal-title" id="exampleModalLabel">' + titre + '</h5><button type="button" class="btn btn-danger close" data-bs-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>')
    $('.mc' + i).append('<div class="modal-body mb' + i + '"></div>')
    $.get("http://127.0.0.1:5000/api/job/candidats/" + id, (data) => {
        if (data.length == 0) {
            $('.mb' + i).append('<h6>Pas de candidat actuellement !</h6><br>')
        }
        data.forEach(el => {
            var options = { weekday: "long", year: "numeric", month: "long", day: "2-digit" };
            let date = new Date(el[5]).toLocaleDateString("fr-FR", options)
            $('.mb' + i).append('<h4 class="text-uppercase">' + el[1] + ' ' + el[0] + '</h4>')
            $('.mb' + i).append('<h5>Mail : <span class="h6">' + el[3] + '</span></h5>')
            $('.mb' + i).append('<h5>Tél : <span class="h6">' + el[2] + '</span></h5>')
            $('.mb' + i).append('<h5>Date Candidature : ' + date + '</h5>')
            $('.mb' + i).append('<h5>Message :</h5><br>')
            $('.mb' + i).append('<h6 class="text-jutify">' + nl2br(el[4]) + '</h6><br>')
            $('.mb' + i).append('<br><hr>')
        })
    })

}

$('#modifrequestcp').click((e) => {
    e.preventDefault()
    let id = b64_to_utf8(localStorage.getItem('id'))
    var data = {
        nom: $('#entreprisenom').val(),
        secteur: $('#secteurmodif').val(),
        ville: $('#villemodif').val(),
        site_web: $('#sitewebmodif').val(),
        description: $('#descrmodifcp').val()
    }
    let jsonConvert = JSON.stringify(data)
    $.ajax({
        method: "POST",
        url: "http://localhost:5000/api/company/update/" + id + "",
        data: jsonConvert,
        contentType: "application/json",
        dataType: 'JSON',
        success: function (data) {
            $('form').append('<div class="alert alert-success mt-2" role="alert">' + data + '</div>')
            // Redirection
            setTimeout(function () { window.location.replace("monespace.html") }, 1000);
        },
        error: function (request, error) {
            alert(request.responseText);
            alert(error)
        }
    })
})


function deco() {
    localStorage.removeItem('id')
    localStorage.removeItem('role')
    window.location.replace('index.html')
}

// $('#main').append('<div class="row" id="recruter"></div>')
// $('#recruter').append('<div></div>')
$('#modifcp').click((e) => {
    e.preventDefault()
    $('#companymodif').show()
    $('#modifcp').hide()
})

$('#closecp').click((e) => {
    e.preventDefault()
    $('#companymodif').hide()
    $('#modifcp').show()
})