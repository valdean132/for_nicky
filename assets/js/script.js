
// url
//diretorio principal
const include_path = $('base').attr('base');

// Gerador de UUID
const generateUUID = () => { // Public Domain/MIT
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0,
            v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

// Formatando data
const formatarDataHora = (dataString) => {
    // Converte a string de data para um objeto Date
    var data = new Date(dataString);

    // Obtém o dia, mês, ano, horas e minutos
    var dia = data.getDate().toString().padStart(2, '0');
    var mes = (data.getMonth() + 1).toString().padStart(2, '0'); // Mês é baseado em 0
    var ano = data.getFullYear();
    var horas = data.getHours().toString().padStart(2, '0');
    var minutos = data.getMinutes().toString().padStart(2, '0');

    // Formata a data e hora no padrão DD/MM/YYYY HH:MM
    return dia + '/' + mes + '/' + ano + ' ' + horas + ':' + minutos;
}