
const calcularTiempo = (entrada, salida) => {
    const diferenciaEnMilisegundos = salida - entrada;
    
    // Puedes convertir la diferencia a segundos, minutos, horas, etc., según tus necesidades

    // Calcula días, horas y minutos
    const dias = Math.floor(diferenciaEnMilisegundos / (1000 * 60 * 60 * 24));
    const horas = Math.floor((diferenciaEnMilisegundos % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutos = Math.floor((diferenciaEnMilisegundos % (1000 * 60 * 60)) / (1000 * 60));

    const diferencia = {
        dias,
        horas,
        minutos
    };


    // console.log(`Diferencia en milisegundos: ${diferenciaEnMilisegundos}`);
    // console.log(`Diferencia en segundos: ${diferenciaEnSegundos}`);
    // console.log(`Diferencia en minutos: ${diferenciaEnMinutos}`);
    // console.log(`Diferencia en horas: ${diferenciaEnHoras}`);
    return diferencia
}

export default calcularTiempo
