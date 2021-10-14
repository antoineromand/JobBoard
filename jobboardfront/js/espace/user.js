function b64_to_utf8(str) {
    return decodeURIComponent(escape(window.atob(str)));
}
$('.test').hide()


$(document).ready(() => {
    $('.menu').hide()
    let id = b64_to_utf8(localStorage.getItem('id'))
    $('.info_perso').append('<h4 id="ip" class="text-center p-1 mt-2">Ma liste de candidatures</h4>')
    $.get(
        "http://127.0.0.1:5000/api/users/allapplies/"+id +"", (data) => {
            let i = 0
            data.forEach(element => {
                i++
                var options = {weekday: "long", year: "numeric", month: "long", day: "2-digit"};
                let date = new Date(element[4]).toLocaleDateString("fr-FR", options)
                createRow(i, element, date)
            });
        })
})

$('.info_entreprises').hide()
