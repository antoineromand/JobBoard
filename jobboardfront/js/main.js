function utf8_to_b64(str) {
    return window.btoa(unescape(encodeURIComponent(str)));
}
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

// console.log(b64_to_utf8(localStorage.getItem('id')))
$('.post').hide();
$('#up').hide();
$('#monespace').hide()
$('#logoespace').hide()
$('#adjob').hide()
if (localStorage.getItem('id')) {
    $('#connexion').attr("href", "")
    $('#connexion').attr("data-bs-toggle", "")
    $('#connexion').attr("data-bs-target", "")
    $('#connexion').attr("onclick", "deco()")
    $('#connexion').text('Logout')
    $('#monespace').show()
    $('#logoespace').show()
    if (localStorage.getItem('role') == 1) {
        $('#adjob').show()
    }

}
if (localStorage.getItem('role') == 1) {
    let id = b64_to_utf8(localStorage.getItem('id'))
    $.get("http://127.0.0.1:5000/api/company/get/" + id, (data) => {
        $('#nameCompany').attr('value', data[1])
    })
}

function modal(i, id, offre) {
    $.get(
        "http://127.0.0.1:5000/api/users/get/" + id + "", (data) => {
            $('body').append('<div class="modal fade" id="modalApplication' + i + '" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true"></div>')
            $('#modalApplication' + i + '').append('<div class="modal-dialog modal-xl mf' + i + '"></div>')
            $('.mf' + i).append('<div class="modal-content mc' + i + '"></div>')
            $('.mc' + i).append('<div class="modal-header mh' + i + '"><h2 class="modal-title ms-5" id="exampleModalLabel">Postuler pour ' + offre[1] + '</h2><button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button></div>')
            $('.mc' + i).append('<div class="modal-body container-fluid mb' + i + '"></div>')
            $('.mb' + i).append('<form class="form' + i + '"></div>')
            $('.form' + i).append('<div class="form-group row ms-5 me-5 mt-4"><label for="name" class="col-sm-2 col-form-label"><h5>Nom complet</h5></label><div class="col-sm-5"><input type="text" class="form-control" id="prenom" value="' + data['prenom'] + '" readonly></div><div class="col-sm-5"><input type="text" class="form-control" id="nom" value="' + data['nom'] + '" readonly></div></div><br><hr><br><div class="form-group row ms-5 me-5"><label for="email" class="col-sm-2 col-form-label"><h5>Email</h5></label><div class="col-sm-10"><input type="text" class="form-control" id="mailuser" value="' + data['mail'] + '" readonly></div></div><br><hr><br><div class="form-group row ms-5 me-5"><label for="message' + i + '" class="col-sm-2 col-form-label"><h5>Message</h5></label><div class="col-sm-10"><textarea class="form-control messageChomeur" id="message' + i + '" placeholder="Message envoyé à lemployeur"></textarea></div></div><br><hr><br><button type="button" class="btn btn-primary btn-lg ms-5 me-5" id="postuler' + i + '">Envoyer la candidature</button>')
            modalPostul(offre, i, id)

        }
    )
}

function deco() {
    localStorage.removeItem('id')
    localStorage.removeItem('role')
    window.location.replace('index.html')
}

function deroulcard(btn) {
    $('.' + btn).on("click", function () {
        $(this).parent().find(".more").toggle();
        if ($(this).parent().find(".more").is(":visible")) {
            $(this).text("En savoir -");
        } else {
            $(this).text("En savoir +");
        }
    });
}

function checkpost(i, idAd, idUser) {
    $.get(
        "http://127.0.0.1:5000/api/users/checkpostule/" + idUser + "/" + idAd + "", (data) => {
            if (data['verif'] == true) {
                $('#btnpost' + i).html('Déjà Postulé <i class="far fa-check-circle ml-2"></i>')
                $('#btnpost' + i).attr('data-bs-toggle', '')
                $('#btnpost' + i).attr('data-bs-target', '')
            }
        }
    )
}


function modalPostul(offre, i, id) {
    let nameOffre = offre[1]
    $("#postuler" + i).click((e) => {
        let annonce = {
            message: $('#message' + i).val()
        }
        let jsonConvert = JSON.stringify(annonce)
        e.preventDefault()
        $.ajax({
            method: "POST",
            url: "http://localhost:5000/api/users/applyjob/" + id + "/" + offre[0] + "",
            data: jsonConvert,
            contentType: "application/json",
            dataType: 'JSON',
            success: function (data) {
                $('form').prepend('<div class="alert alert-success mt-2 mb-2" role="alert">Vous avez bien postulé à cette offre ' + nameOffre + ' </div>')
                // Redirection
                setTimeout(function () { window.location.replace("index.html") }, 2000);
            },
            error: function (request, error) {
                alert(request.responseText);
                alert(error)
            }
        })
    })
}

