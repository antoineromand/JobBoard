
$('#filtrebtn').click((e) => {
    $('.card').show()
    e.preventDefault()
    var data = {
        secteur: $('#secteurfiltre option:selected').html(),
        contrat: $('#contratfiltre option:selected').html(),
        ville: $('#villefiltre option:selected').html(),
    }
    let card = document.getElementById('cardlist').children
    for (let i = 0 ; i <= card.length; i++) {
        let index = i + 1
        if(card[i] !== undefined) {
            if($('#secteurfiltre').val() == "") {
                data.secteur = $('.secteur'+index).text()
            }
            if($('#contratfiltre').val() == "") {
                data.contrat = $('.contrat'+index).text()
            }
            if($('#villefiltre').val() == "") {
                data.ville = $('.ville'+index).text()
            }
            let ville = $('.ville'+index).text()
            if(data.ville !== ville ) {
                $('.c'+index).hide()
            }
            let contrat = $('.contrat'+index).text()
            if(data.contrat !== contrat ) {
                $('.c'+index).hide()
            }
            let secteur = $('.secteur'+index).text()
            if(data.secteur !== secteur ) {
                $('.c'+index).hide()
            } 
        }
        $('#down').hide()
    }
})

$('#reloadbtn').click(() => {
    window.location.replace('index.html')
})
