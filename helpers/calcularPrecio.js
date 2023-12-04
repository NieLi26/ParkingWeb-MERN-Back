
const calcularPrecio = ( entrada = Date.now(), salida = Date.now(), precioBase = 0, precioMinuto = 0, desdeMinuto = 0 ) => {
    const diferenciaEnMilisegundos = salida - entrada;

    // Puedes convertir la diferencia a segundos, minutos, horas, etc., según tus necesidades
    const diferenciaEnSegundos = diferenciaEnMilisegundos / 1000;
    const diferenciaEnMinutos = diferenciaEnSegundos / 60;

    const minutosRedondeados = Math.ceil(diferenciaEnMinutos)

    if ( minutosRedondeados <= desdeMinuto ) {
        return precioBase;
    }

    const precio = ((diferenciaEnMinutos - desdeMinuto) * precioMinuto) + precioBase;

    return Math.round(precio)
}


export default calcularPrecio