function createCard(i, element) {
    $('#cardlist').append('<div class="card cardad c' + i + '"></div>')
    $('.c' + i).append('<div class="card-header ch' + i + '"></div>')
    $('.ch' + i).append(
        '<h5 class="card-title poste"><i class="fab fa-adversal"></i>' + element[1] + '</h5>',
        '<h6 class="card-subtitle mb-2 text-muted contrat contrat'+i+'"><i class="fas fa-file-contract"></i>' + element[3] + '</h6>',
        '<h6 class="card-subtitle mb-2 text-muted entreprise"><i class="fas fa-building"></i>' + element[8] + '</h6>')
    $('.c' + i).append('<div class="card-body cb' + i + '"></div>')
    $('.cb' + i).append('<div class="more m' + i + '"></div>')
    $('.m' + i).append('<div class="desc_un du' + i + '"></div>')
    $('.m'+i).append('<hr>')
    var options = { weekday: "long", year: "numeric", month: "long", day: "2-digit" };
    let date = new Date(element[2]).toLocaleDateString("fr-FR", options)
    $('.du' + i).append(
        '<p class="date text-uppercase"><i class="far fa-calendar-alt"></i>' + date + '</p>',
        '<p class="ville'+i+'"><i class="fas fa-map-marker-alt"></i>' + element[5] + '</p>',
        '<p class="salaire"><i class="fas fa-euro-sign"></i>' + element[6] + '</p>',
        '<p class="secteur'+i+'"><i class="fas fa-briefcase"></i>' + element[4] + '</p>')
    $('.m' + i).append('<div class="desc_deux dd' + i + '"></div>')
    $('.dd' + i).append('<h6>Description du poste</h6>')
    $('.dd' + i).append('<p class="description">' + nl2br(element[7]) + '</p>')
    $('.cb' + i).append('<button href="#!" class="btn btn-primary card-link sav s' + i + '">En savoir +</button>')
    $('.cb' + i).append('<br>')
    $('.m' + i).append('<button type="button" class="btn btn-success mb-3" id="btnpost' + i + '" data-bs-toggle="modal" data-bs-target="#modalApplication' + i + '">Postuler</button>')
    deroulcard('s' + i)
}

function numberCandidat(i, idAd) {
    $.get(
        "http://127.0.0.1:5000/api/job/count/" + idAd + "", (data) => {
            $('.ch' + i).append(
                '<h6 class="card-subtitle mb-2 text-muted"><i class="fas fa-users"></i>' + data[0] + ' Candidat(s)</h6>')
        }
    )
}


$(document).ready(() => {
    $.get(
        "http://127.0.0.1:5000/api/job/list", (data) => {
            let i = 0
            // console.log(data.length)
            data.forEach(element => {
                i++
                let idAd = element[0]
                createCard(i, element)
                numberCandidat(i, idAd)
                if(data.length < 49) {
                    if(i>2) {
                        $('.c'+i).hide()
                    }
                }
                if(data.length < 50) {
                    if(i>15) {
                        $('.c'+i).hide()
                    }
                }
                
                if (localStorage.getItem('id')) {
                    const uid = b64_to_utf8(localStorage.getItem('id'))
                    modal(i, uid, element)
                    checkpost(i, idAd, uid)
                } else {
                    $("#btnpost" + i).hide()
                }
                if (localStorage.getItem('role') != 0) {
                    $("#btnpost" + i).hide()
                }
            });
        }
    )
    
})

//ADD AD FOR RECRUTER

$('#publish').click((e) => {
    e.preventDefault()
    let id = b64_to_utf8(localStorage.getItem('id'))
    let select_ville = $("#ville_post option:selected").html()
    let select_contrat = $("#contrat_post option:selected").html()
    let select_secteur = $("#secteur_post option:selected").html()
    var data = {
        poste: $('#posteName').val(),
        type_emploi: select_contrat,
        secteur_activite: select_secteur,
        ville: select_ville,
        salaire: $('#salary').val(),
        description: $('#message_recruteur').val(),
        entreprise: $('#nameCompany').val(),
    }
    let jsonConvert = JSON.stringify(data)
    $.ajax({
        method: "POST",
        url: "http://127.0.0.1:5000/api/job/add/" + id,
        data: jsonConvert,
        contentType: "application/json",
        dataType: 'JSON',
        success: function (data) {
            $('#publishnewjob').append('<div class="alert alert-success mt-2" role="alert">' + data + '</div>')
            // Redirection
            setTimeout(function(){window.location.replace("index.html")}, 1000);
        }
    })

})



$("#down").click(() => {
    let list = document.getElementById('cardlist');
    let cards = list.getElementsByClassName('card');
    for (let i = 0; i <= cards.length; i++) {
        $(cards[i]).show();
    }
    $("#down").hide();
    $("#up").show();
})

$("#up").click(() => {
    let list = document.getElementById('cardlist');
    let cards = list.getElementsByClassName('card');
    for (let i = cards.length; i > 1; i--) {
        $(cards[i]).hide();
    }
    $("#down").show();
    $("#up").hide();
})
